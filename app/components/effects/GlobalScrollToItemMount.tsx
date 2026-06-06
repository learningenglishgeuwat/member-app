"use client"

import { useEffect } from 'react'

export default function GlobalScrollToItemMount() {
  useEffect(() => {
    let timers: number[] = []

    const scrollToKey = (key: string) => {
      if (!key) return false
      const trySelectors = [
        `[data-intonation-card-key="${key}"]`,
        `#${key}`,
        `[data-card-key="${key}"]`,
        `[data-play-item-key="${key}"]`,
        `[data-qa-key="${key}"]`,
      ]

      for (const sel of trySelectors) {
        const el = document.querySelector<HTMLElement>(sel)
        if (el) {
          try { el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }) } catch {}
          try { (el as HTMLElement).focus?.() } catch {}
          return true
        }
      }

      return false
    }

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail
      const key = detail?.key ?? detail
      if (!key) return

      // try immediate
      if (scrollToKey(key)) return

      // retry a few times in case DOM not ready
      let attempts = 0
      const id = window.setInterval(() => {
        attempts += 1
        if (scrollToKey(key) || attempts >= 12) {
          window.clearInterval(id)
        }
      }, 80)
      timers.push(id)
    }

    window.addEventListener('geuwat:scroll-to', handler as EventListener)

    return () => {
      window.removeEventListener('geuwat:scroll-to', handler as EventListener)
      timers.forEach((t) => window.clearInterval(t))
      timers = []
    }
  }, [])

  return null
}
