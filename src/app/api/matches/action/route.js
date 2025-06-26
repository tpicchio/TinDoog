import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { userId, targetId, liked } = await request.json();
    
    if (parseInt(userId) !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(targetId) },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Utente target non trovato' }, { status: 404 });
    }

    let isMatch = false;
    let matchData = null;

    if (liked) {
      await prisma.match.create({
        data: {
          likerId: parseInt(userId),
          likedId: parseInt(targetId),
          isMatch: false
        }
      });

      const reciprocalLike = await prisma.match.findUnique({
        where: {
          likerId_likedId: {
            likerId: parseInt(targetId),
            likedId: parseInt(userId)
          }
        }
      });

      if (reciprocalLike) {
        await prisma.match.updateMany({
          where: {
            OR: [
              {
                likerId: parseInt(userId),
                likedId: parseInt(targetId)
              },
              {
                likerId: parseInt(targetId),
                likedId: parseInt(userId)
              }
            ]
          },
          data: {
            isMatch: true
          }
        });

        isMatch = true;
        matchData = {
          name: targetUser.name,
          email: targetUser.email
        };
      }
    } else {
      await prisma.match.create({
        data: {
          likerId: parseInt(userId),
          likedId: parseInt(targetId),
          isMatch: false
        }
      });
    }

    return NextResponse.json({
      success: true,
      match: isMatch,
      matchData,
      message: liked 
        ? (isMatch ? 'È un match!' : 'Like inviato!') 
        : 'Passato al prossimo'
    });

  } catch (error) {
    console.error('Errore nell\'azione di match:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
