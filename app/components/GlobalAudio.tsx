'use client'

import React, { useEffect } from 'react'
import useAudio from '@/lib/audio/useAudio'

export default function GlobalAudio({ children }: { children?: React.ReactNode }) {
  const { triggerTap, triggerKeypress, triggerLaserClick, triggerSuccess, triggerError, triggerCyberError } = useAudio()

  useEffect(() => {
    let touchStartX: number | null = null
    let touchStartY: number | null = null

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const isClickable = target.closest('button, a, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer')
      if (isClickable) triggerTap()
    }

    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      touchStartX = t.clientX
      touchStartY = t.clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      if (!t || touchStartX === null || touchStartY === null) {
        touchStartX = null
        touchStartY = null
        return
      }
      const dx = Math.abs(t.clientX - touchStartX)
      const dy = Math.abs(t.clientY - touchStartY)
      touchStartX = null
      touchStartY = null

      // Treat as tap if movement is small
      const THRESHOLD = 16
      if (dx <= THRESHOLD && dy <= THRESHOLD) {
        const el = document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null
        if (!el) return
        const isClickable = el.closest('button, a, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer')
        if (isClickable) triggerTap()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // For text inputs or contenteditable elements, trigger keypress for non-navigation keys
      const focused = document.activeElement as HTMLElement | null
      const targetEl = target as HTMLElement | null
      const targetEditable = targetEl && (targetEl.closest('input, textarea, [contenteditable], [role="textbox"]') !== null || targetEl.isContentEditable)
      const isTextInput = Boolean(
        (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA' || focused.isContentEditable)) ||
        targetEditable
      )
      if (isTextInput) {
        const ignoredKeys = ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape']
        if (!ignoredKeys.includes(e.key)) {
          // debug log to verify path
          try {
            // eslint-disable-next-line no-console
            console.debug('GlobalAudio: keypress detected, calling triggerKeypress', e.key, focused?.tagName, focused?.isContentEditable)
            triggerKeypress()
          } catch {
            triggerTap()
          }
        }
        return
      }

      // For general keyboard activation: trigger on Enter/Space/Arrow keys when
      // the focused element is not a native interactive control (to avoid duplicates)
      const key = e.key
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        const interactive = target.closest('button, a, [role="button"], input, select, textarea, .cursor-pointer')
        if (!interactive) {
          triggerTap()
        }
        return
      }

      // Trigger tap feedback for Arrow navigation keys when focus is not on input-like elements
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        const interactive = target.closest('input, textarea')
        if (!interactive) {
          triggerTap()
        }
      }
    }

    const handleCustom = (ev: Event) => {
      const name = (ev as CustomEvent).type
      if (name === 'app:audio:success') triggerSuccess()
      if (name === 'app:audio:error') triggerCyberError()
      if (name === 'app:audio:laser') triggerLaserClick()
    }

    // pointerenter for hover sounds disabled
    // const hoverTimestamps = new WeakMap<HTMLElement, number>()
    // const HOVER_THROTTLE_MS = 120
    // const handlePointerEnter = (e: PointerEvent) => {
    //   const target = e.target as HTMLElement | null
    //   if (!target) return
    //   const el = target.closest('button, a, [role="button"], .cursor-pointer') as HTMLElement | null
    //   if (!el) return
    //   const last = hoverTimestamps.get(el) || 0
    //   const now = Date.now()
    //   if (now - last < HOVER_THROTTLE_MS) return
    //   hoverTimestamps.set(el, now)
    //   triggerNeonHover()
    // }

    document.addEventListener('click', handleClick, { capture: true, passive: true })
    document.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true })
    document.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true })
    document.addEventListener('keydown', handleKeyDown, { capture: true })
    document.addEventListener('app:audio:success', handleCustom as EventListener)
    document.addEventListener('app:audio:error', handleCustom as EventListener)
    document.addEventListener('app:audio:laser', handleCustom as EventListener)

    return () => {
      document.removeEventListener('click', handleClick, { capture: true } as EventListenerOptions)
      document.removeEventListener('keydown', handleKeyDown, { capture: true } as EventListenerOptions)
      document.removeEventListener('app:audio:success', handleCustom as EventListener)
      document.removeEventListener('app:audio:error', handleCustom as EventListener)
      document.removeEventListener('app:audio:laser', handleCustom as EventListener)
    }
  }, [triggerTap, triggerKeypress, triggerLaserClick, triggerSuccess, triggerError, triggerCyberError])

  return <>{children}</>
}
