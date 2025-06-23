import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { location, email, dogName, breed, gender, age, password, images } = await request.json();

    console.log('Dati ricevuti dall\'API:', { 
		location: location,
		email,
		dogName,
		breed,
		gender,
		age,
		password: password,
		images: images
	});

    if (!dogName || !breed || !gender || age < 0 || !email || !password 
		|| !location || !location.latitude || !location.longitude) {
      return NextResponse.json(
        { message: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length < 2 || images.length > 6) {
      return NextResponse.json(
        { message: 'Devi caricare tra 2 e 6 immagini' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'La password deve essere lunga almeno 8 caratteri' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email già registrata' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: dogName,
        breed,
        gender,
        age,
        latitude: location.latitude,
        longitude: location.longitude,
      }
    });

    let finalImages = [];
    if (images && images.length > 0) {
      try {
        const moveResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/move-temp-images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            tempImages: images
          }),
        });

        if (moveResponse.ok) {
          const { movedImages } = await moveResponse.json();
          finalImages = movedImages;
          console.log('Immagini spostate con successo:', finalImages.length);
        } else {
          console.error('Errore spostamento immagini, uso URL temporanei');
          finalImages = images;
        }
      } catch (error) {
        console.error('Errore chiamata API spostamento:', error);
        finalImages = images;
      }

      try {
        await prisma.$transaction(async (tx) => {
          await tx.userImage.createMany({
            data: finalImages.map(image => ({
              userId: user.id,
              imageUrl: image.presignedUrl,
              s3Key: image.s3Key,
            }))
          });
        }, {
          timeout: 10000
        });
        
        console.log('Immagini salvate nel database:', finalImages.length);
      } catch (imageError) {
        console.error('Errore salvataggio immagini nel DB:', imageError);
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error('Errore nel salvataggio delle immagini');
      }
    }

    return NextResponse.json(
      { message: 'Utente registrato con successo', userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return NextResponse.json(
      { message: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
