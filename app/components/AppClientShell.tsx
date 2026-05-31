'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/contexts/MemberAuthContext'
import { GlobalHaptic } from '@/app/components/haptic'
import SkillThemeSync from '@/app/components/SkillThemeSync'
import ScrollToHashMount from '@/app/components/ScrollToHashMount'
import GlobalScrollToItemMount from '@/app/components/GlobalScrollToItemMount'

const MobileBottomNav = dynamic(() => import('@/app/components/MobileBottomNav'), {
  ssr: false,
})

const TourGuideMount = dynamic(() => import('@/app/bot-tourguide/TourGuideMount'), {
  ssr: false,
})

const SkillGameButton = dynamic(() => import('@/app/skill/components/SkillGameButton'), {
  ssr: false,
})

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])

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

function shouldRenderSkillGameButton(pathname: string) {
  if (!pathname) return false
  if (pathname.startsWith('/dashboard')) return false
  if (pathname === '/skill') return false
  if (pathname === '/skill/game-links') return false
  return true
}

export default function AppClientShell({ children }: { children: React.ReactNode }) {
  const pathname = normalizePathname(usePathname())

  return (
    <AuthProvider>
      <GlobalHaptic>
        {children}
        <ScrollToHashMount />
        <GlobalScrollToItemMount />
        <SkillThemeSync />
        {shouldRenderSkillGameButton(pathname) ? <SkillGameButton /> : null}
        {shouldRenderMobileBottomNav(pathname) ? <MobileBottomNav /> : null}
        {shouldRenderTourGuide(pathname) ? <TourGuideMount /> : null}
      </GlobalHaptic>
    </AuthProvider>
  )
}
