'use client'

import { LoginForm } from './components/login/LoginForm'
import { useAuth } from '@/contexts/MemberAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import './styles/login/login.css'

export default function LoginPage() {
  const { hasSession } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (hasSession) {
      router.push('/dashboard')
    }
  }, [hasSession, router])

  return (
    <div className="auth-layout flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Gradients/Effects - Nebula Style */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-nebula-900/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
        
        <div className="mt-8 text-center text-sm text-slate-400">
          <p className="mt-2 text-xs">Click the gears to activate form fields!</p>
        </div>
      </div>
    </div>
  )
}
