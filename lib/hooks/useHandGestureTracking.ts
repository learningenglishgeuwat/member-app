'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'

const MEDIAPIPE_VERSION = '0.10.35'
const WASM_ASSET_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const HAND_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

const CURSOR_LERP_ALPHA = 0.26
const CURSOR_SLOW_SPEED_THRESHOLD = 1.3
const SWIPE_SPEED_THRESHOLD = 1.3
const SWIPE_AXIS_DOMINANCE = 1.35
const SWIPE_COOLDOWN_MS = 700
const SWIPE_CURSOR_FREEZE_MS = 320
const PINCH_DISTANCE_THRESHOLD = 0.035
const PINCH_RELEASE_DISTANCE = 0.052
const PINCH_COOLDOWN_MS = 520
const THUMBS_UP_COOLDOWN_MS = 1300
const PINKY_POINT_COOLDOWN_MS = 950
const FIST_SCROLL_GAIN = 2.15
const FIST_SCROLL_MIN_DELTA = 2

export type HandGestureName =
  | 'none'
  | 'cursor'
  | 'swipe-left'
  | 'swipe-right'
  | 'pinch'
  | 'fist-scroll'
  | 'thumbs-up'
  | 'pinky-point'

export type HandGestureStatus = 'idle' | 'loading' | 'camera' | 'running' | 'error'

export type HandGesturePoint = {
  x: number
  y: number
}

export type HandGestureEvent = {
  type: Exclude<HandGestureName, 'none' | 'cursor'>
  point: HandGesturePoint
  velocity?: HandGesturePoint
  speed?: number
  deltaY?: number
  timestamp: number
}

export type HandGestureTrackingState = {
  status: HandGestureStatus
  error: string | null
  cursor: HandGesturePoint & {
    visible: boolean
    frozen: boolean
  }
  activeGesture: HandGestureName
  handPresent: boolean
  landmarks: NormalizedLandmark[] | null
}

export type UseHandGestureTrackingOptions = {
  enabled: boolean
  onGesture?: (event: HandGestureEvent) => void
}

type TimedPoint = HandGesturePoint & {
  time: number
}

const initialCursor = {
  x: 0,
  y: 0,
  visible: false,
  frozen: false,
}

const getViewportSize = () => ({
  width: Math.max(window.innerWidth, 1),
  height: Math.max(window.innerHeight, 1),
})

const lerp = (from: number, to: number, alpha: number) => from + (to - from) * alpha

const distance2d = (a: NormalizedLandmark, b: NormalizedLandmark) =>
  Math.hypot(a.x - b.x, a.y - b.y)

const isFingerFolded = (
  landmarks: NormalizedLandmark[],
  tipIndex: number,
  pipIndex: number,
) => landmarks[tipIndex].y > landmarks[pipIndex].y + 0.015

const isFingerExtended = (
  landmarks: NormalizedLandmark[],
  tipIndex: number,
  pipIndex: number,
) => landmarks[tipIndex].y < landmarks[pipIndex].y - 0.03

const areMainFingersFolded = (landmarks: NormalizedLandmark[]) =>
  isFingerFolded(landmarks, 8, 6) &&
  isFingerFolded(landmarks, 12, 10) &&
  isFingerFolded(landmarks, 16, 14) &&
  isFingerFolded(landmarks, 20, 18)

const areIndexMiddleRingFolded = (landmarks: NormalizedLandmark[]) =>
  isFingerFolded(landmarks, 8, 6) &&
  isFingerFolded(landmarks, 12, 10) &&
  isFingerFolded(landmarks, 16, 14)

const isThumbsUpPose = (landmarks: NormalizedLandmark[]) => {
  if (!areMainFingersFolded(landmarks)) return false

  const thumbTip = landmarks[4]
  const thumbIp = landmarks[3]
  const thumbMcp = landmarks[2]
  const highestOtherPoint = landmarks.reduce((minY, point, index) => {
    if (index === 4) return minY
    return Math.min(minY, point.y)
  }, 1)

  return (
    thumbTip.y < thumbIp.y - 0.006 &&
    thumbIp.y <= thumbMcp.y + 0.035 &&
    thumbTip.y < highestOtherPoint + 0.02
  )
}

const isPinkyPointPose = (landmarks: NormalizedLandmark[]) => {
  if (!areIndexMiddleRingFolded(landmarks)) return false

  const pinkyTip = landmarks[20]
  const pinkyMcp = landmarks[17]
  const thumbTip = landmarks[4]
  const thumbIp = landmarks[3]

  return (
    isFingerExtended(landmarks, 20, 18) &&
    pinkyTip.y < pinkyMcp.y - 0.04 &&
    thumbTip.y >= thumbIp.y - 0.035
  )
}

