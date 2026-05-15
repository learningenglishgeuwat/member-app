'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ACTIVE_SKILL_STORAGE_KEY = 'skill_active_selection_v1'
const NAV_ACCENT_STORAGE_KEY = 'geuwat:nav-accent-rgb'

const SKILL_TYPE_BY_PATH_PREFIX: Array<{ prefix: string; skillType: string }> = [
  { prefix: '/skill/pronunciation', skillType: 'P' },
  { prefix: '/skill/vocabulary', skillType: 'V' },
  { prefix: '/skill/grammar', skillType: 'G' },
  { prefix: '/skill/speaking', skillType: 'S' },
]

const DEFAULT_PAGE_BG = '#000000'
const DASHBOARD_PAGE_BG = 'rgb(15 23 42)' // slate-900
const DASHBOARD_PATH = '/dashboard'
const SKILL_MENU_BG = 'rgb(2 6 23)' // slate-950
const SKILL_GAME_LINKS_PATH = '/skill/game-links'

function buildPronunPageBg(glow1: string, glow2: string, base: string) {
  return `radial-gradient(900px 420px at 10% -12%, ${glow1}, transparent 55%), radial-gradient(860px 420px at 92% 112%, ${glow2}, transparent 57%), ${base}`
}

const PRONUN_PAGE_BG_DEFAULT = buildPronunPageBg('rgba(168, 85, 247, 0.26)', 'rgba(217, 70, 239, 0.18)', '#0a0a0a')
const PRONUN_PAGE_BG_ALPHABET = buildPronunPageBg('rgba(59, 130, 246, 0.26)', 'rgba(6, 182, 212, 0.18)', '#050b19')
const PRONUN_PAGE_BG_STRESSING = buildPronunPageBg('rgba(250, 204, 21, 0.26)', 'rgba(249, 115, 22, 0.18)', '#120a06')
const PRONUN_PAGE_BG_INTONATION = buildPronunPageBg('rgba(236, 72, 153, 0.24)', 'rgba(225, 29, 72, 0.18)', '#1a0612')
const PRONUN_PAGE_BG_FINAL_SOUND = buildPronunPageBg('rgba(34, 211, 238, 0.26)', 'rgba(8, 145, 178, 0.18)', '#031116')
const PRONUN_PAGE_BG_AMERICAN_T = buildPronunPageBg('rgba(11, 74, 166, 0.22)', 'rgba(0, 40, 104, 0.2)', '#020b1e')
const PRONUN_PAGE_BG_TEXT = buildPronunPageBg('rgba(52, 211, 153, 0.22)', 'rgba(22, 163, 74, 0.18)', '#04140a')
const PRONUN_PAGE_BG_READING_TEXT = buildPronunPageBg('rgba(129, 140, 248, 0.26)', 'rgba(124, 58, 237, 0.18)', '#080a18')
const PRONUN_PAGE_BG_PORTAL = '#0a0a0a'

function resolvePronunBgFromPathname(pathname: string) {
  if (pathname.startsWith('/skill/pronunciation/phoneticSymbols')) return PRONUN_PAGE_BG_PORTAL
  if (pathname.startsWith('/skill/pronunciation/alphabet')) return PRONUN_PAGE_BG_ALPHABET
  if (pathname.startsWith('/skill/pronunciation/stressing')) return PRONUN_PAGE_BG_STRESSING
  if (pathname.startsWith('/skill/pronunciation/intonation')) return PRONUN_PAGE_BG_INTONATION
  if (pathname.startsWith('/skill/pronunciation/final-sound-new')) return PRONUN_PAGE_BG_FINAL_SOUND
  if (pathname.startsWith('/skill/pronunciation/american-t')) return PRONUN_PAGE_BG_AMERICAN_T
  if (pathname.startsWith('/skill/pronunciation/text')) return PRONUN_PAGE_BG_TEXT
  if (pathname.startsWith('/skill/pronunciation/reading-text')) return PRONUN_PAGE_BG_READING_TEXT
  return PRONUN_PAGE_BG_DEFAULT
}
const VOCAB_PAGE_BG =
  'radial-gradient(circle at 14% 10%, rgba(57, 255, 20, 0.18), transparent 42%), radial-gradient(circle at 84% 8%, rgba(0, 204, 102, 0.16), transparent 40%), radial-gradient(circle at 50% 100%, rgba(24, 95, 53, 0.24), transparent 55%), #06110b'
const GRAMMAR_PAGE_BG =
  'radial-gradient(900px 500px at 10% -20%, rgba(34, 211, 238, 0.12), transparent 60%), radial-gradient(900px 500px at 100% 120%, rgba(16, 185, 129, 0.1), transparent 55%), #020617'
