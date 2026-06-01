'use client'

import { LoginForm } from './components/login/LoginForm'
import { useAuth } from '@/contexts/MemberAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { NOTIFICATIONS_VIEW_ID, saveDashboardView } from '@/app/dashboard/dashboardView'
import './styles/login/login.css'

export default function LoginPage() {
  const { hasSession } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (hasSession) {
      saveDashboardView(NOTIFICATIONS_VIEW_ID)
      router.push('/dashboard')
    }
  }, [hasSession, router])

  return (
    <div className="auth-layout flex items-center justify-center relative overflow-hidden font-sans">
      <div className="login-background-layer" aria-hidden="true" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-slate-400">
          <p className="mt-2 text-xs">Klik roda gigi untuk memasukkan email dan kata sandi!</p>
        </div>
      </div>
    </div>
  )
}
