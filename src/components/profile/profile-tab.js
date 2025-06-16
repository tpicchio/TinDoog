import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HiLogout, HiPencil } from 'react-icons/hi';

export function ProfileTab({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="flex-1 bg-gray-50 px-4 py-6">
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
