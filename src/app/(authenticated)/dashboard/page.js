// src/app/(authenticated)/dashboard/page.js
'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Components
import { MatchCard } from '@/components/matching/match-card'

// Services
import { generateMatches, handleMatchAction } from '@/services/matching'

export default function Dashboard() {
  const { data: session } = useSession() // Già verificato nel layout
  const [matches, setMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [isActionLoading, setIsActionLoading] = useState(false)

  // Carica i match all'avvio
  useEffect(() => {
    if (session?.user) {
      const mockCurrentUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        latitude: 43.7696,
        longitude: 11.2558
      }
      
      const potentialMatches = generateMatches(mockCurrentUser)
      setMatches(potentialMatches)
    }
  }, [session])

  const handleLike = async () => {
    if (currentMatchIndex >= matches.length) return
    
    setIsActionLoading(true)
    const currentMatch = matches[currentMatchIndex]
    
    try {
      const result = await handleMatchAction(session.user.id, currentMatch.id, true)
      
      if (result.match) {
        alert(`🎉 È un match con ${currentMatch.name}!`)
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
      await handleMatchAction(session.user.id, currentMatch.id, false)
    } catch (error) {
      console.error('Errore nel pass:', error)
    } finally {
      setIsActionLoading(false)
      setCurrentMatchIndex(prev => prev + 1)
    }
  }

  const renderContent = () => {
    // Solo tab matching - il profilo è ora una pagina separata
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
