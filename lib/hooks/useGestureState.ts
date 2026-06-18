'use client'

import { useEffect, useState, useCallback } from 'react'

interface GestureState {
  enabled: boolean
  showCursor: boolean
  hapticFeedback: boolean
}

export const useGestureState = () => {
  const [state, setState] = useState<GestureState>({
    enabled: false,
    showCursor: false,
    hapticFeedback: true,
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

  const handleReset = useCallback(() => {
    setState({
      enabled: false,
      showCursor: false,
      hapticFeedback: true,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('gesture:toggle', handleToggle as EventListener)
    window.addEventListener('gesture:showCursor', handleShowCursor as EventListener)
    window.addEventListener('gesture:hapticFeedback', handleHapticFeedback as EventListener)
    window.addEventListener('gesture:reset', handleReset as EventListener)

    return () => {
      window.removeEventListener('gesture:toggle', handleToggle as EventListener)
      window.removeEventListener('gesture:showCursor', handleShowCursor as EventListener)
      window.removeEventListener('gesture:hapticFeedback', handleHapticFeedback as EventListener)
      window.removeEventListener('gesture:reset', handleReset as EventListener)
    }
  }, [handleToggle, handleShowCursor, handleHapticFeedback, handleReset])

  return state
}
