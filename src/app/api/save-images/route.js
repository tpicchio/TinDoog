import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from "@/lib/prisma";
import { generateMultiplePresignedUrls } from '@/lib/s3';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { images, userId } = await request.json();

    let finalUserId;
    if (session?.user?.id) {
      finalUserId = parseInt(session.user.id); // Logged user
    } else if (userId) {
      finalUserId = parseInt(userId); // Registration with explicit userId
    } else {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    if (!images || !Array.isArray(images) || images.length < 2 || images.length > 6) {
      return NextResponse.json({
        error: 'Devi caricare tra 2 e 6 immagini'
      }, { status: 400 });
    }

    // Delete existing images for this user
    await prisma.userImage.deleteMany({
      where: { userId: finalUserId }
    });

    // Generate presigned URLs for display
    const presignedUrls = await generateMultiplePresignedUrls(images, 900);

    const imageData = images.map((image, index) => ({
      userId: finalUserId,
      imageUrl: presignedUrls[index],
      s3Key: image.s3Key,
      isPrimary: index === 0,
    }));

    const savedImages = await prisma.userImage.createMany({
      data: imageData
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