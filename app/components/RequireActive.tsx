'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'

type RequireActiveProps = {
  children: React.ReactNode
}

export default function RequireActive({ children }: RequireActiveProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hasSession, loading, authIssue } = useAuth()
  const [connectionHint, setConnectionHint] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [graceExpired, setGraceExpired] = useState(false)
  const inactiveAllowedPaths = new Set(['/dashboard', '/device-approve'])
  const isInactiveAllowed = inactiveAllowedPaths.has(pathname)

  useEffect(() => {
    if (loading) return

    if (!hasSession) {
      if (!authIssue && graceExpired) {
        router.replace('/login')
      }
      return
    }

    if (user && user.status !== 'active') {
      if (!isInactiveAllowed) {
        router.replace('/dashboard')
      }
    }
  }, [loading, hasSession, user, router, pathname])

  useEffect(() => {
    let timeoutId: number | null = null
    if (loading) {
      setGraceExpired(false)
      return
    }
    timeoutId = window.setTimeout(() => setGraceExpired(true), 2000)
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [loading])

  useEffect(() => {
    let timeoutId: number | null = null

    if (authIssue) {
      setConnectionHint(authIssue)
      return
    }

    const shouldShowHint = loading || (hasSession && !user)
    if (shouldShowHint) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setConnectionHint('Koneksi terputus. Periksa jaringan Anda.')
      } else {
        setConnectionHint('Sedang menyiapkan akun, mohon tunggu sebentar...')
        timeoutId = window.setTimeout(() => {
          setConnectionHint('Masih memuat. Jika lebih dari 1 menit, cek koneksi Anda.')
        }, 12000)
      }
    } else {
      setConnectionHint(null)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [loading, hasSession, user, authIssue])

  useEffect(() => {
    let intervalId: number | null = null
    const stage = loading ? 'session' : hasSession && !user ? 'user' : 'done'

    if (stage === 'done') {
      setProgress(100)
      return
    }

    const bounds = stage === 'session' ? { min: 15, max: 65 } : { min: 70, max: 95 }
    setProgress((prev) => Math.max(prev, bounds.min))

    intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= bounds.max) return bounds.max
        const bump = Math.floor(Math.random() * 6) + 1
        return Math.min(prev + bump, bounds.max)
      })
    }, 350)

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [loading, hasSession, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <div className="text-center space-y-2">
          <div>{progress}%</div>
          {connectionHint && <div className="text-xs text-amber-300">{connectionHint}</div>}
        </div>
      </div>
    )
  }

  if (!hasSession) {
    if (authIssue) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
          <div className="text-center space-y-3">
            <div>Gagal memuat sesi.</div>
            <div className="text-xs text-amber-300">{authIssue}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-300"
            >
              Coba lagi
            </button>
          </div>
        </div>
      )
    }
    if (!graceExpired) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
          <div className="text-center space-y-2">
            <div>{progress}%</div>
            {connectionHint && <div className="text-xs text-amber-300">{connectionHint}</div>}
          </div>
        </div>
      )
    }
    return null
  }

  if (user && user.status !== 'active' && !isInactiveAllowed) {
    return null
  }

  if (!user) {
    if (authIssue) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
          <div className="text-center space-y-3">
            <div>Gagal memuat data akun.</div>
            <div className="text-xs text-amber-300">{authIssue}</div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-300"
            >
              Coba lagi
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <div className="text-center space-y-2">
          <div>{progress}%</div>
          {connectionHint && <div className="text-xs text-amber-300">{connectionHint}</div>}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
