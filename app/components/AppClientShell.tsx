'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/MemberAuthContext'

const MobileBottomNav = dynamic(() => import('@/app/components/MobileBottomNav'), {
  ssr: false,
})

const TourGuideMount = dynamic(() => import('@/app/bot-tourguide/TourGuideMount'), {
  ssr: false,
})

const GlobalHaptic = dynamic(
  () => import('@/app/components/haptic').then((mod) => mod.GlobalHaptic),
  {
    ssr: false,
  },
)

const GlobalAudio = dynamic(() => import('@/app/components/GlobalAudio'), { ssr: false })

const SkillThemeSync = dynamic(() => import('@/app/components/SkillThemeSync'), {
  ssr: false,
})

const ScrollToHashMount = dynamic(() => import('@/app/components/ScrollToHashMount'), {
  ssr: false,
})

const GlobalScrollToItemMount = dynamic(() => import('@/app/components/GlobalScrollToItemMount'), {
  ssr: false,
})

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])
const ENHANCEMENT_DELAY_MS = 800

function normalizePathname(pathname: string | null) {
  if (!pathname) return ''
  return pathname.replace(/\/$/, '') || '/'
}

function shouldRenderMobileBottomNav(pathname: string) {
  if (!pathname || PUBLIC_PATHS.has(pathname)) return false
  if (pathname === '/dashboard') return false
  if (pathname === '/skill') return false
  return true
}

function shouldRenderTourGuide(pathname: string) {
  if (!pathname || PUBLIC_PATHS.has(pathname)) return false
  if (pathname === '/dashboard') return false
  if (pathname === '/skill') return false
  return true
}

function useDeferredEnhancements() {
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (isReady) return

    let timeoutId: number | null = null
    let idleId: number | null = null
    let cancelled = false

    const markReady = () => {
      if (!cancelled) setIsReady(true)
    }

    timeoutId = window.setTimeout(markReady, ENHANCEMENT_DELAY_MS)

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(markReady, { timeout: ENHANCEMENT_DELAY_MS })
    }

    return () => {
      cancelled = true
      if (timeoutId !== null) window.clearTimeout(timeoutId)
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [isReady])

  return isReady
}

export default function AppClientShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePathname(usePathname())
  const enhancementsReady = useDeferredEnhancements()

  return (
    <AuthProvider>
      {children}
      {enhancementsReady ? (
        <GlobalHaptic>
          <GlobalAudio>
            <ScrollToHashMount />
            <GlobalScrollToItemMount />
            <SkillThemeSync />
            {shouldRenderMobileBottomNav(pathname) ? <MobileBottomNav /> : null}
            {shouldRenderTourGuide(pathname) ? <TourGuideMount /> : null}
          </GlobalAudio>
        </GlobalHaptic>
      ) : null}
    </AuthProvider>
  )
}
