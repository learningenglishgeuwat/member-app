'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface MediaPipeContextType {
  mediaPipe: any
  isLoading: boolean
  error: string | null
}

const MediaPipeContext = createContext<MediaPipeContextType | undefined>(undefined)

export const useMediaPipe = () => {
  const context = useContext(MediaPipeContext)
  if (!context) {
    throw new Error('useMediaPipe must be used within MediaPipeProvider')
  }
  return context
}

interface MediaPipeProviderProps {
  children: React.ReactNode
}

export const MediaPipeProvider = ({ children }: MediaPipeProviderProps) => {
  const [mediaPipe, setMediaPipe] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMediaPipe = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load MediaPipe from CDN
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
        script.crossOrigin = 'anonymous'
        script.onload = async () => {
          // Wait for window.Hands to be available
          if ((window as any).Hands) {
            setMediaPipe((window as any).Hands)
            setIsLoading(false)
          } else {
            setError('Failed to load MediaPipe Hands')
            setIsLoading(false)
          }
        }
        script.onerror = () => {
          setError('Failed to load MediaPipe Hands from CDN')
          setIsLoading(false)
        }
        document.head.appendChild(script)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error loading MediaPipe')
        setIsLoading(false)
      }
    }

    loadMediaPipe()
  }, [])

  return (
    <MediaPipeContext.Provider value={{ mediaPipe, isLoading, error }}>
      {children}
    </MediaPipeContext.Provider>
  )
}
