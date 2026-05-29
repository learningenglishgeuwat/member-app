'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Menu, X, BarChart2, LayoutGrid, Settings, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/contexts/MemberAuthContext'
import {
  DASHBOARD_VIEW_STORAGE_KEY,
  NOTIFICATIONS_VIEW_ID,
  START_JOURNEY_VIEW_ID,
  type ViewId,
} from '@/app/dashboard/dashboardView'
import './MobileBottomNav.css'

const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'
const TOURGUIDE_BOOTSTRAP_EVENT = 'geuwat:tourguide-bootstrap'
const TOURGUIDE_RESET_EVENT = 'geuwat:tourguide-reset'

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
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tourGuideBootstrapped, setTourGuideBootstrapped] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)

  const isPronunciationPage = useMemo(() => {
    if (!pathname) return false
    return pathname.replace(/\/$/, '') === '/skill/pronunciation'
  }, [pathname])

  const shouldRender = useMemo(() => {
    if (!pathname) return false
    if (PUBLIC_PATHS.has(pathname)) return false
    if (pathname === '/dashboard') return false
    // Hide only on Skill menu page, but show on skill modules.
    if (pathname === '/skill' || pathname === '/skill/') return false
    return true
  }, [pathname])

  const goDashboardView = (viewId: ViewId) => {
    const nextView = viewId === START_JOURNEY_VIEW_ID && user?.status !== 'active'
      ? NOTIFICATIONS_VIEW_ID
      : viewId
    safeSetLocalStorage(DASHBOARD_VIEW_STORAGE_KEY, nextView)
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

      {/* Toggle Button */}
      <button
        type="button"
        onClick={toggleNavVisibility}
        className={`fixed left-1/2 z-[90] -translate-x-1/2 bg-[#101314] border border-b-0 border-white/10 p-1.5 rounded-t-md text-cyan-400 hover:text-cyan-300 transition-all duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] group ${
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

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {menuOpen ? (
        <aside
          className="fixed inset-x-0 bottom-0 z-[95] rounded-t-2xl border-t border-white/10 bg-black/95 backdrop-blur-xl transition-all duration-300 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
          role="dialog"
          aria-label="Menu"
        >
          <div className={`flex items-center justify-between ${isPronunciationPage ? 'px-4 py-2.5' : 'px-5 py-4'}`}>
            <div className={`font-semibold text-white ${isPronunciationPage ? 'text-xs' : 'text-sm'}`}>Menu</div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={`inline-flex items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white ${
                isPronunciationPage ? 'h-8 w-8' : 'h-10 w-10'
              }`}
              aria-label="Close menu"
            >
              <X className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
            </button>
          </div>

          <div className={`grid grid-cols-2 ${isPronunciationPage ? 'gap-2 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]' : 'gap-3 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+18px)]'}`}>
            <button
              type="button"
              onClick={() => goDashboardView('dashboard')}
              className={`flex items-center text-left text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${
                isPronunciationPage
                  ? 'gap-2 rounded-lg px-3 py-2 text-xs font-medium'
                  : 'gap-3 rounded-xl px-4 py-3 text-sm'
              }`}
            >
              <LayoutGrid className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('progress')}
              className={`flex items-center text-left text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${
                isPronunciationPage
                  ? 'gap-2 rounded-lg px-3 py-2 text-xs font-medium'
                  : 'gap-3 rounded-xl px-4 py-3 text-sm'
              }`}
            >
              <BarChart2 className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
              View Progress
            </button>
            <button
              type="button"
              onClick={() => router.push('/skill')}
              className={`flex items-center text-left text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${
                isPronunciationPage
                  ? 'gap-2 rounded-lg px-3 py-2 text-xs font-medium'
                  : 'gap-3 rounded-xl px-4 py-3 text-sm'
              }`}
            >
              <LayoutGrid className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
              Skill
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('settings')}
              className={`flex items-center text-left text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${
                isPronunciationPage
                  ? 'gap-2 rounded-lg px-3 py-2 text-xs font-medium'
                  : 'gap-3 rounded-xl px-4 py-3 text-sm'
              }`}
            >
              <Settings className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
              Settings
            </button>
            <button
              type="button"
              onClick={() => goDashboardView('help-support')}
              className={`col-span-2 flex items-center text-left text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${
                isPronunciationPage
                  ? 'gap-2 rounded-lg px-3 py-2 text-xs font-medium'
                  : 'gap-3 rounded-xl px-4 py-3 text-sm'
              }`}
            >
              <HelpCircle className={isPronunciationPage ? 'h-4 w-4' : 'h-5 w-5'} />
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
                  src="/Kepala.png?v=20260528"
                  alt="Tour Guide"
                  width={56}
                  height={56}
                  className="geuwat-mobile-avatar-image h-14 w-14 object-contain"
                  priority
                  unoptimized
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
