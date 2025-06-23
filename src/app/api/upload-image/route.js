import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { fileName, fileType } = await request.json();

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Tipo file non supportato' }, { status: 400 });
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    const s3Key = `users/${session.user.id}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      Metadata: {
        userId: session.user.id,
        originalName: fileName,
      },
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 300 
    });

    return NextResponse.json({
      presignedUrl,
      s3Key,
      uniqueFileName
    });

  } catch (error) {
    console.error('Errore generazione presigned URL:', error);
    return NextResponse.json({ error: 'Errore interno server' }, { status: 500 });
  }
}
