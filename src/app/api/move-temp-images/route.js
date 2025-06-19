import { NextResponse } from 'next/server';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

// Funzione per generare un presigned URL fresco
async function generateFreshPresignedUrl(s3Key) {
  if (!s3Client) {
    // Se AWS non è configurato, restituisci un placeholder colorato
    const colors = ['bg-red-300', 'bg-blue-300', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    return `https://via.placeholder.com/300x400/${randomColor.replace('bg-', '').replace('-300', '')}/white?text=Photo`
  }

  try {
    const command = new GetObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key,
    })
    
    // Genera URL valido per 15 minuti (presigned URL di breve durata)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900, // 15 minuti
    })
    
    return presignedUrl
  } catch (error) {
    console.error('Errore nella generazione presigned URL:', error)
    // Fallback a placeholder in caso di errore
    return 'https://via.placeholder.com/300x400/gray/white?text=Error'
  }
}

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

        // Genera presigned URL per l'immagine spostata
        const presignedUrl = await generateFreshPresignedUrl(newS3Key);

        movedImages.push({
          publicUrl: presignedUrl, // Ora è un presigned URL
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
