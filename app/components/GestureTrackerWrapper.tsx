'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  useHandGestureTracking,
  type HandGestureEvent,
} from '@/lib/hooks/useHandGestureTracking'

interface GestureTrackerWrapperProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onPinch?: () => void
  onPeaceSign?: () => void
  onThumbsUp?: () => void
  onFistDrag?: (direction: 'up' | 'down') => void
  onCursorMove?: (x: number, y: number) => void
  showToggleButton?: boolean
  children?: React.ReactNode
}

export const GestureTrackerWrapper = ({
  onSwipeLeft,
  onSwipeRight,
  onPinch,
  onPeaceSign,
  onThumbsUp,
  onFistDrag,
  onCursorMove,
  showToggleButton = true,
  children,
}: GestureTrackerWrapperProps) => {
  const [isActive, setIsActive] = useState(false)

  const handleGesture = useCallback(
    (event: HandGestureEvent) => {
      if (event.type === 'swipe-left') onSwipeLeft?.()
      if (event.type === 'swipe-right') onSwipeRight?.()
      if (event.type === 'pinch') onPinch?.()
      if (event.type === 'peace-sign') {
        onPeaceSign?.()
        onThumbsUp?.()
      }
      if (event.type === 'palm-scroll' && typeof event.deltaY === 'number') {
        onFistDrag?.(event.deltaY < 0 ? 'up' : 'down')
      }
      if (event.type === 'fist-zoom' && typeof event.deltaY === 'number') {
        const zoomEvent = new CustomEvent('app:gesture:zoom', { detail: event })
        window.dispatchEvent(zoomEvent)
        document.dispatchEvent(zoomEvent)
      }
    },
    [onFistDrag, onPeaceSign, onPinch, onSwipeLeft, onSwipeRight, onThumbsUp],
  )

  const { error, cursor, videoRef } = useHandGestureTracking({
    enabled: isActive,
    onGesture: handleGesture,
  })

  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      setIsActive(Boolean(event.detail?.enabled))
    }

    window.addEventListener('gesture:toggle', handleToggle as EventListener)

    return () => {
      window.removeEventListener('gesture:toggle', handleToggle as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!isActive || !cursor.visible) return
    onCursorMove?.(cursor.x, cursor.y)
  }, [cursor.visible, cursor.x, cursor.y, isActive, onCursorMove])

  if (!showToggleButton) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {isActive ? (
        <video
          ref={videoRef}
          className="hidden"
          width={1280}
          height={720}
          style={{ display: 'none' }}
          muted
          playsInline
        />
      ) : null}

      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setIsActive((prev) => !prev)}
          className={`rounded-lg px-4 py-2 font-semibold text-white transition-colors ${
            isActive
              ? 'bg-cyan-500 hover:bg-cyan-600'
              : 'bg-slate-400 hover:bg-slate-500'
          }`}
        >
          {isActive ? 'Gesture ON' : 'Gesture OFF'}
        </button>
        {error ? <div className="text-sm text-red-500">{error}</div> : null}
      </div>

      {children}
    </div>
  )
}
