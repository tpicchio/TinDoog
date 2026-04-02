'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingScreen } from '@/components/utils/loading-screen'
import { BottomNavigation } from '@/components/navigation/bottom-nav'
import Image from 'next/image'

export default function AuthenticatedLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  // Determine active tab based on current route
  const getActiveTab = () => {
    if (pathname.includes('/profile')) return 'profile'
    if (pathname.includes('/dashboard')) return 'matching'
    return 'matching'
  }

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

  if (status === 'loading') {
    return <LoadingScreen message="Caricamento..." />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="h-1/20 bg-white shadow-sm border-b">
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center gap-2">
            <Image 
              src="/tindoogIco.png" 
              alt="TinDoog" 
              width={32} 
              height={32}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-purple-500">TinDoog</h1>
          </div>
        </div>
      </header>

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
