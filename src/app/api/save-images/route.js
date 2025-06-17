import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

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

    // Elimina le immagini esistenti dell'utente
    await prisma.userImage.deleteMany({
      where: { userId: parseInt(session.user.id) }
    });

    // Salva le nuove immagini
    const savedImages = await prisma.userImage.createMany({
      data: images.map(image => ({
        userId: parseInt(session.user.id),
        imageUrl: image.publicUrl,
        s3Key: image.s3Key,
      }))
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
