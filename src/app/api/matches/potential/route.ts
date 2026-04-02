import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from "@/lib/prisma"
import { generateMultiplePresignedUrls } from '@/lib/s3';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { userId } = await request.json();
    
    if (parseInt(userId) !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        latitude: true,
        longitude: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const alreadySeen = await prisma.match.findMany({
      where: { likerId: parseInt(userId) },
      select: { likedId: true }
    });

    const seenIds = alreadySeen.map(match => match.likedId);

    const potentialUsers = await prisma.user.findMany({
      where: {
        id: {
          not: parseInt(userId),
          notIn: seenIds
        }
      },
      select: {
        id: true,
        name: true,
        age: true,
        breed: true,
        gender: true,
        latitude: true,
        longitude: true,
        email: true,
        images: {
          select: {
            imageUrl: true,
            s3Key: true
          }
        }
      }
    });

    const matchesWithFreshUrls = []
    
    for (const user of potentialUsers) {
      const distance = calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        user.latitude,
        user.longitude
      )
      
      if (distance <= 50) {
        try {
          const freshImages = await generateMultiplePresignedUrls(user.images, 900);
          
          matchesWithFreshUrls.push({
            id: user.id,
            name: user.name,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            email: user.email,
            images: freshImages,
            distance: Math.round(distance * 10) / 10
          });
        } catch (error) {
          console.error(`Error processing images for user ${user.id}:`, error);
          matchesWithFreshUrls.push({
            id: user.id,
            name: user.name,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            email: user.email,
            images: ['https://via.placeholder.com/300x400/gray/white?text=Error'],
            distance: Math.round(distance * 10) / 10
          });
        }
      }
    }
    
    const sortedMatches = matchesWithFreshUrls.sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      success: true,
      matches: sortedMatches
    });

  } catch (error) {
    console.error('Errore nel recupero potenziali match:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
