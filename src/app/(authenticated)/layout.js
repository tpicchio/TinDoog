// src/app/(authenticated)/layout.js
'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingScreen } from '@/components/utils/loading-screen'
import { BottomNavigation } from '@/components/navigation/bottom-nav'

export default function AuthenticatedLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Determina il tab attivo basato sulla route
  const getActiveTab = () => {
    if (pathname.includes('/profile')) return 'profile'
    if (pathname.includes('/dashboard')) return 'matching'
    return 'matching' // default
  }

  // Gestisce il cambio di tab
  const handleTabChange = (tab) => {
    if (tab === 'profile') {
      router.push('/profile')
    } else if (tab === 'matching') {
      router.push('/dashboard')
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Mostra loading durante il controllo auth
  if (status === 'loading') {
    return <LoadingScreen message="Caricamento..." />
  }

  // Reindirizza se non autenticato
  if (status === 'unauthenticated') {
    return null
  }

  // Renderizza le pagine solo se autenticato
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header comune per tutte le pagine autenticate */}
      <header className="h-1/20 bg-white shadow-sm border-b">
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <h1 className="text-2xl font-bold text-purple-500">TinDoog</h1>
          </div>
        </div>
      </header>

      {/* Contenuto della pagina */}
      <main className="h-18/20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="h-1/20">
        <BottomNavigation 
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  )
}
