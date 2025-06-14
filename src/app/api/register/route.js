import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { dogName, breed, email, password } = await request.json();

    console.log('Dati ricevuti dall\'API:', { dogName, breed, email, password: password ? '***' : 'undefined' }); // Debug

    // Validazione dei dati
    if (!dogName || !breed || !email || !password) {
      return NextResponse.json(
        { message: 'Tutti i campi sono obbligatori' },
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

    // Crea l'utente
    const user = await prisma.user.create({
      data: {
        name: dogName,
        breed,
        email,
        password: hashedPassword,
        age: 1 // Valore temporaneo, potresti aggiungere questo campo nel form
      }
    });

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
