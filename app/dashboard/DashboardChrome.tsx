'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import DashboardSidebar from './components/DashboardSidebar'
import DashboardBottomNav from './components/DashboardBottomNav'
import {
  START_JOURNEY_VIEW_ID,
  type ViewId,
} from './dashboardView'

const dashboardPanelLoading = (label: string) => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-slate-400">{label}</div>
  </div>
)

const StartJourney = dynamic(() => import('./components/StartJourney'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading dashboard...'),
})
const ProgressContent = dynamic(() => import('./components/ProgressContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading progress...'),
})
const AchievementsContent = dynamic(() => import('./components/AchievementsContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading achievements...'),
})
const NotificationContent = dynamic(() => import('./components/NotificationContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading notifications...'),
})
const SettingsContent = dynamic(() => import('./components/SettingsContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading settings...'),
})
const TutorialContent = dynamic(() => import('./components/TutorialContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading tutorial...'),
})
const HelpSupportContent = dynamic(() => import('./components/HelpSupportContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading help & support...'),
})
const DeviceApproveContent = dynamic(() => import('./components/DeviceApproveContent'), {
  ssr: false,
  loading: () => dashboardPanelLoading('Loading device approval...'),
})
const LazyTourGuideWidget = dynamic(() => import('../bot-tourguide/TourGuideWidget'), {
  ssr: false,
})

type DashboardChromeProps = {
  canAccessStartJourney: boolean
  currentView: ViewId
  handleEnableTourGuide: () => void
  handleResetTourGuide: () => void
  handleStartJourney: () => void
  handleViewChange: (nextView: string) => void
  isSidebarOpen: boolean
  isTourGuideBootstrapped: boolean
  mountedViews: Set<string>
  onStartJourneyBlocked: () => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
  setIsSidebarOpen: (isOpen: boolean) => void
  subscriptionPrompt: React.ReactNode
  toggleSidebar: (event?: React.MouseEvent) => void
}

export default function DashboardChrome({
  canAccessStartJourney,
  currentView,
  handleEnableTourGuide,
  handleResetTourGuide,
  handleStartJourney,
  handleViewChange,
  isSidebarOpen,
  isTourGuideBootstrapped,
  mountedViews,
  onStartJourneyBlocked,
  scrollContainerRef,
  setIsSidebarOpen,
  subscriptionPrompt,
  toggleSidebar,
}: DashboardChromeProps) {
  const renderViewPanel = (viewId: string, element: React.ReactNode) => {
    if (!mountedViews.has(viewId)) return null
    const isActive = currentView === viewId

    return (
      <section
        key={viewId}
        className={`dashboard-view-panel ${isActive ? 'active' : 'inactive'}`}
        aria-hidden={!isActive}
      >
        {element}
      </section>
    )
  }

  return (
    <div className="dashboard-layout font-sans flex overflow-hidden" data-tour="dashboard-layout">
      <div data-tour="dashboard-sidebar">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={handleViewChange}
          canAccessStartJourney={canAccessStartJourney}
          onStartJourneyBlocked={onStartJourneyBlocked}
        />
      </div>

      <main className="flex-1 flex flex-col min-h-screen md:h-screen overflow-hidden relative">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 pb-28 md:p-8 md:pb-32 lg:p-12 lg:pb-36 scroll-smooth"
        >
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="dashboard-view-stack" data-tour="dashboard-view-stack">
              {canAccessStartJourney
                ? renderViewPanel(START_JOURNEY_VIEW_ID, <StartJourney />)
                : null}
              {renderViewPanel('progress', <ProgressContent />)}
              {renderViewPanel('achievements', <AchievementsContent />)}
              {renderViewPanel('notifications', <NotificationContent />)}
              {renderViewPanel('tutorial', <TutorialContent />)}
              {renderViewPanel('settings', <SettingsContent />)}
              {renderViewPanel('device-approve', <DeviceApproveContent />)}
              {renderViewPanel('help-support', <HelpSupportContent />)}
            </div>
          </div>
        </div>

        {isTourGuideBootstrapped ? <LazyTourGuideWidget currentPath="/dashboard" /> : null}
        {subscriptionPrompt}

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
