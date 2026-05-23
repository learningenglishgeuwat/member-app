'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Menu, X, BarChart2, LayoutGrid, Settings, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import './MobileBottomNav.css'

const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'
const TOURGUIDE_BOOTSTRAP_EVENT = 'geuwat:tourguide-bootstrap'
const TOURGUIDE_RESET_EVENT = 'geuwat:tourguide-reset'
const DASHBOARD_VIEW_STORAGE_KEY = 'dashboardCurrentView'

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])

function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function dispatchBootstrapTourGuide() {
  try {
    window.dispatchEvent(new Event(TOURGUIDE_BOOTSTRAP_EVENT))
  } catch {
    // ignore
  }
}

function dispatchResetTourGuide() {
  try {
    window.dispatchEvent(new Event(TOURGUIDE_RESET_EVENT))
  } catch {
    // ignore
  }
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tourGuideBootstrapped, setTourGuideBootstrapped] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)

  const shouldRender = useMemo(() => {
    if (!pathname) return false
    if (PUBLIC_PATHS.has(pathname)) return false
    if (pathname === '/dashboard') return false
    // Hide only on Skill menu page, but show on skill modules.
    if (pathname === '/skill' || pathname === '/skill/') return false
    return true
  }, [pathname])

  const goDashboardView = (viewId: string) => {
    safeSetLocalStorage(DASHBOARD_VIEW_STORAGE_KEY, viewId)
    router.push('/dashboard')
  }

  const enableTourGuide = () => {
    safeSetLocalStorage(TOURGUIDE_COLLAPSED_STORAGE_KEY, '1')
    setTourGuideBootstrapped(true)
    dispatchBootstrapTourGuide()
  }

  const resetTourGuide = () => {
    safeSetLocalStorage(TOURGUIDE_COLLAPSED_STORAGE_KEY, '1')
    setTourGuideBootstrapped(false)
    dispatchResetTourGuide()
  }

  const toggleTourGuide = () => {
    if (tourGuideBootstrapped) {
      resetTourGuide()
      return
    }

    enableTourGuide()
  }

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible)
  }

  if (!shouldRender) return null

  return (
    <>
      <div className="h-28" aria-hidden="true" />

      {/* Toggle Button - Arrow Only */}
      <button
        type="button"
        onClick={toggleNavVisibility}
        className={`fixed left-1/2 z-[90] -translate-x-1/2 transition-all duration-300 group ${
          isNavVisible
            ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+94px)] md:bottom-[calc(env(safe-area-inset-bottom,0px)+110px)]'
            : 'bottom-[calc(env(safe-area-inset-bottom,0px)+8px)]'
        }`}
        aria-label={isNavVisible ? 'Hide navigation' : 'Show navigation'}
      >
        {/* Arrow Icon Only - No Circle */}
        <div className="relative">
          {isNavVisible ? (
            <ChevronDown className="w-6 h-6 text-cyan-300 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)] group-hover:text-cyan-200 transition-colors" />
          ) : (
            <ChevronUp className="w-6 h-6 text-cyan-300 drop-shadow-[0_2px_8px_rgba(34,211,238,0.6)] group-hover:text-cyan-200 transition-colors" />
          )}
        </div>
      </button>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {menuOpen ? (
        <aside
          className="fixed inset-x-0 bottom-0 z-[95] rounded-t-2xl border-t border-white/10 bg-black/95 backdrop-blur-xl"
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="text-sm font-semibold text-white">Menu</div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+18px)]">
            <button
              type="button"
              onClick={() => goDashboardView('dashboard')}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              <LayoutGrid className="h-5 w-5" />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('progress')}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              <BarChart2 className="h-5 w-5" />
              View Progress
            </button>
            <button
              type="button"
              onClick={() => router.push('/skill')}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              <LayoutGrid className="h-5 w-5" />
              Skill
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('settings')}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('help-support')}
              className="col-span-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              <HelpCircle className="h-5 w-5" />
              Help &amp; Support
            </button>
          </div>
        </aside>
      ) : null}

      <nav
        className={`geuwat-mobile-nav fixed inset-x-0 bottom-0 z-[80] ${
          isNavVisible ? '' : 'is-hidden'
        }`}
        aria-label="Bottom navigation"
        aria-hidden={!isNavVisible}
      >
        <div className="geuwat-mobile-nav-panel relative mx-auto w-full max-w-2xl rounded-t-2xl md:mb-4 md:rounded-2xl">
          <div
            className="geuwat-mobile-nav-scan pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-2xl"
            aria-hidden="true"
          />

          <div className="flex items-end justify-between px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] md:px-8 md:pb-4">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="geuwat-mobile-nav-action group inline-flex w-24 flex-col items-center gap-2"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 transition" />
              <span className="text-[11px] font-semibold tracking-[0.24em]">
                MENU
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTourGuide}
              className={`geuwat-mobile-avatar inline-flex -mt-10 h-[74px] w-[74px] items-center justify-center rounded-full ${
                tourGuideBootstrapped ? 'is-active' : ''
              }`}
              aria-label={tourGuideBootstrapped ? 'Return Tour Guide to bottom navigation' : 'Enable Tour Guide'}
            >
              {!tourGuideBootstrapped ? (
                <Image
                  src="/Kepala.png"
                  alt="Tour Guide"
                  width={56}
                  height={56}
                  className="geuwat-mobile-avatar-image h-14 w-14 object-contain"
                  priority
                />
              ) : (
                <span className="geuwat-mobile-active-dot h-3 w-3 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => goDashboardView('progress')}
              className="geuwat-mobile-nav-action group inline-flex w-24 flex-col items-center gap-2"
              aria-label="View progress"
            >
              <BarChart2 className="h-6 w-6 transition" />
              <span className="text-[11px] font-semibold tracking-[0.18em]">
                PROGRESS
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
