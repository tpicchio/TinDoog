import { NextResponse } from 'next/server';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

export async function POST(request) {
  try {
    const { userId, tempImages } = await request.json();

    if (!userId || !tempImages || !Array.isArray(tempImages)) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
    }

    const movedImages = [];

    // Sposta ogni immagine dalla cartella temp a quella dell'utente
    for (const image of tempImages) {
      try {
        // Estrai il nome del file dal percorso temporaneo
        const fileName = image.s3Key.split('/').pop();
        
        // Nuovo percorso: users/{userId}/{fileName}
        const newS3Key = `users/${userId}/${fileName}`;
        
        // Copia l'oggetto nella nuova posizione
        const copyCommand = new CopyObjectCommand({
          Bucket: AWS_CONFIG.BUCKET_NAME,
          CopySource: `${AWS_CONFIG.BUCKET_NAME}/${image.s3Key}`,
          Key: newS3Key,
          Metadata: {
            userId: userId.toString(),
            originalName: fileName,
            uploadType: 'user_image'
          },
          MetadataDirective: 'REPLACE'
        });

        await s3Client.send(copyCommand);

        // Elimina l'oggetto temporaneo
        const deleteCommand = new DeleteObjectCommand({
          Bucket: AWS_CONFIG.BUCKET_NAME,
          Key: image.s3Key
        });

        await s3Client.send(deleteCommand);

        // Nuovo URL pubblico
        const newPublicUrl = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${newS3Key}`;

        movedImages.push({
          publicUrl: newPublicUrl,
          s3Key: newS3Key
        });

      } catch (error) {
        console.error(`Errore spostamento immagine ${image.s3Key}:`, error);
        // Continua con le altre immagini anche se una fallisce
      }
    }

    return NextResponse.json({
      success: true,
      movedImages
    });

  } catch (error) {
    console.error('Errore spostamento immagini:', error);
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 });
  }
}
