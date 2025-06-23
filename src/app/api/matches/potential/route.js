import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@/generated/prisma';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const prisma = new PrismaClient();

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

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { userId } = await request.json();
    
    if (parseInt(userId) !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        latitude: true,
        longitude: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const alreadySeen = await prisma.match.findMany({
      where: { likerId: parseInt(userId) },
      select: { likedId: true }
    });

    const seenIds = alreadySeen.map(match => match.likedId);

    const potentialUsers = await prisma.user.findMany({
      where: {
        id: {
          not: parseInt(userId),
          notIn: seenIds
        }
      },
      select: {
        id: true,
        name: true,
        age: true,
        breed: true,
        gender: true,
        latitude: true,
        longitude: true,
        email: true,
        images: {
          select: {
            imageUrl: true,
            s3Key: true
          }
        }
      }
    });

    const matchesWithFreshUrls = []
    
    for (const user of potentialUsers) {
      const distance = calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        user.latitude,
        user.longitude
      )
      
      if (distance <= 50) {
        const freshImages = []
        for (const image of user.images) {
          try {
            const freshUrl = await generateFreshPresignedUrl(image.s3Key)
            freshImages.push(freshUrl)
          } catch (error) {
            console.error(`Errore generazione URL per immagine ${image.s3Key}:`, error)
            freshImages.push('https://via.placeholder.com/300x400/gray/white?text=Error')
          }
        }
        
        matchesWithFreshUrls.push({
          id: user.id,
          name: user.name,
          age: user.age,
          breed: user.breed,
          gender: user.gender,
          email: user.email,
          images: freshImages,
          distance: distance
        })
      }
    }
    
    const sortedMatches = matchesWithFreshUrls.sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      matches: sortedMatches
    });

  } catch (error) {
    console.error('Errore nel recupero potenziali match:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
