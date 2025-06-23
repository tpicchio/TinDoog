import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

const prisma = new PrismaClient();

async function generateFreshPresignedUrl(s3Key) {
  if (!s3Client) {
    const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    return `https://via.placeholder.com/300x400/${randomColor.replace('bg-', '').replace('-300', '')}/white?text=Photo`
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
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

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length < 2 || images.length > 6) {
      return NextResponse.json({ 
        error: 'Devi caricare tra 2 e 6 immagini' 
      }, { status: 400 });
    }

    await prisma.userImage.deleteMany({
      where: { userId: parseInt(session.user.id) }
    });

    const imagePromises = images.map(async (image) => {
      const presignedUrl = await generateFreshPresignedUrl(image.s3Key);
      return {
        userId: parseInt(session.user.id),
        imageUrl: presignedUrl,
        s3Key: image.s3Key,
      };
    });

    const imagesWithPresignedUrls = await Promise.all(imagePromises);

    const savedImages = await prisma.userImage.createMany({
      data: imagesWithPresignedUrls
    });

    return NextResponse.json({ 
      success: true, 
      count: savedImages.count 
    });

  } catch (error) {
    console.error('Errore salvataggio immagini:', error);
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 });
  }
}
