'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Components
import { LoadingScreen } from '@/components/utils/loading-screen'
import { MatchCard } from '@/components/matching/match-card'
import { BottomNavigation } from '@/components/navigation/bottom-nav'
import { ProfileTab } from '@/components/profile/profile-tab'

// Services
import { generateMatches, handleMatchAction } from '@/services/matching'


export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('matching')
  const [matches, setMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Proteggi la dashboard - reindirizza se non loggato
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Carica i match quando l'utente è autenticato
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Mock user position - in futuro verrà dal database
      const mockCurrentUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        latitude: 43.7696, // Firenze
        longitude: 11.2558
      }
      
      const potentialMatches = generateMatches(mockCurrentUser)
      setMatches(potentialMatches)
    }
  }, [status, session])

  const handleLike = async () => {
    if (currentMatchIndex >= matches.length) return
    
    setIsActionLoading(true)
    const currentMatch = matches[currentMatchIndex]
    
    try {
      const result = await handleMatchAction(session.user.id, currentMatch.id, true)
      
      if (result.match) {
        // Mostra popup di match
        alert(`🎉 È un match! Tu e ${currentMatch.name} vi piacete!`)
      }
      
      setCurrentMatchIndex(prev => prev + 1)
    } catch (error) {
      console.error('Errore nel like:', error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handlePass = async () => {
    if (currentMatchIndex >= matches.length) return
    
    setIsActionLoading(true)
    const currentMatch = matches[currentMatchIndex]
    
    try {
      await handleMatchAction(session.user.id, currentMatch.id, false)
      setCurrentMatchIndex(prev => prev + 1)
    } catch (error) {
      console.error('Errore nel pass:', error)
    } finally {
      setIsActionLoading(false)
    }
  }

  // Loading state
  if (status === 'loading') {
    return <LoadingScreen message="Caricamento..." />
  }

  // Non mostrare nulla se non autenticato (verrà reindirizzato)
  if (status === 'unauthenticated') {
    return null
  }

  // Contenuto basato sul tab attivo
  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfileTab user={session?.user} />
    }

    // Tab matching
    if (currentMatchIndex >= matches.length) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center px-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tutti i match esplorati!
            </h2>
            <p className="text-gray-600 mb-6">
              Torna più tardi per nuovi potenziali match nelle tue vicinanze.
            </p>
            <button
              onClick={() => {
                setCurrentMatchIndex(0)
                const mockCurrentUser = {
                  id: session.user.id,
                  latitude: 43.7696,
                  longitude: 11.2558
                }
                setMatches(generateMatches(mockCurrentUser))
              }}
              className="bg-[#AA54EA] text-white px-6 py-3 rounded-full font-medium hover:bg-purple-600 transition-colors"
            >
              Ricarica Match
            </button>
          </div>
        </div>
      )
    }

    const currentMatch = matches[currentMatchIndex]
    
    return (
      <div className="h-full flex justify-center items-center bg-[#AA54EA] p-4">
        <div className="w-1/3 h-14/15">
          {currentMatch && (
            <MatchCard
              dog={currentMatch}
              onLike={handleLike}
              onPass={handlePass}
              isLoading={isActionLoading}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header - 1/10 dello schermo */}
      <div className="h-1/20 bg-white shadow-sm border-b px-4 py-4 safe-area-pt">
        <div className="flex items-center justify-center max-w-md mx-auto h-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <h1 className="text-2xl font-bold text-[#AA54EA]">Tindoog</h1>
          </div>
        </div>
      </div>

      {/* Content - 8/10 dello schermo */}
      <div className="h-18/20">
        {renderContent()}
      </div>

      {/* Bottom Navigation - 1/10 dello schermo */}
      <div className="h-1/20">
        <BottomNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  )
}
