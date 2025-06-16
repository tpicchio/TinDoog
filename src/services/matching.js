
/**
 * Calcola la distanza tra due punti geografici usando la formula Haversine
 * @param {number} lat1 - Latitudine del primo punto
 * @param {number} lon1 - Longitudine del primo punto  
 * @param {number} lat2 - Latitudine del secondo punto
 * @param {number} lon2 - Longitudine del secondo punto
 * @returns {number} Distanza in chilometri
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raggio della Terra in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Genera dati mock per i match nelle vicinanze
 * @param {Object} currentUser - Utente corrente con posizione
 * @returns {Array} Array di potenziali match
 */
export function generateMatches(currentUser) {
  // Dati mock per test
  const mockDogs = [
    {
      id: 1,
      name: "Priska",
      age: 6,
      breed: "Labrador",
      gender: "femmina",
      bio: "Lives in Tuscany",
      images: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=600&fit=crop"
      ],
      // Posizione vicina a quella dell'utente corrente
      latitude: currentUser.latitude + (Math.random() - 0.5) * 0.1,
      longitude: currentUser.longitude + (Math.random() - 0.5) * 0.1
    },
    {
      id: 2,
      name: "Max",
      age: 3,
      breed: "Golden Retriever", 
      gender: "maschio",
      bio: "Loves playing fetch",
      images: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=600&fit=crop"
      ],
      latitude: currentUser.latitude + (Math.random() - 0.5) * 0.15,
      longitude: currentUser.longitude + (Math.random() - 0.5) * 0.15
    },
    {
      id: 3,
      name: "Luna",
      age: 2,
      breed: "Beagle",
      gender: "femmina", 
      bio: "Energetic and friendly",
      images: [
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=600&fit=crop"
      ],
      latitude: currentUser.latitude + (Math.random() - 0.5) * 0.08,
      longitude: currentUser.longitude + (Math.random() - 0.5) * 0.08
    },
    {
      id: 4,
      name: "Rocky",
      age: 4,
      breed: "Bulldog",
      gender: "maschio",
      bio: "Calm and gentle",
      images: [], // Nessuna immagine per testare il fallback
      latitude: currentUser.latitude + (Math.random() - 0.5) * 0.12,
      longitude: currentUser.longitude + (Math.random() - 0.5) * 0.12
    },
    {
      id: 5,
      name: "Bella",
      age: 1,
      breed: "Yorkshire Terrier",
      gender: "femmina",
      bio: "Small but brave",
      images: [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=600&fit=crop"
      ],
      latitude: currentUser.latitude + (Math.random() - 0.5) * 0.06,
      longitude: currentUser.longitude + (Math.random() - 0.5) * 0.06
    }
  ];

  // Calcola distanza e filtra entro 50km
  const matches = mockDogs
    .map(dog => ({
      ...dog,
      distance: calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        dog.latitude,
        dog.longitude
      )
    }))
    .filter(dog => dog.distance <= 50) // Entro 50km
    .sort((a, b) => a.distance - b.distance); // Ordina per distanza

  return matches;
}

/**
 * Simula il salvataggio di una decisione di match
 * @param {number} userId - ID dell'utente corrente
 * @param {number} targetId - ID del cane target
 * @param {boolean} liked - True se piace, false se non piace
 * @returns {Promise<Object>} Risultato dell'azione
 */
export async function handleMatchAction(userId, targetId, liked) {
  // Mock implementation - in futuro si collegherà al database
  console.log(`User ${userId} ${liked ? 'liked' : 'passed'} dog ${targetId}`);
  
  // Simula una chiamata API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    match: liked && Math.random() > 0.7, // 30% di probabilità di match reciproco
    message: liked ? 'Swipe effettuato!' : 'Passato al prossimo'
  };
}
