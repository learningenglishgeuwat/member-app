'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface GestureEvent {
  type: 'swipe_left' | 'swipe_right' | 'pinch' | 'thumbs_up' | 'fist_drag' | 'cursor_move'
  timestamp: number
  data?: any
}

interface GestureCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onPinch?: () => void
  onThumbsUp?: () => void
  onFistDrag?: (direction: 'up' | 'down') => void
  onCursorMove?: (x: number, y: number) => void
  onGestureDetected?: (event: GestureEvent) => void
}

interface CooldownTracker {
  [key: string]: number
}

const GESTURE_COOLDOWNS = {
  swipe: 950,
  pinch: 500,
  thumbs_up: 1000,
}

export const useHandGestureTracking = (callbacks: GestureCallbacks = {}) => {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const handsRef = useRef<any>(null)
  const cooldownRef = useRef<CooldownTracker>({})
  const previousPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const animationFrameRef = useRef<number | null>(null)

  // Initialize MediaPipe Hands
  const initializeHands = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Wait for MediaPipe to be loaded via CDN
      let attempts = 0
      while (!(window as any).Hands && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        attempts++
      }

      if (!(window as any).Hands) {
        throw new Error('MediaPipe Hands not available')
      }

      const Hands = (window as any).Hands
      const hands = new Hands.Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        },
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      const onResults = (results: any) => {
        processHands(results)
      }

      hands.onResults(onResults)
      handsRef.current = hands
      setIsLoading(false)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize hand tracking'
      setError(errorMsg)
      setIsLoading(false)
    }
  }, [])

  // Process hand landmarks and detect gestures
  const processHands = useCallback(
    (results: any) => {
      if (!results.landmarks || results.landmarks.length === 0) {
        return
      }

      const landmarks = results.landmarks[0]

      // Cursor movement - index finger tip (landmark 8)
      const indexFinger = landmarks[8]
      const cursorX = indexFinger.x * (window.innerWidth / 1)
      const cursorY = indexFinger.y * (window.innerHeight / 1)

      const distance = Math.sqrt(
        Math.pow(cursorX - previousPositionRef.current.x, 2) +
          Math.pow(cursorY - previousPositionRef.current.y, 2),
      )

      // Slow movement = cursor tracking
      if (distance > 1 && distance < 10) {
        callbacks.onCursorMove?.(cursorX, cursorY)
      }

      previousPositionRef.current = { x: cursorX, y: cursorY }

      // Detect swipe (fast horizontal movement of index finger)
      detectSwipe(landmarks)

      // Detect pinch (thumb and index finger close together)
      detectPinch(landmarks)

      // Detect thumbs up
      detectThumbsUp(landmarks)

      // Detect fist drag
      detectFistDrag(landmarks)
    },
    [callbacks],
  )

  const detectSwipe = useCallback((landmarks: any[]) => {
    const now = Date.now()
    const lastSwipe = cooldownRef.current['swipe'] || 0

    if (now - lastSwipe < GESTURE_COOLDOWNS.swipe) return

    const indexFinger = landmarks[8]
    const wrist = landmarks[0]

    const velocity = Math.abs(indexFinger.x - wrist.x)

    if (velocity > 1.3) {
      if (indexFinger.x < wrist.x) {
        // Swipe left
        callbacks.onSwipeLeft?.()
        callbacks.onGestureDetected?.({
          type: 'swipe_left',
          timestamp: now,
        })
      } else {
        // Swipe right
        callbacks.onSwipeRight?.()
        callbacks.onGestureDetected?.({
          type: 'swipe_right',
          timestamp: now,
        })
      }

      cooldownRef.current['swipe'] = now
    }
  }, [callbacks])

  const detectPinch = useCallback((landmarks: any[]) => {
    const now = Date.now()
    const lastPinch = cooldownRef.current['pinch'] || 0

    if (now - lastPinch < GESTURE_COOLDOWNS.pinch) return

    const thumb = landmarks[4]
    const indexFinger = landmarks[8]

    const distance = Math.sqrt(
      Math.pow(thumb.x - indexFinger.x, 2) + Math.pow(thumb.y - indexFinger.y, 2),
    )

    if (distance < 0.035) {
      callbacks.onPinch?.()
      callbacks.onGestureDetected?.({
        type: 'pinch',
        timestamp: now,
      })
      cooldownRef.current['pinch'] = now
    }
  }, [callbacks])

  const detectThumbsUp = useCallback((landmarks: any[]) => {
    const now = Date.now()
    const lastThumbsUp = cooldownRef.current['thumbs_up'] || 0

    if (now - lastThumbsUp < GESTURE_COOLDOWNS.thumbs_up) return

    const thumb = landmarks[4]
    const otherFingers = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]

    const thumbAboveOthers = otherFingers.every((finger) => thumb.y < finger.y)

    if (thumbAboveOthers) {
      callbacks.onThumbsUp?.()
      callbacks.onGestureDetected?.({
        type: 'thumbs_up',
        timestamp: now,
      })
      cooldownRef.current['thumbs_up'] = now
    }
  }, [callbacks])

  const detectFistDrag = useCallback((landmarks: any[]) => {
    // Check if all fingers are curled (rough approximation)
    const fingers = [
      { tip: landmarks[8], pip: landmarks[6] }, // index
      { tip: landmarks[12], pip: landmarks[10] }, // middle
      { tip: landmarks[16], pip: landmarks[14] }, // ring
      { tip: landmarks[20], pip: landmarks[18] }, // pinky
    ]

    const allCurled = fingers.every((f) => f.tip.y > f.pip.y)

    if (allCurled) {
      const palm = landmarks[0]
      const previousY = previousPositionRef.current.y

      if (palm.y > previousY + 0.02) {
        callbacks.onFistDrag?.('down')
        callbacks.onGestureDetected?.({
          type: 'fist_drag',
          timestamp: Date.now(),
          data: { direction: 'down' },
        })
      } else if (palm.y < previousY - 0.02) {
        callbacks.onFistDrag?.('up')
        callbacks.onGestureDetected?.({
          type: 'fist_drag',
          timestamp: Date.now(),
          data: { direction: 'up' },
        })
      }
    }
  }, [callbacks])

  // Start tracking
  const startTracking = useCallback(async () => {
    if (!handsRef.current) {
      await initializeHands()
    }

    try {
      const video = videoRef.current
      if (!video) return

      setIsActive(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      })

      video.srcObject = stream
      video.play()

      const processFrame = async () => {
        if (!handsRef.current || !isActive) return

        try {
          await handsRef.current.send({ image: video })
          animationFrameRef.current = requestAnimationFrame(processFrame)
        } catch (err) {
          console.error('Error processing frame:', err)
        }
      }

      video.onloadedmetadata = () => {
        processFrame()
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to access camera for gesture tracking'
      setError(errorMsg)
      setIsActive(false)
    }
  }, [initializeHands, isActive])

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsActive(false)

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stopTracking])

  return {
    isActive,
    setIsActive,
    isLoading,
    error,
    videoRef,
    canvasRef,
    startTracking,
    stopTracking,
    toggleTracking: () => {
      if (isActive) {
        stopTracking()
      } else {
        startTracking()
      }
    },
  }
}
