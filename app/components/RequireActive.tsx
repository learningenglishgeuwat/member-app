'use client'

import React, { useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'
import AuthLoadingSkeleton, { getAuthSkeletonVariant } from './AuthLoadingSkeleton'

type RequireActiveProps = {
  children: React.ReactNode
}

export default function RequireActive({ children }: RequireActiveProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, hasSession, loading, authIssue, sessionHealth, degradedReason } = useAuth()
  const inactiveAllowedPaths = new Set(['/dashboard', '/device-approve'])
  const isInactiveAllowed = inactiveAllowedPaths.has(pathname)
  const skeletonVariant = getAuthSkeletonVariant(pathname)
  const allowSessionPassThrough = hasSession
  const showNonBlockingConnectivityHint = hasSession && sessionHealth === 'degraded'
  const nonBlockingHintText = useMemo(() => {
    if (degradedReason === 'network') return 'Koneksi tidak stabil. Belajar tetap berjalan.'
    if (degradedReason === 'data') return 'Data akun sedang sinkronisasi. Belajar tetap berjalan.'
    if (degradedReason === 'auth') return 'Sesi sedang dipulihkan. Belajar tetap berjalan.'
    return 'Belajar tetap berjalan.'
  }, [degradedReason])
  const connectionHint = useMemo(() => {
    if (authIssue) return authIssue
    const shouldShowHint = loading || (hasSession && !user)
    if (!shouldShowHint) return null
    if (typeof window !== 'undefined' && !navigator.onLine) {
      return 'Koneksi terputus. Periksa jaringan Anda.'
    }
    return 'Sedang memuat data akun...'
  }, [authIssue, loading, hasSession, user])

  const withConnectivityHint = (content: React.ReactNode) => (
    <>
      {showNonBlockingConnectivityHint && (
        <div className="fixed left-1/2 top-2 z-[998] -translate-x-1/2 rounded-full border border-amber-300/70 bg-amber-500/90 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-lg">
          {nonBlockingHintText}
        </div>
      )}
      {content}
    </>
  )

  useEffect(() => {
    if (loading) return

    if (!hasSession) return

    if (user && user.status !== 'active') {
      if (!isInactiveAllowed) {
        router.replace('/dashboard')
      }
    }
  }, [loading, hasSession, user, router, isInactiveAllowed])

  if (loading) {
    if (allowSessionPassThrough) {
      return withConnectivityHint(children)
    }
    return <AuthLoadingSkeleton hint={connectionHint} variant={skeletonVariant} />
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">
        <div className="text-center space-y-3">
          <div>Sesi tidak ditemukan.</div>
          {connectionHint && <div className="text-xs text-amber-300">{connectionHint}</div>}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-300"
            >
              Ke Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (user && user.status !== 'active' && !isInactiveAllowed) {
    return null
  }

  if (!user) {
    if (allowSessionPassThrough) {
      return withConnectivityHint(children)
    }

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

    return <AuthLoadingSkeleton hint={connectionHint} variant={skeletonVariant} />
  }

  return withConnectivityHint(children)
}
