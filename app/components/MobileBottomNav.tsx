'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Menu, X, BarChart2, LayoutGrid, Settings, HelpCircle } from 'lucide-react'

const TOURGUIDE_COLLAPSED_STORAGE_KEY = 'tourguide_collapsed'
const TOURGUIDE_BOOTSTRAP_EVENT = 'geuwat:tourguide-bootstrap'
const DASHBOARD_VIEW_STORAGE_KEY = 'dashboardCurrentView'

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])

function safeSetLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

function safeGetLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function dispatchBootstrapTourGuide() {
  try {
    window.dispatchEvent(new Event(TOURGUIDE_BOOTSTRAP_EVENT))
  } catch {
    // ignore
  }
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tourGuideBootstrapped, setTourGuideBootstrapped] = useState(false)

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

  if (!shouldRender) return null

  return (
    <>
      <div className="md:hidden h-28" aria-hidden="true" />

      {menuOpen ? (
        <div
          className="md:hidden fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {menuOpen ? (
        <aside
          className="md:hidden fixed inset-x-0 bottom-0 z-[95] rounded-t-2xl border-t border-white/10 bg-slate-950/95 backdrop-blur-xl"
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

      <nav className="md:hidden fixed inset-x-0 bottom-0 z-[80]" aria-label="Bottom navigation">
        <div className="relative w-full rounded-t-2xl border-t border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-slate-900/30 via-slate-950/95 to-black/95 backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-0 rounded-t-2xl shadow-[0_0_32px_rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.14)]"
            aria-hidden="true"
          />

          <div className="flex items-end justify-between px-6 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="group inline-flex w-24 flex-col items-center gap-2 text-slate-200 transition hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.75)] transition group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.95)]" />
              <span
                className="text-[11px] font-semibold tracking-[0.24em] text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.70)] group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.92)]"
              >
                MENU
              </span>
            </button>

            <button
              type="button"
              onClick={tourGuideBootstrapped ? undefined : enableTourGuide}
              disabled={tourGuideBootstrapped}
              className="inline-flex -mt-10 h-[74px] w-[74px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.10)] bg-slate-950/70 shadow-[0_0_0_8px_rgba(255,255,255,0.04),0_0_34px_rgba(0,0,0,0.55)] backdrop-blur-md transition hover:shadow-[0_0_0_10px_rgba(255,255,255,0.06),0_0_40px_rgba(0,0,0,0.62)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,255,255,0.35)] disabled:opacity-90"
              aria-label={tourGuideBootstrapped ? 'Tour Guide enabled' : 'Enable Tour Guide'}
            >
              {!tourGuideBootstrapped ? (
                <Image
                  src="/Kepala.png"
                  alt="Tour Guide"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover opacity-90 grayscale saturate-50 brightness-95"
                  priority
                />
              ) : (
                <span
                  className="h-3 w-3 rounded-full bg-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.85)] shadow-[0_0_18px_rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.55)]"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => goDashboardView('progress')}
              className="group inline-flex w-24 flex-col items-center gap-2 text-slate-200 transition hover:text-white"
              aria-label="View progress"
            >
              <BarChart2
                className="h-6 w-6 text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.75)] transition group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.95)]"
              />
              <span
                className="text-[11px] font-semibold tracking-[0.18em] text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.70)] group-hover:text-[rgba(var(--geuwat-nav-accent-rgb,34,211,238),0.92)]"
              >
                PROGRESS
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
