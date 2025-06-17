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
	}); // Debug

    // Validazione dei dati
    if (!dogName || !breed || !gender || age < 0 || !email || !password 
		|| !location || !location.latitude || !location.longitude) {
      return NextResponse.json(
        { message: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    // Validazione immagini
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

    // Verifica se l'email esiste già
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea l'utente con le immagini in una transazione
    const result = await prisma.$transaction(async (tx) => {
      // Crea l'utente
      const user = await tx.user.create({
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

      // Sposta le immagini dalla cartella temporanea a quella dell'utente
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
          } else {
            console.error('Errore spostamento immagini');
            // Usa le immagini temporanee se lo spostamento fallisce
            finalImages = images;
          }
        } catch (error) {
          console.error('Errore chiamata API spostamento:', error);
          // Usa le immagini temporanee se lo spostamento fallisce
          finalImages = images;
        }

        // Salva le immagini nel database
        await tx.userImage.createMany({
          data: finalImages.map(image => ({
            userId: user.id,
            imageUrl: image.publicUrl,
            s3Key: image.s3Key,
          }))
        });
      }

      return user;
    });

    return NextResponse.json(
      { message: 'Utente registrato con successo', userId: result.id },
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
