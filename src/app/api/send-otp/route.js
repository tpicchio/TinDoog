import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PrismaClient } from '@/generated/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);
const prisma = new PrismaClient();

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

    // Controlla se esiste già un OTP recente (meno di 2 minuti fa)
    const recentOTP = await prisma.oTP.findFirst({
      where: { 
        email,
        createdAt: {
          gt: new Date(Date.now() - 2 * 60 * 1000) // 2 minuti fa
        }
      }
    });

    if (recentOTP) {
      console.log('OTP già esistente per:', email, 'creato il:', recentOTP.createdAt);
      return NextResponse.json({ 
        success: true, 
        message: 'OTP già inviato di recente. Attendi 2 minuti prima di richiederne un altro.',
        // In sviluppo, restituiamo anche il codice esistente per debug
        ...(process.env.NODE_ENV === 'development' && { otp: recentOTP.code })
      });
    }

    // Elimina eventuali OTP precedenti per questa email
    await prisma.oTP.deleteMany({
      where: { email }
    });

    // Genera OTP di 6 cifre
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Salva OTP nel database con scadenza (5 minuti)
    await prisma.oTP.create({
      data: {
        email,
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minuti
      }
    });

    // Invia email (solo se RESEND_API_KEY è configurata)
    console.log('RESEND_API_KEY configurata:', !!process.env.RESEND_API_KEY);
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
      console.log('📧 Tentativo invio email a:', email);
      await resend.emails.send({
        from: 'TinDoog <onboarding@resend.dev>', // Usa il dominio di default di Resend per i test
        to: [email],
        subject: 'Codice di verifica TinDoog 🐕',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #AA54EA; font-size: 28px; margin-bottom: 10px;">TinDoog</h1>
              <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Codice di verifica</h2>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Ciao! Usa questo codice per completare la registrazione su TinDoog:
            </p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #AA54EA; border-radius: 10px; padding: 30px; text-align: center; margin-bottom: 30px;">
              <h1 style="color: #AA54EA; font-size: 36px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⏰ <strong>Importante:</strong> Questo codice scadrà tra 5 minuti per motivi di sicurezza.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Se non hai richiesto questo codice, puoi ignorare questa email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              Questo messaggio è stato inviato da TinDoog - L'app per trovare il compagno perfetto per il tuo cane! 🐕💜
            </p>
          </div>
        `,
      });
      console.log('✅ Email inviata con successo a:', email);
    } else {
      console.log('⚠️ RESEND_API_KEY non configurata, email non inviata');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Codice OTP inviato via email',
      // In sviluppo, restituiamo anche il codice per debug
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Errore durante l\'invio OTP:', error);
    return NextResponse.json(
      { message: 'Errore durante l\'invio del codice' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
