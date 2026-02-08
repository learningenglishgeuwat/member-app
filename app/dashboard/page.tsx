'use client'

import React, { useState, lazy, Suspense, useEffect, useTransition } from 'react'
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

function DashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [isPending, startTransition] = useTransition()
  const validViews = new Set([
    'dashboard',
    'progress',
    'achievements',
    'notifications',
    'tutorial',
    'settings',
  ])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleViewChange = (nextView: string) => {
    startTransition(() => {
      setCurrentView(nextView)
    })
  }

  useEffect(() => {
    const savedView = localStorage.getItem('dashboardCurrentView')
    if (savedView && validViews.has(savedView)) {
      setCurrentView(savedView)
    }
  }, [])

  useEffect(() => {
    if (validViews.has(currentView)) {
      localStorage.setItem('dashboardCurrentView', currentView)
    }
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
    }

    if ('requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(prefetch)
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id)
        }
      }
    }

    const timeoutId = setTimeout(prefetch, 300)
    return () => clearTimeout(timeoutId)
  }, [])

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading dashboard...</div>
            </div>
          }>
            <StartJourney />
          </Suspense>
        )
      case 'progress':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading progress...</div>
            </div>
          }>
            <ProgressContent />
          </Suspense>
        )
      case 'achievements':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading achievements...</div>
            </div>
          }>
            <AchievementsContent />
          </Suspense>
        )
      case 'notifications':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading notifications...</div>
            </div>
          }>
            <NotificationContent />
          </Suspense>
        )
      case 'tutorial':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading tutorial...</div>
            </div>
          }>
            <TutorialContent />
          </Suspense>
        )
      case 'settings':
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading settings...</div>
            </div>
          }>
            <SettingsContent />
          </Suspense>
        )
      default:
        return (
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-slate-400">Loading dashboard...</div>
            </div>
          }>
            <StartJourney />
          </Suspense>
        )
    }
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
                  {isPending ? <span className="ml-2 text-xs text-slate-400 font-mono">Loading…</span> : null}
                </h1>
                <p className="text-slate-400 mt-1 font-mono text-sm">Manage your learning journey</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-fade-in relative z-10">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function MemberDashboard() {
  return <DashboardContent />
}
