import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { parseISO, addSeconds } from 'date-fns';
import { prisma } from "@/lib/prisma"
import { generatePresignedUrl } from '@/lib/s3'

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
				const presignedUrl = await generatePresignedUrl(image.s3Key, 900, 'profile')
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
  }
}