const SPEAKING_PAGE_BG =
  'radial-gradient(circle at 15% 12%, rgba(255, 0, 186, 0.14), transparent 46%), radial-gradient(circle at 88% 8%, rgba(244, 114, 182, 0.12), transparent 42%), #08101f'

const ACCENT_HEX_BY_SKILL_TYPE: Record<string, string> = {
  P: '#bc13fe', // purple
  V: '#39ff14', // green
  G: '#14b8a6', // teal
  S: '#ff00ff', // pink
  default: '#00f3ff', // cyan
}

function hexToRgbTuple(hex: string): string | null {
  const normalized = hex.trim().replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return `${r},${g},${b}`
}

function resolveSkillTypeFromPathname(pathname: string): string | null {
  for (const entry of SKILL_TYPE_BY_PATH_PREFIX) {
    if (pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)) {
      return entry.skillType
    }
  }
  return null
}

function applyNavAccent(rgbTuple: string) {
  try {
    document.documentElement.style.setProperty('--geuwat-nav-accent-rgb', rgbTuple)
  } catch {
    // ignore
  }

  try {
    window.localStorage.setItem(NAV_ACCENT_STORAGE_KEY, rgbTuple)
  } catch {
    // ignore
  }
}

function applyPageSurface(bg: string, fg?: string) {
  try {
    document.documentElement.style.setProperty('--app-page-bg', bg)
    if (fg) document.documentElement.style.setProperty('--app-page-fg', fg)
  } catch {
    // ignore
  }
}

function buildSkillBackground(rgbTuple: string) {
  return `radial-gradient(900px 420px at 10% -12%, rgba(${rgbTuple},0.22), transparent 55%), radial-gradient(860px 420px at 92% 112%, rgba(${rgbTuple},0.14), transparent 57%), ${SKILL_MENU_BG}`
}

export default function SkillThemeSync() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return

    if (pathname === DASHBOARD_PATH || pathname.startsWith(`${DASHBOARD_PATH}/`)) {
      const rgbTuple = hexToRgbTuple(ACCENT_HEX_BY_SKILL_TYPE.default)!
      applyNavAccent(rgbTuple)
      applyPageSurface(DASHBOARD_PAGE_BG)
      return
    }

    if (pathname === SKILL_GAME_LINKS_PATH || pathname === `${SKILL_GAME_LINKS_PATH}/`) {
      const rgbTuple = hexToRgbTuple(ACCENT_HEX_BY_SKILL_TYPE.default)!
      applyNavAccent(rgbTuple)
      applyPageSurface(buildSkillBackground(rgbTuple))
      return
    }

    const skillTypeFromPath = resolveSkillTypeFromPathname(pathname)
    const skillTypeFromStorage = (() => {
      try {
        return window.localStorage.getItem(ACTIVE_SKILL_STORAGE_KEY)
      } catch {
        return null
      }
    })()

    const skillType = skillTypeFromPath ?? skillTypeFromStorage ?? 'default'
    const hex = ACCENT_HEX_BY_SKILL_TYPE[skillType] ?? ACCENT_HEX_BY_SKILL_TYPE.default
    const rgbTuple = hexToRgbTuple(hex) ?? hexToRgbTuple(ACCENT_HEX_BY_SKILL_TYPE.default)!

    applyNavAccent(rgbTuple)

    if (pathname === '/skill' || pathname === '/skill/') {
      applyPageSurface(SKILL_MENU_BG)
      return
    }

    if (pathname === '/skill/pronunciation' || pathname.startsWith('/skill/pronunciation/')) {
      applyPageSurface(resolvePronunBgFromPathname(pathname))
      return
    }

    if (pathname === '/skill/vocabulary' || pathname.startsWith('/skill/vocabulary/')) {
      applyPageSurface(VOCAB_PAGE_BG)
      return
    }

    if (pathname === '/skill/grammar' || pathname.startsWith('/skill/grammar/')) {
      applyPageSurface(GRAMMAR_PAGE_BG)
      return
    }

    if (pathname === '/skill/speaking' || pathname.startsWith('/skill/speaking/')) {
      applyPageSurface(SPEAKING_PAGE_BG)
      return
    }

    if (pathname.startsWith('/skill/')) {
      applyPageSurface(buildSkillBackground(rgbTuple))
      return
    }

    applyPageSurface(DEFAULT_PAGE_BG)
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(NAV_ACCENT_STORAGE_KEY)
      if (stored) {
        document.documentElement.style.setProperty('--geuwat-nav-accent-rgb', stored)
      }
    } catch {
      // ignore
    }
  }, [])

  return null
}
