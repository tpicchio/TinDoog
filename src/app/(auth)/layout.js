'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingScreen } from '@/components/utils/loading-screen'

export default function AuthLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  // Show loading during auth check
  if (status === 'loading') {
    return <LoadingScreen message="Loading..." />
  }

  // Redirect if already authenticated
  if (status === 'authenticated') {
    return null
  }

  // Render pages only if NOT authenticated
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}
