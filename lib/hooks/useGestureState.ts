'use client'

import { useEffect, useState, useCallback } from 'react'

interface GestureState {
  enabled: boolean
  showCursor: boolean
  hapticFeedback: boolean
  clickMethod: 'pinch' | 'peace' | 'dwell'
}

export const useGestureState = () => {
  const [state, setState] = useState<GestureState>({
    enabled: false,
    showCursor: false,
    hapticFeedback: true,
    clickMethod: 'dwell',
  })

  const handleToggle = useCallback((event: CustomEvent) => {
    setState((prev) => ({
      ...prev,
      enabled: event.detail.enabled,
    }))
  }, [])

  const handleShowCursor = useCallback((event: CustomEvent) => {
    setState((prev) => ({
      ...prev,
      showCursor: event.detail.show,
    }))
  }, [])

  const handleHapticFeedback = useCallback((event: CustomEvent) => {
    setState((prev) => ({
      ...prev,
      hapticFeedback: event.detail.enabled,
    }))
  }, [])

  const handleClickMethod = useCallback((event: CustomEvent) => {
    setState((prev) => ({
      ...prev,
      clickMethod: event.detail.method,
    }))
  }, [])

  const handleReset = useCallback(() => {
    setState({
      enabled: false,
      showCursor: false,
      hapticFeedback: true,
      clickMethod: 'dwell',
    })
  }, [])

  useEffect(() => {
    window.addEventListener('gesture:toggle', handleToggle as EventListener)
    window.addEventListener('gesture:showCursor', handleShowCursor as EventListener)
    window.addEventListener('gesture:hapticFeedback', handleHapticFeedback as EventListener)
    window.addEventListener('gesture:clickMethod', handleClickMethod as EventListener)
    window.addEventListener('gesture:reset', handleReset as EventListener)

    return () => {
      window.removeEventListener('gesture:toggle', handleToggle as EventListener)
      window.removeEventListener('gesture:showCursor', handleShowCursor as EventListener)
      window.removeEventListener('gesture:hapticFeedback', handleHapticFeedback as EventListener)
      window.removeEventListener('gesture:clickMethod', handleClickMethod as EventListener)
      window.removeEventListener('gesture:reset', handleReset as EventListener)
    }
  }, [handleToggle, handleShowCursor, handleHapticFeedback, handleClickMethod, handleReset])

  return state
}