const getPalmY = (landmarks: NormalizedLandmark[]) =>
  (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5

const getIndexPoint = (landmarks: NormalizedLandmark[]): HandGesturePoint => ({
  x: 1 - landmarks[8].x,
  y: landmarks[8].y,
})

const normalizedToViewport = (point: HandGesturePoint): HandGesturePoint => {
  const { width, height } = getViewportSize()
  return {
    x: Math.min(Math.max(point.x * width, 0), width),
    y: Math.min(Math.max(point.y * height, 0), height),
  }
}

export function useHandGestureTracking({
  enabled,
  onGesture,
}: UseHandGestureTrackingOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const landmarkerRef = useRef<HandLandmarker | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const previousIndexRef = useRef<TimedPoint | null>(null)
  const previousCursorRef = useRef<HandGesturePoint | null>(null)
  const previousFistYRef = useRef<number | null>(null)
  const lastVideoTimeRef = useRef(-1)
  const lastSwipeAtRef = useRef(0)
  const cursorFreezeUntilRef = useRef(0)
  const pinchDownRef = useRef(false)
  const lastPinchAtRef = useRef(0)
  const thumbsUpDownRef = useRef(false)
  const lastThumbsUpAtRef = useRef(0)
  const pinkyPointDownRef = useRef(false)
  const lastPinkyPointAtRef = useRef(0)
  const activeGestureRef = useRef<HandGestureName>('none')
  const onGestureRef = useRef(onGesture)

  const [state, setState] = useState<HandGestureTrackingState>({
    status: 'idle',
    error: null,
    cursor: initialCursor,
    activeGesture: 'none',
    handPresent: false,
    landmarks: null,
  })

  useEffect(() => {
    onGestureRef.current = onGesture
  }, [onGesture])

  const emitGesture = useCallback((event: HandGestureEvent) => {
    onGestureRef.current?.(event)
  }, [])

  const updateActiveGesture = useCallback((activeGesture: HandGestureName) => {
    if (activeGestureRef.current === activeGesture) return
    activeGestureRef.current = activeGesture
    setState((prev) => ({ ...prev, activeGesture }))
  }, [])

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }

    landmarkerRef.current?.close()
    landmarkerRef.current = null
    previousIndexRef.current = null
    previousCursorRef.current = null
    previousFistYRef.current = null
    pinchDownRef.current = false
    thumbsUpDownRef.current = false
    pinkyPointDownRef.current = false
    activeGestureRef.current = 'none'
    lastVideoTimeRef.current = -1
  }, [])

  useEffect(() => {
    if (!enabled) {
      stopCamera()
      setState({
        status: 'idle',
        error: null,
        cursor: initialCursor,
        activeGesture: 'none',
        handPresent: false,
        landmarks: null,
      })
      return
    }

    let cancelled = false

    const processLandmarks = (landmarks: NormalizedLandmark[], timestamp: number) => {
      const indexPoint = getIndexPoint(landmarks)
      const viewportPoint = normalizedToViewport(indexPoint)
      const previousIndex = previousIndexRef.current
      const deltaSeconds =
        previousIndex && timestamp > previousIndex.time
          ? Math.max((timestamp - previousIndex.time) / 1000, 0.001)
          : 0
      const velocity = previousIndex
        ? {
            x: (indexPoint.x - previousIndex.x) / deltaSeconds,
            y: (indexPoint.y - previousIndex.y) / deltaSeconds,
          }
        : { x: 0, y: 0 }
      const speed = Math.hypot(velocity.x, velocity.y)
      const isCursorFrozen = timestamp < cursorFreezeUntilRef.current

      previousIndexRef.current = { ...indexPoint, time: timestamp }

      if (!isCursorFrozen) {
        const previousCursor = previousCursorRef.current
        const alpha = speed <= CURSOR_SLOW_SPEED_THRESHOLD ? CURSOR_LERP_ALPHA : CURSOR_LERP_ALPHA * 0.55
        const nextCursor = previousCursor
          ? {
              x: lerp(previousCursor.x, viewportPoint.x, alpha),
              y: lerp(previousCursor.y, viewportPoint.y, alpha),
            }
          : viewportPoint

        previousCursorRef.current = nextCursor
        setState((prev) => ({
          ...prev,
          cursor: {
            ...nextCursor,
            visible: true,
            frozen: false,
          },
          handPresent: true,
          landmarks,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          cursor: {
            ...prev.cursor,
            visible: true,
            frozen: true,
          },
          handPresent: true,
          landmarks,
        }))
      }

      const currentCursor = previousCursorRef.current ?? viewportPoint
      const commonEvent = {
        point: currentCursor,
        velocity,
        speed,
        timestamp,
      }

      const thumbsUpPose = isThumbsUpPose(landmarks)
      if (thumbsUpPose) {
        previousFistYRef.current = null
        updateActiveGesture('thumbs-up')

        if (!thumbsUpDownRef.current && timestamp - lastThumbsUpAtRef.current > THUMBS_UP_COOLDOWN_MS) {
          thumbsUpDownRef.current = true
          lastThumbsUpAtRef.current = timestamp
          emitGesture({ ...commonEvent, type: 'thumbs-up' })
        }
        return
      }
      thumbsUpDownRef.current = false

      const pinkyPointPose = isPinkyPointPose(landmarks)
      if (pinkyPointPose) {
        previousFistYRef.current = null
        pinchDownRef.current = false
        updateActiveGesture('pinky-point')

        if (!pinkyPointDownRef.current && timestamp - lastPinkyPointAtRef.current > PINKY_POINT_COOLDOWN_MS) {
          pinkyPointDownRef.current = true
          lastPinkyPointAtRef.current = timestamp
          emitGesture({ ...commonEvent, type: 'pinky-point' })
        }
        return
      }
      pinkyPointDownRef.current = false

      const fistPose = areMainFingersFolded(landmarks)
      if (fistPose) {
        updateActiveGesture('fist-scroll')
        const palmY = getPalmY(landmarks)
        const previousFistY = previousFistYRef.current

        if (previousFistY !== null) {
          const deltaY = (palmY - previousFistY) * getViewportSize().height * FIST_SCROLL_GAIN
          if (Math.abs(deltaY) >= FIST_SCROLL_MIN_DELTA) {
            emitGesture({ ...commonEvent, type: 'fist-scroll', deltaY })
          }
        }

        previousFistYRef.current = palmY
        pinchDownRef.current = false
        return
      }
      previousFistYRef.current = null

      const canSwipe =
        timestamp - lastSwipeAtRef.current > SWIPE_COOLDOWN_MS &&
        Math.abs(velocity.x) > SWIPE_SPEED_THRESHOLD &&
        Math.abs(velocity.x) > Math.abs(velocity.y) * SWIPE_AXIS_DOMINANCE

      if (canSwipe) {
        const type = velocity.x > 0 ? 'swipe-right' : 'swipe-left'
        lastSwipeAtRef.current = timestamp
        cursorFreezeUntilRef.current = timestamp + SWIPE_CURSOR_FREEZE_MS
        updateActiveGesture(type)
        emitGesture({ ...commonEvent, type })
        return
      }

      const pinchDistance = distance2d(landmarks[4], landmarks[8])
      const isPinching = pinchDistance < PINCH_DISTANCE_THRESHOLD
      if (isPinching) {
        updateActiveGesture('pinch')

        if (!pinchDownRef.current && timestamp - lastPinchAtRef.current > PINCH_COOLDOWN_MS) {
          pinchDownRef.current = true
          lastPinchAtRef.current = timestamp
          emitGesture({ ...commonEvent, type: 'pinch' })
        }
        return
      }

      if (pinchDistance > PINCH_RELEASE_DISTANCE) {
        pinchDownRef.current = false
      }

      updateActiveGesture('cursor')
    }

    const processFrame = () => {
      if (cancelled) return

      const video = videoRef.current
      const landmarker = landmarkerRef.current

      if (!video || !landmarker || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        rafRef.current = window.requestAnimationFrame(processFrame)
        return
      }

      const timestamp = performance.now()

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        const result = landmarker.detectForVideo(video, timestamp)
        const landmarks = result.landmarks[0]

        if (landmarks?.length) {
          processLandmarks(landmarks, timestamp)
        } else {
          previousIndexRef.current = null
          previousFistYRef.current = null
          pinchDownRef.current = false
          thumbsUpDownRef.current = false
          pinkyPointDownRef.current = false
          updateActiveGesture('none')
          setState((prev) => ({
            ...prev,
            cursor: {
              ...prev.cursor,
              visible: false,
              frozen: false,
            },
            handPresent: false,
            landmarks: null,
          }))
        }
      }

      rafRef.current = window.requestAnimationFrame(processFrame)
    }

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Browser tidak mendukung akses kamera.')
        }

        setState((prev) => ({
          ...prev,
          status: 'loading',
          error: null,
        }))

        const [{ FilesetResolver, HandLandmarker }, stream] = await Promise.all([
          import('@mediapipe/tasks-vision'),
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
          }),
        ])

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        setState((prev) => ({ ...prev, status: 'camera' }))

        const video = videoRef.current
        if (!video) {
          throw new Error('Elemen video kamera belum tersedia.')
        }

        video.srcObject = stream
        await video.play()

        const vision = await FilesetResolver.forVisionTasks(WASM_ASSET_URL)
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_LANDMARKER_MODEL_URL,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.62,
          minHandPresenceConfidence: 0.58,
          minTrackingConfidence: 0.58,
        })

        if (cancelled) {
          landmarker.close()
          return
        }

        landmarkerRef.current = landmarker
        setState((prev) => ({ ...prev, status: 'running' }))
        rafRef.current = window.requestAnimationFrame(processFrame)
      } catch (error) {
        if (cancelled) return

        const message =
          error instanceof Error
            ? error.message
            : 'Gagal mengaktifkan hand gesture.'

        stopCamera()
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: message,
          cursor: initialCursor,
          handPresent: false,
          activeGesture: 'none',
          landmarks: null,
        }))
      }
    }

    void start()

    return () => {
      cancelled = true
      stopCamera()
    }
  }, [enabled, emitGesture, stopCamera, updateActiveGesture])

  return {
    ...state,
    videoRef,
  }
}
