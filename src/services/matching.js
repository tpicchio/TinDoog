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


export async function getPotentialMatches(currentUserId) {
  try {
    const response = await fetch('/api/matches/potential', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId })
    });

    if (!response.ok) {
      throw new Error('Errore nel caricamento dei match');
    }

    const data = await response.json();
    return data.matches || [];
  } catch (error) {
    console.error('Errore getPotentialMatches:', error);
    return [];
  }
}


export async function handleMatchAction(userId, targetId, liked) {
  try {
    const response = await fetch('/api/matches/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId, 
        targetId, 
        liked 
      })
    });

    if (!response.ok) {
      throw new Error('Errore nell\'azione di match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore handleMatchAction:', error);
    return {
      success: false,
      match: false,
      message: 'Errore durante l\'operazione'
    };
  }
}


export async function resetUserMatches(userId) {
  try {
    const response = await fetch('/api/matches/reset', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Errore nel reset dei match');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Errore resetUserMatches:', error);
    return {
      success: false,
      message: 'Errore durante il reset'
    };
  }
}
