import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@/generated/prisma';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const prisma = new PrismaClient();

const isAwsConfigured = () => {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET_NAME']
  return required.every(key => process.env[key] && process.env[key].trim() !== '')
}

const s3Client = isAwsConfigured() ? new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}) : null

async function generatePresignedUrl(s3Key) {
  if (!s3Client) {
    return `https://via.placeholder.com/400x400/6366f1/white?text=Profile`
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
    })
    
    return await getSignedUrl(s3Client, command, {
      expiresIn: 900,
    })
  } catch (error) {
    console.error('Errore nella generazione presigned URL:', error)
    return `https://via.placeholder.com/400x400/gray/white?text=Error`
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: { profileImageUrl: true }
    });

    if (!user?.profileImageUrl) {
      return NextResponse.json({ 
        success: true, 
        profileImage: null 
      });
    }

    const profileImageUrl = await generatePresignedUrl(user.profileImageUrl);

    return NextResponse.json({
      success: true,
      profileImage: profileImageUrl
    });

  } catch (error) {
    console.error('Errore nel recupero immagine profilo:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400 });
    }

    if (!s3Client) {
      return NextResponse.json({ error: 'AWS S3 non configurato' }, { status: 500 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Tipo file non supportato. Usa JPEG, PNG o WebP.' 
      }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File troppo grande. Massimo 5MB.' 
      }, { status: 400 });
    }

    const userId = session.user.id;
    const fileExtension = file.name.split('.').pop();
    const s3Key = `profile-images/${userId}/profile.${fileExtension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
      Metadata: {
        userId: userId.toString(),
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(uploadCommand);

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { profileImageUrl: s3Key }
    });

    const presignedUrl = await generatePresignedUrl(s3Key);

    return NextResponse.json({
      success: true,
      message: 'Immagine profilo caricata con successo',
      profileImage: presignedUrl
    });

  } catch (error) {
    console.error('Errore caricamento immagine profilo:', error);
    return NextResponse.json(
      { error: 'Errore durante il caricamento' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImageUrl: true }
    });

    if (!user?.profileImageUrl) {
      return NextResponse.json({ 
        success: true, 
        message: 'Nessuna immagine da rimuovere' 
      });
    }

    if (s3Client) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: user.profileImageUrl,
        });
        await s3Client.send(deleteCommand);
      } catch (s3Error) {
        console.error('Errore rimozione da S3:', s3Error);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profileImageUrl: null }
    });

    return NextResponse.json({
      success: true,
      message: 'Immagine profilo rimossa con successo'
    });

  } catch (error) {
    console.error('Errore rimozione immagine profilo:', error);
    return NextResponse.json(
      { error: 'Errore durante la rimozione' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
