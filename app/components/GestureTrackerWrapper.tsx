'use client'

import React, { useRef, useEffect } from 'react'
import { useHandGestureTracking } from '@/lib/hooks/useHandGestureTracking'

interface GestureTrackerWrapperProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onPinch?: () => void
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
  onThumbsUp,
  onFistDrag,
  onCursorMove,
  showToggleButton = true,
  children,
}: GestureTrackerWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { isActive, setIsActive, startTracking, stopTracking, error } = useHandGestureTracking({
    onSwipeLeft,
    onSwipeRight,
    onPinch,
    onThumbsUp,
    onFistDrag,
    onCursorMove,
  })

  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      if (event.detail.enabled) {
        startTracking()
      } else {
        stopTracking()
      }
    }

    window.addEventListener('gesture:toggle', handleToggle as EventListener)

    return () => {
      window.removeEventListener('gesture:toggle', handleToggle as EventListener)
    }
  }, [startTracking, stopTracking])

  const toggleTracking = async () => {
    if (isActive) {
      stopTracking()
    } else {
      await startTracking()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden video element for gesture capture */}
      <video
        ref={videoRef}
        className="hidden"
        width={1280}
        height={720}
        style={{ display: 'none' }}
      />

      {/* Status indicator */}
      {showToggleButton && (
        <div className="fixed bottom-4 right-4 flex flex-col items-end gap-2 z-40">
          <button
            onClick={toggleTracking}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
              isActive
                ? 'bg-cyan-500 hover:bg-cyan-600'
                : 'bg-slate-400 hover:bg-slate-500'
            }`}
          >
            {isActive ? 'Gesture ON' : 'Gesture OFF'}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      )}

      {children}
    </div>
  )
}
