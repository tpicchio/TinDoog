// src/app/(auth)/layout.js
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingScreen } from '@/components/utils/loading-screen'

export default function AuthLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Reindirizza alla dashboard se già autenticato
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Mostra loading durante il controllo auth
  if (status === 'loading') {
    return <LoadingScreen message="Caricamento..." />
  }

  // Reindirizza se già autenticato
  if (status === 'authenticated') {
    return null
  }

  // Renderizza le pagine solo se NON autenticato
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
