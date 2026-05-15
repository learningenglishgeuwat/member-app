'use client'

import React, { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, Play } from 'lucide-react'
import { useAuth } from '@/contexts/MemberAuthContext'
import DashboardSidebar from './components/DashboardSidebar'
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
const VIEW_IDS = ['dashboard', 'progress', 'achievements', 'notifications', 'tutorial', 'settings', 'device-approve', 'help-support'] as const
type ViewId = (typeof VIEW_IDS)[number]
const VALID_VIEWS = new Set<ViewId>(VIEW_IDS)
const LOCKED_VIEWS = new Set<ViewId>(['achievements'])
const DASHBOARD_VIEW_EVENT = 'geuwat:dashboard-view'
const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'

const LazyTourGuideWidget = dynamic(() => import('../bot-tourguide/TourGuideWidget'), {
  ssr: false,
})

const resolveSavedDashboardView = (): ViewId | null => {
  if (typeof window === 'undefined') return null
  const savedView = window.localStorage.getItem('dashboardCurrentView')
  if (!savedView || !VALID_VIEWS.has(savedView as ViewId)) return null
  const resolvedView = savedView as ViewId
  if (LOCKED_VIEWS.has(resolvedView)) return null
  return resolvedView
}

function DashboardContent() {
  const router = useRouter()
  const { hasSession, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewId>('dashboard')
  const [mountedViews, setMountedViews] = useState<Set<string>>(() => new Set(['dashboard']))
  const [isTourGuideBootstrapped, setIsTourGuideBootstrapped] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasRestoredViewRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (hasSession) return
    router.replace('/login')
  }, [loading, hasSession, router])

  const toggleSidebar = () => {
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

  const handleViewChange = useCallback((nextView: string) => {
    if (!VALID_VIEWS.has(nextView as ViewId)) return
    const safeView = nextView as ViewId
    if (LOCKED_VIEWS.has(safeView)) return

    setMountedViews(prev => {
      if (prev.has(safeView)) return prev
      const next = new Set(prev)
      next.add(safeView)
      return next
    })

    setCurrentView(safeView)
  }, [])

  useEffect(() => {
    if (hasRestoredViewRef.current) return
    hasRestoredViewRef.current = true
    const savedView = resolveSavedDashboardView()
    if (!savedView) return
    const timerId = window.setTimeout(() => {
      handleViewChange(savedView)
    }, 0)
    return () => window.clearTimeout(timerId)
  }, [handleViewChange])

  useEffect(() => {
    if (VALID_VIEWS.has(currentView)) {
      localStorage.setItem('dashboardCurrentView', currentView)
    }
  }, [currentView])

  useEffect(() => {
    const onDashboardViewEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ viewId?: string }>
      const nextView = customEvent.detail?.viewId
      if (!nextView || !VALID_VIEWS.has(nextView as ViewId)) return
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
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
              {renderViewPanel('dashboard', <StartJourney />, 'Loading dashboard...')}
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

        {/* Dashboard Bottom Navbar */}
        <nav
          className="dashboard-tour-nav fixed inset-x-0 bottom-0 z-[80]"
          aria-label="Dashboard navigation"
        >
          <div className="dashboard-tour-nav-panel relative mx-auto w-full max-w-2xl rounded-t-2xl md:mb-4 md:rounded-2xl">
            <div
              className="dashboard-tour-nav-scan pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-2xl"
              aria-hidden="true"
            />
            <div className="flex items-end justify-between px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:px-8 md:pb-4">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="dashboard-tour-nav-action group inline-flex w-24 flex-col items-center gap-2"
                  data-tour="dashboard-mobile-menu-toggle"
                  aria-label={isSidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
                >
                  <Menu className="h-6 w-6 transition" />
                  <span className="text-[11px] font-semibold tracking-[0.24em]">
                    MENU
                  </span>
                </button>

                <button
                  type="button"
                  onClick={isTourGuideBootstrapped ? undefined : handleEnableTourGuide}
                  disabled={isTourGuideBootstrapped}
                  className={`dashboard-tour-avatar -mt-10 inline-flex h-[78px] w-[78px] items-center justify-center rounded-full ${isTourGuideBootstrapped ? 'is-active' : ''}`}
                  aria-label={
                    isTourGuideBootstrapped
                      ? 'Tour Guide Active'
                      : 'Enable Tour Guide'
                  }
                >
                  {!isTourGuideBootstrapped ? (
                    <Image
                      src="/Kepala.png"
                      alt="Tour Guide"
                      width={56}
                      height={56}
                      className="dashboard-tour-avatar-image h-14 w-14 object-contain"
                      priority
                    />
                  ) : (
                    <span className="dashboard-tour-active-dot h-3 w-3 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false)
                    handleViewChange('dashboard')
                  }}
                  className="dashboard-tour-nav-action group inline-flex w-24 flex-col items-center gap-2"
                  aria-label="Start Journey"
                >
                  <Play className="h-6 w-6 transition" />
                  <span className="text-[11px] font-semibold tracking-[0.24em]">
                    MULAI
                  </span>
                </button>
            </div>
          </div>
        </nav>
      </main>
    </div>
  )
}

export default function MemberDashboard() {
  return <DashboardContent />
}
