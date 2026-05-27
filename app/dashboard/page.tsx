'use client'

import React, { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'
import DashboardSidebar from './components/DashboardSidebar'
import DashboardBottomNav from './components/DashboardBottomNav'
import {
  DASHBOARD_VIEW_STORAGE_KEY,
  NOTIFICATIONS_VIEW_ID,
  START_JOURNEY_VIEW_ID,
  type ViewId,
  isDashboardViewId,
  resolveDashboardView,
  saveDashboardView,
} from './dashboardView'
import './dashboard.css'

// Lazy load semua page components
const StartJourney = lazy(() => import('./components/StartJourney'))
const ProgressContent = lazy(() => import('./components/ProgressContent'))
const AchievementsContent = lazy(() => import('./components/AchievementsContent'))
const NotificationContent = lazy(() => import('./components/NotificationContent'))
const SettingsContent = lazy(() => import('./components/SettingsContent'))
const TutorialContent = lazy(() => import('./components/TutorialContent'))
const HelpSupportContent = lazy(() => import('./components/HelpSupportContent'))
const DeviceApproveContent = lazy(() => import('./components/DeviceApproveContent'))
const DASHBOARD_VIEW_EVENT = 'geuwat:dashboard-view'
const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'
const ADMIN_WHATSAPP_NUMBER = '6285846007119'

const LazyTourGuideWidget = dynamic(() => import('../bot-tourguide/TourGuideWidget'), {
  ssr: false,
})

const resolveSavedDashboardView = (canAccessStartJourney: boolean): ViewId | null => {
  if (typeof window === 'undefined') return null
  const savedView = window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY)
  return resolveDashboardView(savedView, canAccessStartJourney)
}

function DashboardContent() {
  const router = useRouter()
  const { hasSession, loading, user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewId>(START_JOURNEY_VIEW_ID)
  const [mountedViews, setMountedViews] = useState<Set<string>>(() => new Set([START_JOURNEY_VIEW_ID]))
  const [isTourGuideBootstrapped, setIsTourGuideBootstrapped] = useState(false)
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasRestoredViewRef = useRef(false)
  const canAccessStartJourney = user?.status === 'active'

  useEffect(() => {
    if (loading) return
    if (hasSession) return
    router.replace('/login')
  }, [loading, hasSession, router])

  const toggleSidebar = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log('Toggle sidebar clicked! Current state:', isSidebarOpen, '-> New state:', !isSidebarOpen)
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleEnableTourGuide = () => {
    try {
      // Enable Tour Guide without opening the panel first (show avatar at top-right).
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
    setCurrentView(NOTIFICATIONS_VIEW_ID)
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

  const handleViewChange = useCallback((nextView: string) => {
    const safeView = resolveDashboardView(nextView, canAccessStartJourney)
    if (!safeView) return

    setMountedViews(prev => {
      if (prev.has(safeView)) return prev
      const next = new Set(prev)
      next.add(safeView)
      return next
    })

    setCurrentView(safeView)
  }, [canAccessStartJourney])

  useEffect(() => {
    if (hasRestoredViewRef.current) return
    if (loading || !hasSession || !user) return
    hasRestoredViewRef.current = true
    const savedView = resolveSavedDashboardView(canAccessStartJourney)
    const fallbackView = canAccessStartJourney ? START_JOURNEY_VIEW_ID : NOTIFICATIONS_VIEW_ID
    const nextView = savedView ?? fallbackView
    const timerId = window.setTimeout(() => {
      handleViewChange(nextView)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [canAccessStartJourney, handleViewChange, hasSession, loading, user])

  useEffect(() => {
    if (isDashboardViewId(currentView)) {
      saveDashboardView(currentView)
    }
  }, [currentView])

  useEffect(() => {
    const onDashboardViewEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ viewId?: string }>
      const nextView = customEvent.detail?.viewId
      if (!nextView || !isDashboardViewId(nextView)) return
      handleViewChange(nextView)
    }

    window.addEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
    return () => window.removeEventListener(DASHBOARD_VIEW_EVENT, onDashboardViewEvent as EventListener)
  }, [handleViewChange])

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  const renderViewPanel = (viewId: string, element: React.ReactNode, loadingLabel: string) => {
    if (!mountedViews.has(viewId)) return null
    const isActive = currentView === viewId

    return (
      <section
        key={viewId}
        className={`dashboard-view-panel ${isActive ? 'active' : 'inactive'}`}
        aria-hidden={!isActive}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">{loadingLabel}</div>
            </div>
          }
        >
          {element}
        </Suspense>
      </section>
    )
  }

  if (loading || (hasSession && !user)) {
    return (
      <div className="min-h-screen bg-black text-slate-300 flex items-center justify-center">
        <div className="text-sm">Memuat dashboard...</div>
      </div>
    )
  }

  if (!hasSession) {
    // Redirect is handled by the effect above.
    return null
  }

  return (
    <div className="dashboard-layout font-sans flex overflow-hidden" data-tour="dashboard-layout">
      {/* Sidebar */}
      <div data-tour="dashboard-sidebar">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={handleViewChange}
          canAccessStartJourney={canAccessStartJourney}
          onStartJourneyBlocked={handleBlockedStartJourney}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen overflow-hidden relative">
        {/* Background Gradients/Effects - Nebula Style */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Content Scrollable Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-32 lg:p-12 lg:pb-36 scroll-smooth"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="dashboard-view-stack" data-tour="dashboard-view-stack">
              {canAccessStartJourney
                ? renderViewPanel(START_JOURNEY_VIEW_ID, <StartJourney />, 'Loading dashboard...')
                : null}
              {renderViewPanel('progress', <ProgressContent />, 'Loading progress...')}
              {renderViewPanel('achievements', <AchievementsContent />, 'Loading achievements...')}
              {renderViewPanel('notifications', <NotificationContent />, 'Loading notifications...')}
              {renderViewPanel('tutorial', <TutorialContent />, 'Loading tutorial...')}
              {renderViewPanel('settings', <SettingsContent />, 'Loading settings...')}
              {renderViewPanel('device-approve', <DeviceApproveContent />, 'Loading device approval...')}
              {renderViewPanel('help-support', <HelpSupportContent />, 'Loading help & support...')}
            </div>
          </div>
        </div>

        {isTourGuideBootstrapped ? <LazyTourGuideWidget currentPath="/dashboard" /> : null}

        {showSubscriptionPrompt ? (
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
        ) : null}

        {/* Dashboard Bottom Navbar */}
        <DashboardBottomNav
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isTourGuideBootstrapped={isTourGuideBootstrapped}
          handleEnableTourGuide={handleEnableTourGuide}
          handleResetTourGuide={handleResetTourGuide}
          handleStartJourney={handleStartJourney}
        />
      </main>
    </div>
  )
}

export default function MemberDashboard() {
  return <DashboardContent />
}
