'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Components
import { MatchCard } from '@/components/matching/match-card'

// Services
import { getPotentialMatches, handleMatchAction, resetUserMatches } from '@/services/matching'

export default function Dashboard() {
  const { data: session } = useSession()
  const [matches, setMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isLoadingMatches, setIsLoadingMatches] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  // Load matches on startup
  useEffect(() => {
    if (session?.user?.id) {
      loadMatches()
    }
  }, [session])

  const loadMatches = async () => {
    setIsLoadingMatches(true)
    try {
      const potentialMatches = await getPotentialMatches(parseInt(session.user.id))
      setMatches(potentialMatches)
      setCurrentMatchIndex(0)
    } catch (error) {
      console.error('Errore nel caricamento match:', error)
    } finally {
      setIsLoadingMatches(false)
    }
  }

  const handleLike = async () => {
    if (currentMatchIndex >= matches.length) return
    
    setIsActionLoading(true)
    const currentMatch = matches[currentMatchIndex]
    
    try {
      const result = await handleMatchAction(
        parseInt(session.user.id), 
        currentMatch.id, 
        true
      )
      
      if (result.match && result.matchData) {
        alert(`🎉 È un match con ${result.matchData.name}!\n\nContattali a: ${result.matchData.email}`)
      }
    } catch (error) {
      console.error('Errore nel like:', error)
    } finally {
      setIsActionLoading(false)
      setCurrentMatchIndex(prev => prev + 1)
    }
  }

  const handlePass = async () => {
    if (currentMatchIndex >= matches.length) return
    
    setIsActionLoading(true)
    const currentMatch = matches[currentMatchIndex]
    
    try {
      await handleMatchAction(
        parseInt(session.user.id), 
        currentMatch.id, 
        false
      )
    } catch (error) {
      console.error('Errore nel pass:', error)
    } finally {
      setIsActionLoading(false)
      setCurrentMatchIndex(prev => prev + 1)
    }
  }

  const handleResetMatches = async () => {
    if (!confirm('⚠️ ATTENZIONE: Vuoi davvero cancellare tutti i tuoi match? Questa azione non può essere annullata.')) {
      return;
    }

    setIsResetting(true);
    try {
      const result = await resetUserMatches(parseInt(session.user.id));
      
      if (result.success) {
        alert(`✅ ${result.message}`);
        await loadMatches();
      } else {
        alert(`❌ Errore: ${result.message}`);
      }
    } catch (error) {
      console.error('Errore durante il reset:', error);
      alert('❌ Errore durante il reset dei match');
    } finally {
      setIsResetting(false);
    }
  };

  const renderContent = () => {
    // Show loading during match fetching
    if (isLoadingMatches) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center px-6">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Caricamento match...
            </h2>
            <p className="text-gray-600">
              Stiamo cercando cani nelle tue vicinanze
            </p>
          </div>
        </div>
      )
    }

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
            <div className="flex flex-col gap-3">
              <button
                onClick={loadMatches}
                disabled={isLoadingMatches}
                className="bg-purple-500 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-600 transition-colors disabled:bg-gray-400"
              >
                {isLoadingMatches ? 'Caricamento...' : 'Ricarica Match'}
              </button>
              
              {process.env.NODE_ENV !== 'production' && (
                <button
                  onClick={handleResetMatches}
                  disabled={isResetting}
                  className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400 text-sm"
                >
                  {isResetting ? 'Resettando...' : '🔄 Reset Match (Dev)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )
    }

    const currentMatch = matches[currentMatchIndex]
    
    return (
      <div className="h-full flex justify-center items-center bg-purple-500 p-4">
        <div className="w-1/3 h-19/20">
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
    <div className="h-full">
      {renderContent()}
    </div>
  )
}
