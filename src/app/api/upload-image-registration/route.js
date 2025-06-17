import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

export async function POST(request) {
  try {
    const { fileName, fileType, tempUserId } = await request.json();

    // Validazione tipo file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Tipo file non supportato' }, { status: 400 });
    }

    // Genera UUID per il nome file
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // Genera un ID temporaneo per la sessione di registrazione se non fornito
    const sessionId = tempUserId || `temp_${uuidv4()}`;
    
    // Percorso temporaneo nel bucket: temp/{sessionId}/{uniqueFileName}
    const s3Key = `temp/${sessionId}/${uniqueFileName}`;

    // Genera presigned URL per upload
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      Metadata: {
        sessionId: sessionId,
        originalName: fileName,
        uploadType: 'registration'
      },
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300 // 5 minuti
    });

    // URL pubblico per accesso
    const publicUrl = `https://${AWS_CONFIG.BUCKET_NAME}.s3.${AWS_CONFIG.REGION}.amazonaws.com/${s3Key}`;

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      s3Key,
      uniqueFileName,
      sessionId
    });

  } catch (error) {
    console.error('Errore generazione presigned URL per registrazione:', error);
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 });
  }
}
