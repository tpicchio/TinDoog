import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from "@/lib/prisma"
import { generateMultiplePresignedUrls } from '@/lib/s3';

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

    const presignedUrls = await generateMultiplePresignedUrls(images, 900);

	const imageData = images.map((image, index) => ({
		userId: parseInt(session.user.id),
		imageUrl: presignedUrls[index],
		s3Key: image.s3Key,
	}))

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
