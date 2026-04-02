import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client, AWS_CONFIG } from '@/lib/aws-config';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { fileName, fileType, userId } = await request.json();

    let finalUserId;
    if (session?.user?.id) {
      finalUserId = session.user.id; // Logged user
    } else if (userId) {
      finalUserId = userId; // Registration with explicit userId
    } else {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Tipo file non supportato' }, { status: 400 });
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    const s3Key = `users/${finalUserId}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      Metadata: {
        userId: finalUserId.toString(),
        originalName: fileName,
        uploadType: session ? 'profile_update' : 'registration'
      },
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 900
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