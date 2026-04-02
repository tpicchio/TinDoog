import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email e codice richiesti' },
        { status: 400 }
      );
    }

    const otp = await prisma.oTP.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!otp) {
      return NextResponse.json(
        { message: 'Codice non valido o scaduto' }, 
        { status: 400 }
      );
    }

    await prisma.oTP.delete({
      where: { id: otp.id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Email verificata con successo'
    });

  } catch (error) {
    console.error('Errore durante la verifica OTP:', error);
    return NextResponse.json(
      { message: 'Errore durante la verifica' },
      { status: 500 }
    );
  }
}
