'use client';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { HiLogout, HiPlus, HiX } from 'react-icons/hi';
import Image from 'next/image';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [userImages, setUserImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Load user images on session change
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

  // Load current profile image on session change
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/profile-image');
        const data = await response.json();
        
        if (data.success && data.profileImage) {
          setProfileImage(data.profileImage);
        }
      } catch (error) {
        console.error('Errore nel caricamento immagine profilo:', error);
      }
    };

    fetchProfileImage();
  }, [session]);

  // Handle profile image upload with FormData
  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingProfile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile-image', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfileImage(data.profileImage);
      } else {
        alert('Errore: ' + data.error);
      }
    } catch (error) {
      console.error('Errore upload:', error);
      alert('Errore durante il caricamento');
    } finally {
      setUploadingProfile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle profile image removal with confirmation
  const handleRemoveProfileImage = async () => {
    if (!confirm('Vuoi davvero rimuovere la tua immagine profilo?')) return;

    try {
      const response = await fetch('/api/profile-image', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setProfileImage(null);
      } else {
        alert('Errore: ' + data.error);
      }
    } catch (error) {
      console.error('Errore rimozione:', error);
      alert('Errore durante la rimozione');
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
	<div className="h-full bg-gray-50 px-4 py-6 overflow-y-auto">
		<div className="flex flex-col h-full w-1/3 items-center justify-center mx-auto">
			{/* Profile Header */}
			<div className="w-full bg-white rounded-2xl p-6 mb-6 shadow-sm">
				<div className="text-center">
					{/* Profile Image Container */}
					<div className="relative w-24 h-24 mx-auto mb-4">
						<div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
							{profileImage ? (
								<img 
									src={profileImage} 
									alt="Profile" 
									className="object-cover w-full h-full"
								/>
							) : (
								<Image 
									src="/tindoogIco.png" 
									alt="TinDoog" 
									width={48} 
									height={48}
									className="object-contain"
								/>
							)}
						</div>
						
						{/* Upload/Remove Button */}
						{!profileImage ? (
							<button
								onClick={() => fileInputRef.current?.click()}
								disabled={uploadingProfile}
								className="absolute -top-1 -left-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors disabled:bg-gray-400"
								title="Aggiungi immagine profilo"
							>
								{uploadingProfile ? (
									<div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
								) : (
									<HiPlus className="text-xs" />
								)}
							</button>
						) : (
							<button
								onClick={handleRemoveProfileImage}
								className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
								title="Rimuovi immagine profilo"
							>
								<HiX className="text-xs" />
							</button>
						)}
						
						{/* Hidden File Input for upload */}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleProfileImageUpload}
							className="hidden"
						/>
					</div>
					
					<h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
				</div>
			</div>

			{/* Profile Details */}
			<div className="w-full bg-white rounded-2xl p-6 mb-6 shadow-sm">
				<h3 className="text-center text-lg font-semibold text-gray-900 mb-4">Le mie informazioni</h3>
				
				<div className="space-y-3">
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="text-gray-600">Nome del cane</span>
						<span className="font-medium text-gray-900">{user?.name}</span>
					</div>
					
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="text-gray-600">Email</span>
						<span className="font-medium text-gray-900">{user?.email}</span>
					</div>
					
					<div className="flex justify-between items-center py-2">
						<span className="text-gray-600">Membro da</span>
						<span className="font-medium text-gray-900">Giugno 2025</span>
					</div>
				</div>
			</div>

			{/* Profile Photos */}
			<div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
				<div className="relative mb-4">
                    <h3 className="text-center text-lg font-semibold text-gray-900">Le mie foto</h3>
                    <button
                        onClick={() => router.push('/add-photos')}
                        className="absolute right-0 top-0 text-purple-500 text-sm font-medium hover:underline"
                    >
                        Gestisci foto
                    </button>
                </div>
				
				<div className="grid grid-cols-3 gap-2">
					{loadingImages ? (
						Array(6).fill(null).map((_, index) => (
						<div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
							<span className="text-gray-400 text-xs">Caricamento...</span>
						</div>
						))
					) : (
						<>
						{userImages.map((image, index) => (
							<div key={image.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
								<img
									src={image.imageUrl}
									alt={`Foto ${index + 1} del profilo`}
									className="w-full h-full object-cover"								onError={(e) => {
								// Fallback if image fails to load
								e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0MxOSA1IDE3IDQgMTUgNEg5QzcgNCA1IDUgMyA3VjE3QzMgMTkgNSAyMSA3IDIxSDE3QzE5IDIxIDIxIDE5IDIxIDE3VjE1IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0yMSAxNS0zLjEtMy4xYTIgMiAwIDAgMC0yLjgxLjAxTDEwIDEyTDMgMjEiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg=='
								e.target.className = 'w-full h-full object-contain p-4 opacity-50'
								}}
								/>
							</div>
						))}
						
						{/* Show placeholder for empty slots (max 6 photos) */}
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
				
				{/* Message when no photos available */}
				{!loadingImages && userImages.length === 0 && (
				<div className="text-center py-4">
					<p className="text-gray-500 text-sm mb-2">Non hai ancora caricato nessuna foto</p>
					<button
					onClick={() => router.push('/add-photos')}
					className="text-purple-500 text-sm font-medium hover:underline"
					>
					Aggiungi la tua prima foto
					</button>
				</div>
				)}
			</div>

			<button
				onClick={handleLogout}
				className="w-1/3 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
				>
				<HiLogout className="text-lg" />
				Logout
			</button>
		</div>
    </div>
  );
}
