'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Menu, Play, ChevronDown, ChevronUp } from 'lucide-react'

interface DashboardBottomNavProps {
  isSidebarOpen: boolean
  toggleSidebar: (e?: React.MouseEvent) => void
  isTourGuideBootstrapped: boolean
  handleEnableTourGuide: () => void
  handleResetTourGuide: () => void
  handleStartJourney: () => void
}

const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({
  isSidebarOpen,
  toggleSidebar,
  isTourGuideBootstrapped,
  handleEnableTourGuide,
  handleResetTourGuide,
  handleStartJourney,
}) => {
  const [isNavVisible, setIsNavVisible] = useState(true)

  console.log('[DashboardBottomNav] Rendering, isTourGuideBootstrapped:', isTourGuideBootstrapped);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible)
  }

  const toggleTourGuide = () => {
    if (isTourGuideBootstrapped) {
      handleResetTourGuide()
      return
    }

    handleEnableTourGuide()
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleNavVisibility}
        className={`fixed left-1/2 z-[1310] -translate-x-1/2 bg-[#101314] border border-b-0 border-white/10 p-1.5 rounded-t-md text-cyan-400 hover:text-cyan-300 transition-all duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] group ${
          isNavVisible
            ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+94px)] md:bottom-[calc(env(safe-area-inset-bottom,0px)+110px)]'
            : 'bottom-[calc(env(safe-area-inset-bottom,0px)+8px)]'
        }`}
        aria-label={isNavVisible ? 'Hide navigation' : 'Show navigation'}
      >
        <div className="relative">
          {isNavVisible ? (
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" />
          )}
        </div>
      </button>

      {/* Navigation Bar */}
      <nav
        className={`dashboard-tour-nav fixed inset-x-0 bottom-0 z-[1300] ${
          isNavVisible ? '' : 'is-hidden'
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
            onClick={toggleTourGuide}
            className={`dashboard-tour-avatar -mt-10 inline-flex h-[78px] w-[78px] items-center justify-center rounded-full ${isTourGuideBootstrapped ? 'is-active' : ''}`}
            aria-label={
              isTourGuideBootstrapped
                ? 'Return Tour Guide to bottom navigation'
                : 'Enable Tour Guide'
            }
          >
            {!isTourGuideBootstrapped ? (
              <Image
                src="/Kepala.png?v=20260528"
                alt="Tour Guide"
                width={56}
                height={56}
                className="dashboard-tour-avatar-image h-14 w-14 object-contain"
                priority
                unoptimized
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
