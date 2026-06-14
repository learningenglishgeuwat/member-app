"use client"

import { useCallback, useEffect, useState } from 'react'
import { audioManager } from './audioManager'

export function useAudio() {
  const [isSupported, setIsSupported] = useState<boolean>(typeof window !== 'undefined' && !!(window.AudioContext || (window as any).webkitAudioContext))
  const [isEnabled, setIsEnabled] = useState<boolean>(true)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && !!(window.AudioContext || (window as any).webkitAudioContext))
    setIsEnabled(true)
    // expose for debugging
    try {
      ;(window as any).__audioManager = audioManager
    } catch {}
  }, [])

  const triggerTap = useCallback(() => {
    try {
      // eslint-disable-next-line no-console
      console.debug('useAudio: triggerTap()')
    } catch {}
    audioManager.playTap().catch(() => {})
  }, [])

  const triggerKeypress = useCallback(() => {
    // typing-specific sound
    try {
      // eslint-disable-next-line no-console
      console.debug('useAudio: triggerKeypress()')
    } catch {}
    ;(audioManager as any).playKeypress?.().catch(() => {})
  }, [])

  const triggerLaserClick = useCallback(() => {
    audioManager.playLaserClick().catch(() => {})
  }, [])

  const triggerSuccess = useCallback(() => {
    audioManager.playSuccess().catch(() => {})
  }, [])

  const triggerTriumph = useCallback(() => {
    audioManager.playTriumph().catch(() => {})
  }, [])

  const triggerError = useCallback(() => {
    audioManager.playError().catch(() => {})
  }, [])

  const triggerCyberError = useCallback(() => {
    audioManager.playCyberError().catch(() => {})
  }, [])

  const triggerNeonHover = useCallback(() => {
    audioManager.playNeonHover().catch(() => {})
  }, [])

  const triggerLoading = useCallback(() => {
    audioManager.startLoading().catch(() => {})
  }, [])

  const triggerLoadingStop = useCallback(() => {
    audioManager.stopLoading()
  }, [])

  const enable = useCallback(() => {
    audioManager.enable()
    setIsEnabled(true)
  }, [])

  const disable = useCallback(() => {
    audioManager.disable()
    setIsEnabled(false)
  }, [])

  return {
    isSupported,
    isEnabled,
    triggerTap,
    triggerKeypress,
    triggerLaserClick,
    triggerNeonHover,
    triggerLoading,
    triggerLoadingStop,
    triggerSuccess,
    triggerTriumph,
    triggerError,
    triggerCyberError,
    enable,
    disable,
  }
}

export default useAudio
