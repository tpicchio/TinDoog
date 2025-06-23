import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    return NextResponse.json({
      exists: !!existingUser
    });

  } catch (error) {
    console.error('Errore durante il controllo email:', error);
    return NextResponse.json(
      { message: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
