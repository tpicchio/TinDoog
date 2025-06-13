'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Components
import { LoadingScreen } from '@/components/utils/loading-screen'


export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Proteggi la dashboard - reindirizza se non loggato
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleLogout = async () => {
    await signOut({ 
      redirect: false 
    })
    router.push('/')
  }

  // Loading state
  if (status === 'loading') {
    return <LoadingScreen />
  }

  // Non mostrare nulla se non autenticato (verrà reindirizzato)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logout */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#AA54EA]">TinDoog</h1>
              <span className="text-gray-500">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-gray-600">Ciao, </span>
                <span className="font-medium text-gray-900">
                  {session?.user?.name || 'Utente'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenuto principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benvenuto nella Dashboard!
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Ciao {session?.user?.name}! 🐕
            </p>
            <p className="text-sm text-gray-500">
              Questa è la tua dashboard personalizzata di TinDoog.
            </p>
            
            {/* Informazioni utente */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg text-[#AA54EA] font-semibold mb-4">Le tue informazioni</h3>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nome del cane:</span>
                  <span className="font-medium text-[#AA54EA]">{session?.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-[#AA54EA]">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID utente:</span>
                  <span className="font-medium text-[#AA54EA]">{session?.user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
