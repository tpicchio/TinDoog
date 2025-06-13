'use client'
import { LoadingScreen } from '@/components/utils/loading-screen'
import { Login } from '../../components/login/login'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'authenticated') {
    return null // L'utente verrà reindirizzato
  }

  return <Login />
}
