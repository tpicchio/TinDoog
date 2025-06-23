import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { PrismaClient } from '@/generated/prisma'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { parseISO, addSeconds } from 'date-fns';

const prisma = new PrismaClient()

const isAwsConfigured = () => {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME']
  return required.every(key => process.env[key] && process.env[key].trim() !== '')
}

const s3Client = isAwsConfigured() ? new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}) : null

async function generateFreshPresignedUrl(s3Key) {
  if (!s3Client) {
    const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    return `https://via.placeholder.com/300x400/${randomColor.replace('bg-', '').replace('-300', '')}/white?text=Photo`
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    })
    
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900, 
    })
    
    return presignedUrl
  } catch (error) {
    console.error('Errore nella generazione presigned URL:', error)
    return 'https://via.placeholder.com/300x400/gray/white?text=Error'
  }
}

function isValidPresignedUrl(url) {
	if (!url || typeof url !== 'string'){
		return false;
	}

	if (url.includes('via.placeholder.com') || url.includes('placeholder')) {
		return false;
	}

	try {
		const urlObj = new URL(url);
		const isS3Url = urlObj.hostname.includes('amazonaws.com') || 
						urlObj.hostname.includes('s3.') ||
						urlObj.hostname.includes('.s3.');
		
		if (!isS3Url) {
			return false;
		}
		
		const hasRequiredParams = urlObj.searchParams.has('X-Amz-Algorithm') &&
								urlObj.searchParams.has('X-Amz-Credential') &&
								urlObj.searchParams.has('X-Amz-Date') &&
								urlObj.searchParams.has('X-Amz-Expires') &&
								urlObj.searchParams.has('X-Amz-Signature');
		if (!hasRequiredParams)
			return hasRequiredParams;

		const creationDateStr = urlObj.searchParams.get("X-Amz-Date");
		const expiresInSec = parseInt(urlObj.searchParams.get("X-Amz-Expires"));
		
		if (!creationDateStr || !expiresInSec) {
			return false;
		}
		
		const creationDate = parseISO(creationDateStr);
		const expiresDate = addSeconds(creationDate, expiresInSec);
		
		return !(expiresDate < new Date());
	} catch (error) {
		return false;
	}
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      )
    }

    const userImages = await prisma.userImage.findMany({
      where: {
        userId: parseInt(session.user.id)
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        s3Key: true,
		imageUrl: true,
        createdAt: true
      }
    })

    const imagesWithUrls = []
    
    for (const image of userImages) {
		if (!isValidPresignedUrl(image.imageUrl)) {
			try {			
				const presignedUrl = await generateFreshPresignedUrl(image.s3Key)
				console.log("Presigned URL NUOVO: ", presignedUrl);
				const createdAtUrl = new Date();

				await prisma.userImage.update({
					where: {
						id: image.id
					},
					data: {
						imageUrl: presignedUrl,
						createdAt: createdAtUrl
					}
				})

				imagesWithUrls.push({
					id: image.id,
					imageUrl: presignedUrl,
					createdAt: createdAtUrl
				})
			} catch (error) {
				console.error(`Errore generazione URL per immagine ${image.id}:`, error)
				continue
			}
		}
		else {
			console.log("Presigned ancora attivo.");
			
			imagesWithUrls.push({
				id: image.id,
				imageUrl: image.imageUrl,
				createdAt: image.createdAt
			})
		}
    }

    return NextResponse.json({
      success: true,
      images: imagesWithUrls
    })

  } catch (error) {
    console.error('Errore nel recupero immagini utente:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
