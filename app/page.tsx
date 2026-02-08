'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'

export default function RootRedirect() {
  const { hasSession, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (hasSession) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [hasSession, loading, router])

  // Simple loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return null
}
