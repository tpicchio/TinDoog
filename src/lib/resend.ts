import { Resend } from 'resend';

// Singleton pattern for Resend client (similar to Prisma)
const globalForResend = globalThis;

export const resend = globalForResend.resend ?? (
  process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'
    ? new Resend(process.env.RESEND_API_KEY)
    : null
);

if (process.env.NODE_ENV !== 'production') globalForResend.resend = resend;

/**
 * Check if Resend is properly configured
 * @returns {boolean} True if Resend client is available
 */
export const isResendConfigured = () => {
  return resend !== null && !!process.env.RESEND_API_KEY;
};

/**
 * Send OTP email with TinDoog branding
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Resend response or null if not configured
 */
export async function sendOTPEmail(email, otp) {
  if (!resend) {
    console.log('⚠️ Resend not configured, email not sent');
    return null;
  }

  try {
    console.log('📧 Sending OTP email to:', email);
    
    const result = await resend.emails.send({
      from: 'TinDoog <onboarding@resend.dev>',
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

    console.log('✅ Email sent successfully to:', email);
    return result;

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}
