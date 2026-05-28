"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function useScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return
      const id = hash.slice(1)
      const el = document.getElementById(id) || document.querySelector<HTMLElement>(`[data-intonation-card-key="${id}"]`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        try { (el as HTMLElement).focus?.() } catch {}
        return true
      }
      return false
    }

    // try immediately, then fallback with a short retry loop
    if (scrollToHash()) return

    let attempts = 0
    const timer = window.setInterval(() => {
      attempts += 1
      if (scrollToHash() || attempts >= 12) {
        window.clearInterval(timer)
      }
    }, 80)

    const onHash = () => { scrollToHash() }
    window.addEventListener('hashchange', onHash)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('hashchange', onHash)
    }
  }, [pathname])
}
