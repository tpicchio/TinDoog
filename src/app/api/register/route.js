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

    // PRIMA: Crea l'utente (senza transazione per le immagini)
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

    // DOPO: Gestisci le immagini separatamente
    let finalImages = [];
    if (images && images.length > 0) {
      try {
        // Sposta le immagini dalla cartella temporanea a quella dell'utente
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
          // Usa le immagini temporanee se lo spostamento fallisce
          finalImages = images;
        }
      } catch (error) {
        console.error('Errore chiamata API spostamento:', error);
        // Usa le immagini temporanee se lo spostamento fallisce
        finalImages = images;
      }

      // Salva le immagini nel database (con transazione più veloce)
      try {
        await prisma.$transaction(async (tx) => {
          await tx.userImage.createMany({
            data: finalImages.map(image => ({
              userId: user.id,
              imageUrl: image.publicUrl,
              s3Key: image.s3Key,
            }))
          });
        }, {
          timeout: 10000 // 10 secondi di timeout
        });
        
        console.log('Immagini salvate nel database:', finalImages.length);
      } catch (imageError) {
        console.error('Errore salvataggio immagini nel DB:', imageError);
        // Se il salvataggio delle immagini fallisce, elimina l'utente per mantenere consistenza
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
