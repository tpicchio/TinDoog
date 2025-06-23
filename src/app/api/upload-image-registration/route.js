import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

export async function POST(request) {
  try {
    const { fileName, fileType, tempUserId } = await request.json();

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Tipo file non supportato' }, { status: 400 });
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    const sessionId = tempUserId || `temp_${uuidv4()}`;
    
    const s3Key = `temp/${sessionId}/${uniqueFileName}`;

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
      expiresIn: 300
    });

    return NextResponse.json({
      presignedUrl,
      s3Key,
      uniqueFileName,
      sessionId
    });

  } catch (error) {
    console.error('Errore generazione presigned URL per registrazione:', error);
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 });
  }
}
