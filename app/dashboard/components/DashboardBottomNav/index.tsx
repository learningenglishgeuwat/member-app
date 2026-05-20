'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Menu, Play, ChevronDown, ChevronUp } from 'lucide-react'

interface DashboardBottomNavProps {
  isSidebarOpen: boolean
  toggleSidebar: (e?: React.MouseEvent) => void
  isTourGuideBootstrapped: boolean
  handleEnableTourGuide: () => void
  handleStartJourney: () => void
}

const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({
  isSidebarOpen,
  toggleSidebar,
  isTourGuideBootstrapped,
  handleEnableTourGuide,
  handleStartJourney,
}) => {
  const [isNavVisible, setIsNavVisible] = useState(true)

  console.log('[DashboardBottomNav] Rendering, isTourGuideBootstrapped:', isTourGuideBootstrapped);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible)
  }

  return (
    <>
      {/* Toggle Button - Arrow Only */}
      <button
        type="button"
        onClick={toggleNavVisibility}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[1310] transition-all duration-300 group"
        style={{
          transform: isNavVisible 
            ? 'translate(-50%, calc(-100% - 8px))' 
            : 'translate(-50%, -8px)'
        }}
        aria-label={isNavVisible ? 'Hide navigation' : 'Show navigation'}
      >
        {/* Arrow Icon Only - No Circle */}
        <div className="relative">
          {isNavVisible ? (
            <ChevronDown className="w-6 h-6 text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.6)] group-hover:text-purple-200 transition-colors" />
          ) : (
            <ChevronUp className="w-6 h-6 text-purple-300 drop-shadow-[0_2px_8px_rgba(168,85,247,0.6)] group-hover:text-purple-200 transition-colors" />
          )}
        </div>
      </button>

      {/* Navigation Bar */}
      <nav
        className={`dashboard-tour-nav fixed inset-x-0 bottom-0 z-[1300] transition-transform duration-300 ${
          isNavVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-label="Dashboard navigation"
        aria-hidden={!isNavVisible}
      >
      <div className="dashboard-tour-nav-panel relative mx-auto w-full max-w-2xl rounded-t-2xl md:mb-4 md:rounded-2xl">
        <div
          className="dashboard-tour-nav-scan pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-2xl"
          aria-hidden="true"
        />
        <div className="flex items-end justify-between px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:px-8 md:pb-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleSidebar(e)
            }}
            className="dashboard-tour-nav-action group inline-flex w-24 flex-col items-center gap-2 relative z-[9999] pointer-events-auto cursor-pointer"
            data-tour="dashboard-mobile-menu-toggle"
            aria-label={isSidebarOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
            style={{ touchAction: 'manipulation' }}
          >
            <Menu className="h-6 w-6 transition pointer-events-none" />
            <span className="text-[11px] font-semibold tracking-[0.24em] pointer-events-none">
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
            onClick={handleStartJourney}
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
    </>
  )
}

export default DashboardBottomNav
