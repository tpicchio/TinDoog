import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Operazione non permessa in produzione' }, { status: 403 });
    }

    const { userId } = await request.json();
    
    if (parseInt(userId) !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const deletedMatches = await prisma.match.deleteMany({
      where: {
        OR: [
          { likerId: parseInt(userId) },
          { likedId: parseInt(userId) }
        ]
      }
    });

    return NextResponse.json({
      success: true,
      message: `${deletedMatches.count} match cancellati con successo`,
      deletedCount: deletedMatches.count
    });

  } catch (error) {
    console.error('Errore reset match:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
