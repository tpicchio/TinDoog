'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HiLogout, HiPencil } from 'react-icons/hi';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Carica le immagini dell'utente
  useEffect(() => {
    const fetchUserImages = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/user-images');
        const data = await response.json();
        
        if (data.success) {
          setUserImages(data.images);
        } else {
          console.error('Errore nel caricamento immagini:', data.error);
        }
      } catch (error) {
        console.error('Errore nel fetch immagini:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    fetchUserImages();
  }, [session]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="h-full bg-gray-50 px-4 py-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="text-center">
            {/* Profile Image Placeholder */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#AA54EA] to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🐕</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
            
            <button className="bg-[#AA54EA] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto">
              <HiPencil className="text-sm" />
              Modifica Profilo
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Le mie informazioni</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Nome del cane</span>
              <span className="font-medium text-gray-900">{user?.name}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">ID utente</span>
              <span className="font-medium text-gray-900">#{user?.id}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Membro dal</span>
              <span className="font-medium text-gray-900">Giugno 2025</span>
            </div>
          </div>
        </div>

        {/* Profile Photos */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Le mie foto</h3>
            <button
              onClick={() => router.push('/add-photos')}
              className="text-[#AA54EA] text-sm font-medium hover:underline"
            >
              Gestisci foto
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {loadingImages ? (
              // Mostra skeleton loading durante il caricamento
              Array(6).fill(null).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Caricamento...</span>
                </div>
              ))
            ) : (
              <>
                {/* Mostra le immagini reali dell'utente */}
                {userImages.map((image, index) => (
                  <div key={image.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={`Foto ${index + 1} del profilo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback se l'immagine non si carica
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0MxOSA1IDE3IDQgMTUgNEg5QzcgNCA1IDUgMyA3VjE3QzMgMTkgNSAyMSA3IDIxSDE3QzE5IDIxIDIxIDE5IDIxIDE3VjE1IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0yMSAxNS0zLjEtMy4xYTIgMiAwIDAgMC0yLjgxLjAxTDEwIDEyTDMgMjEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=='
                        e.target.className = 'w-full h-full object-contain p-4 opacity-50'
                      }}
                    />
                  </div>
                ))}
                
                {/* Mostra placeholder per slot vuoti (massimo 6 foto) */}
                {Array(Math.max(0, 6 - userImages.length)).fill(null).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 text-xs text-center">
                      {userImages.length === 0 && index === 0 ? 'Nessuna foto' : '+'}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Messaggio se non ci sono foto */}
          {!loadingImages && userImages.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-2">Non hai ancora caricato nessuna foto</p>
              <button
                onClick={() => router.push('/add-photos')}
                className="text-[#AA54EA] text-sm font-medium hover:underline"
              >
                Aggiungi la tua prima foto
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impostazioni</h3>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Notifiche</span>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Privacy</span>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-gray-700">Aiuto</span>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <HiLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
}
