import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import { sendOTPEmail, isResendConfigured } from '@/lib/resend';


export async function POST(request) {
  try {
    const { email } = await request.json();
    console.log('🔔 API send-otp chiamata per:', email, 'alle:', new Date().toLocaleTimeString());

    if (!email) {
      return NextResponse.json(
        { message: 'Email richiesta' },
        { status: 400 }
      );
    }

    const recentOTP = await prisma.oTP.findFirst({
      where: { 
        email,
        createdAt: {
          gt: new Date(Date.now() - 2 * 60 * 1000)
        }
      }
    });

    if (recentOTP) {
      console.log('OTP già esistente per:', email, 'creato il:', recentOTP.createdAt);
      return NextResponse.json({ 
        success: true, 
        message: 'OTP già inviato di recente. Attendi 2 minuti prima di richiederne un altro.',
        ...(process.env.NODE_ENV === 'development' && { otp: recentOTP.code })
      });
    }

    await prisma.oTP.deleteMany({
      where: { email }
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
      }
    });

    console.log('Resend configured:', isResendConfigured());
    
    if (isResendConfigured()) {
      try {
        await sendOTPEmail(email, otp);
        console.log('✅ Email inviata con successo a:', email);
      } catch (emailError) {
        console.error('❌ Errore invio email, ma OTP salvato:', emailError);
      }
    } else {
      console.log('⚠️ Resend non configurato, email non inviata');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Codice OTP inviato via email',
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Errore durante l\'invio OTP:', error);
    return NextResponse.json(
      { message: 'Errore durante l\'invio del codice' },
      { status: 500 }
    );
  }
}
