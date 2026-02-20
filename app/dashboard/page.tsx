'use client'

import React, { useState, lazy, Suspense, useEffect, useTransition, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import DashboardSidebar from './components/DashboardSidebar'
import './dashboard.css'
import '../styles/scrollbar.css'

// Lazy load semua page components
const StartJourney = lazy(() => import('./components/StartJourney'))
const ProgressContent = lazy(() => import('./components/ProgressContent'))
const AchievementsContent = lazy(() => import('./components/AchievementsContent'))
const NotificationContent = lazy(() => import('./components/NotificationContent'))
const SettingsContent = lazy(() => import('./components/SettingsContent'))
const TutorialContent = lazy(() => import('./components/TutorialContent'))
const HelpSupportContent = lazy(() => import('./components/HelpSupportContent'))
const VIEW_IDS = ['dashboard', 'progress', 'achievements', 'notifications', 'tutorial', 'settings', 'help-support'] as const
type ViewId = (typeof VIEW_IDS)[number]
const VALID_VIEWS = new Set<ViewId>(VIEW_IDS)

function DashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewId>('dashboard')
  const [mountedViews, setMountedViews] = useState<Set<string>>(() => new Set(['dashboard']))
  const [isPending, startTransition] = useTransition()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleViewChange = (nextView: string) => {
    if (!VALID_VIEWS.has(nextView as ViewId)) return
    const safeView = nextView as ViewId

    setMountedViews(prev => {
      if (prev.has(safeView)) return prev
      const next = new Set(prev)
      next.add(safeView)
      return next
    })

    startTransition(() => {
      setCurrentView(safeView)
    })
  }

  useEffect(() => {
    const savedView = localStorage.getItem('dashboardCurrentView')
    if (!savedView || !VALID_VIEWS.has(savedView as ViewId)) return

    const restoredView = savedView as ViewId
    setMountedViews(prev => {
      if (prev.has(restoredView)) return prev
      const next = new Set(prev)
      next.add(restoredView)
      return next
    })
    setCurrentView(restoredView)
  }, [])

  useEffect(() => {
    if (VALID_VIEWS.has(currentView)) {
      localStorage.setItem('dashboardCurrentView', currentView)
    }
  }, [currentView])

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  useEffect(() => {
    const prefetch = () => {
      // Prefetch all dashboard chunks to reduce first-switch lag
      import('./components/StartJourney')
      import('./components/ProgressContent')
      import('./components/AchievementsContent')
      import('./components/NotificationContent')
      import('./components/SettingsContent')
      import('./components/TutorialContent')
      import('./components/HelpSupportContent')
    }

    if ('requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(prefetch)
      return () => {
        if ('cancelIdleCallback' in window) {
          ;(window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
        }
      }
    }

    const timeoutId = setTimeout(prefetch, 300)
    return () => clearTimeout(timeoutId)
  }, [])

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

  return (
    <div className="dashboard-layout font-sans flex overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        currentView={currentView}
        setCurrentView={handleViewChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen overflow-hidden relative">
        {/* Background Gradients/Effects - Nebula Style */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-slate-950/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-display font-bold text-lg text-white">GEUWAT</span>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-display font-bold text-white capitalize">
                  {currentView}
                  {isPending ? <span className="ml-2 text-xs text-slate-400 font-mono">Loading...</span> : null}
                </h1>
                <p className="text-slate-400 mt-1 font-mono text-sm">Manage your learning journey</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="dashboard-view-stack">
              {renderViewPanel('dashboard', <StartJourney />, 'Loading dashboard...')}
              {renderViewPanel('progress', <ProgressContent />, 'Loading progress...')}
              {renderViewPanel('achievements', <AchievementsContent />, 'Loading achievements...')}
              {renderViewPanel('notifications', <NotificationContent />, 'Loading notifications...')}
              {renderViewPanel('tutorial', <TutorialContent />, 'Loading tutorial...')}
              {renderViewPanel('settings', <SettingsContent />, 'Loading settings...')}
              {renderViewPanel('help-support', <HelpSupportContent />, 'Loading help & support...')}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MemberDashboard() {
  return <DashboardContent />
}
