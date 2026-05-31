'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'
import { useTourGuideStyles } from '@/app/bot-tourguide/useTourGuideStyles'
import DashboardLoadingShell from './DashboardLoadingShell'
import {
  DASHBOARD_VIEW_STORAGE_KEY,
  NOTIFICATIONS_VIEW_ID,
  START_JOURNEY_VIEW_ID,
  type ViewId,
  isDashboardViewId,
  resolveDashboardView,
  saveDashboardView,
} from './dashboardView'

const DashboardChrome = dynamic(() => import('./DashboardChrome'), {
  ssr: false,
  loading: () => <DashboardLoadingShell />,
})
const DASHBOARD_VIEW_EVENT = 'geuwat:dashboard-view'
const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'
const ADMIN_WHATSAPP_NUMBER = '6285846007119'

const resolveSavedDashboardView = (canAccessStartJourney: boolean): ViewId | null => {
  if (typeof window === 'undefined') return null
  const savedView = window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY)
  return resolveDashboardView(savedView, canAccessStartJourney)
}

export default function DashboardClient() {
  const router = useRouter()
  const { hasSession, loading, user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewId | null>(null)
  const [mountedViews, setMountedViews] = useState<Set<string>>(() => new Set())
  const [isTourGuideBootstrapped, setIsTourGuideBootstrapped] = useState(false)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  useTourGuideStyles(isTourGuideBootstrapped)
  const hasRestoredViewRef = useRef(false)
  const canAccessStartJourney = user?.status === 'active'

  useEffect(() => {
    if (loading) return
    if (hasSession) return
    router.replace('/login')
  }, [loading, hasSession, router])

  const toggleSidebar = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleEnableTourGuide = () => {
    try {
      window.localStorage.setItem(TOURGUIDE_COLLAPSED_STORAGE_KEY, '1')
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
    setIsTourGuideBootstrapped(true)
  }

  const handleResetTourGuide = () => {
    try {
      window.localStorage.setItem(TOURGUIDE_COLLAPSED_STORAGE_KEY, '1')
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
    setIsTourGuideBootstrapped(false)
  }

  const openSubscriptionWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo admin, saya ingin mengaktifkan langganan GEUWAT Member.\n\n` +
      `Nama: ${user?.fullname || '-'}\n` +
      `Email: ${user?.email || '-'}\n\n` +
      `Mohon dibantu untuk aktivasi langganan agar saya bisa membuka Start Journey.`
    )
    window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  const handleBlockedStartJourney = () => {
    handleViewChange(NOTIFICATIONS_VIEW_ID)
    setIsSidebarOpen(false)
    setShowSubscriptionPrompt(true)
  }

  const handleStartJourney = () => {
    if (!canAccessStartJourney) {
      handleBlockedStartJourney()
      return
    }
    setIsSidebarOpen(false)
    handleViewChange(START_JOURNEY_VIEW_ID)
  }

  const handleViewChange = (nextView: string) => {
    const safeView = resolveDashboardView(nextView, canAccessStartJourney)
    if (!safeView) return

    setMountedViews(prev => {
      if (prev.has(safeView)) return prev
      const next = new Set(prev)
      next.add(safeView)
      return next
    })

    setCurrentView(safeView)
  }

  useEffect(() => {
    if (hasRestoredViewRef.current) return
    if (loading || !hasSession || !user) return
    hasRestoredViewRef.current = true
    const savedView = resolveSavedDashboardView(canAccessStartJourney)
    const fallbackView = canAccessStartJourney ? START_JOURNEY_VIEW_ID : NOTIFICATIONS_VIEW_ID
    const nextView = savedView ?? fallbackView
    const timerId = window.setTimeout(() => {
      setMountedViews(prev => {
        if (prev.has(nextView)) return prev
        const next = new Set(prev)
        next.add(nextView)
        return next
      })
      setCurrentView(nextView)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [canAccessStartJourney, hasSession, loading, user])

  useEffect(() => {
    if (currentView && isDashboardViewId(currentView)) {
      saveDashboardView(currentView)
    }
  }, [currentView])

  useEffect(() => {
    const onDashboardViewEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ viewId?: string }>
      const nextView = customEvent.detail?.viewId
      if (!nextView || !isDashboardViewId(nextView)) return
      const safeView = resolveDashboardView(nextView, canAccessStartJourney)
      if (!safeView) return
      setMountedViews(prev => {
        if (prev.has(safeView)) return prev
        const next = new Set(prev)
        next.add(safeView)
        return next
      })
      setCurrentView(safeView)
    }

    window.addEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
    return () => window.removeEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
  }, [canAccessStartJourney])

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  if (loading || (hasSession && !user)) {
    return <DashboardLoadingShell />
  }

  if (!hasSession) {
    return null
  }

  if (!currentView) {
    return <DashboardLoadingShell />
  }

  const subscriptionPrompt = showSubscriptionPrompt ? (
          <div
            className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+122px)] right-4 z-[1400] w-[min(calc(100vw-2rem),360px)] rounded-xl border border-cyan-400/35 bg-slate-950/95 p-4 text-slate-100 shadow-[0_0_30px_rgba(34,211,238,0.24)] backdrop-blur-xl md:bottom-28 md:right-8"
            role="tooltip"
            aria-live="polite"
          >
            <div className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-cyan-400/35 bg-slate-950/95" />
            <div className="relative space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Langganan diperlukan
                </p>
                <button
                  type="button"
                  onClick={() => setShowSubscriptionPrompt(false)}
                  className="-mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white"
                  aria-label="Tutup tooltip langganan"
                >
                  x
                </button>
              </div>
              <p className="text-sm font-semibold text-white">
                Aktifkan langganan untuk membuka Start Journey.
              </p>
              <p className="text-xs leading-relaxed text-slate-300">
                Klik WhatsApp untuk menghubungi admin dan meminta aktivasi akun.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubscriptionPrompt(false)
                    openSubscriptionWhatsApp()
                  }}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  WhatsApp Admin
                </button>
              </div>
            </div>
          </div>
        ) : null

  return (
    <DashboardChrome
      canAccessStartJourney={canAccessStartJourney}
      currentView={currentView}
      handleEnableTourGuide={handleEnableTourGuide}
      handleResetTourGuide={handleResetTourGuide}
      handleStartJourney={handleStartJourney}
      handleViewChange={handleViewChange}
      isSidebarOpen={isSidebarOpen}
      isTourGuideBootstrapped={isTourGuideBootstrapped}
      mountedViews={mountedViews}
      onStartJourneyBlocked={handleBlockedStartJourney}
      scrollContainerRef={scrollContainerRef}
      setIsSidebarOpen={setIsSidebarOpen}
      subscriptionPrompt={subscriptionPrompt}
      toggleSidebar={toggleSidebar}
    />
  )
}
