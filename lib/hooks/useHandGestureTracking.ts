'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision'

const MEDIAPIPE_VERSION = '0.10.35'
const WASM_ASSET_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`
const HAND_LANDMARKER_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

const CURSOR_BASE_ALPHA = 0.15
const CURSOR_SPEED_MULTIPLIER = 0.12
const CURSOR_MAX_ALPHA = 0.55
const SWIPE_SPEED_THRESHOLD = 0.75
const SWIPE_AXIS_DOMINANCE = 1.2
const SWIPE_COOLDOWN_MS = 700
const SWIPE_CURSOR_FREEZE_MS = 320
const PINCH_DISTANCE_THRESHOLD = 0.050
const PINCH_RELEASE_DISTANCE = 0.075
const PINCH_COOLDOWN_MS = 520
const PEACE_SIGN_COOLDOWN_MS = 950
const PINKY_POINT_COOLDOWN_MS = 950
const JOYSTICK_DEADZONE_TOP = 0.35
const JOYSTICK_DEADZONE_BOTTOM = 0.65
const JOYSTICK_MAX_SPEED = 35
const FIST_ZOOM_MIN_DELTA = 1.2

export type HandGestureName =
  | 'none'
  | 'cursor'
  | 'swipe-left'
  | 'swipe-right'
  | 'pinch'
  | 'fist-zoom'
  | 'palm-scroll'
  | 'peace-sign'
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

const areRingPinkyFolded = (landmarks: NormalizedLandmark[]) =>
  isFingerFolded(landmarks, 16, 14) &&
  isFingerFolded(landmarks, 20, 18)

const areMainFingersExtended = (landmarks: NormalizedLandmark[]) =>
  isFingerExtended(landmarks, 8, 6) &&
  isFingerExtended(landmarks, 12, 10) &&
  isFingerExtended(landmarks, 16, 14) &&
  isFingerExtended(landmarks, 20, 18)

const isPeaceSignPose = (landmarks: NormalizedLandmark[]) =>
  isFingerExtended(landmarks, 8, 6) &&
  isFingerExtended(landmarks, 12, 10) &&
  areRingPinkyFolded(landmarks) &&
  distance2d(landmarks[8], landmarks[12]) > 0.025

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

const ACTIVE_AREA = {
  width: 0.40,
  yMin: 0.25,
  yMax: 0.60,
}

const getPalmY = (landmarks: NormalizedLandmark[]) => {
  const rawY = (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5
  return Math.max(0, Math.min(1, (rawY - ACTIVE_AREA.yMin) / (ACTIVE_AREA.yMax - ACTIVE_AREA.yMin)))
}

const getIndexPoint = (landmarks: NormalizedLandmark[]): HandGesturePoint => ({
  x: 1 - landmarks[8].x,
  y: landmarks[8].y,
})

const normalizedToViewport = (point: HandGesturePoint, handedness?: string): HandGesturePoint => {
  const { width, height } = getViewportSize()
  
  // Base offset
  let xMin = 0.30
  
  // MediaPipe considers physical right hand as "Left" when mirrored, 
  // but to be safe we just check both.
  // Physical right hand usually has point.x > 0.5 (mirrored image).
  if (handedness === 'Right' || handedness === 'Left') {
    if (handedness === 'Right') {
       // User's physical right hand: naturally rests on the right side of their body
       // In mirrored coordinates (point.x = 1 - landmark.x), point.x is around 0.65
       // Center of 0.45 to 0.85 is 0.65
       xMin = 0.45
    } else {
       // User's physical left hand: naturally rests on the left side of their body
       // In mirrored coordinates, point.x is around 0.35
       // Center of 0.15 to 0.55 is 0.35
       xMin = 0.15
    }
  }

  const mappedX = (point.x - xMin) / ACTIVE_AREA.width
  const mappedY = (point.y - ACTIVE_AREA.yMin) / (ACTIVE_AREA.yMax - ACTIVE_AREA.yMin)

  return {
    x: Math.min(Math.max(mappedX * width, 0), width - 1),
    y: Math.min(Math.max(mappedY * height, 0), height - 1),
  }
}

const getAvailableVideoStream = async (): Promise<MediaStream> => {
  try {
    // Attempt 1: Ideal constraints
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    })
  } catch (err) {
    // Attempt 2: Just facingMode
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user' },
      })
    } catch (err2) {
      // Attempt 3: Try all available video inputs one by one
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(d => d.kind === 'videoinput')
      
      if (videoDevices.length === 0) {
        throw new Error('Requested device not found') // trigger specific catch message
      }

      for (const device of videoDevices) {
        try {
          return await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { deviceId: { exact: device.deviceId } }
          })
        } catch (deviceErr) {
          console.warn(`Failed to start camera ${device.label || device.deviceId}:`, deviceErr)
          continue
        }
      }
      
      throw new Error('Could not start video source') // trigger specific catch message
    }
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
  const previousPalmYRef = useRef<number | null>(null)
  const pointerPositionRef = useRef<HandGesturePoint>({ x: 0.5, y: 0.5 })
  const lastVideoTimeRef = useRef(-1)
  const lastSwipeAtRef = useRef(0)
  const cursorFreezeUntilRef = useRef(0)
  const pinchDownRef = useRef(false)
  const lastPinchAtRef = useRef(0)
  const peaceSignDownRef = useRef(false)
  const lastPeaceSignAtRef = useRef(0)
  const pinkyPointDownRef = useRef(false)
  const lastPinkyPointAtRef = useRef(0)
  const poseHoldFramesRef = useRef<{ pose: string; count: number }>({ pose: 'none', count: 0 })
  const activeGestureRef = useRef<HandGestureName>('none')
  const onGestureRef = useRef(onGesture)
  const lastDetectionTimeRef = useRef(0)
  const performanceHistoryRef = useRef<number[]>([])
  const currentThrottleRef = useRef<number>(0) // 0 = as fast as possible
  const landmarksRef = useRef<NormalizedLandmark[] | null>(null)

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
    previousPalmYRef.current = null
    pinchDownRef.current = false
    peaceSignDownRef.current = false
    pinkyPointDownRef.current = false
    poseHoldFramesRef.current = { pose: 'none', count: 0 }
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

    const processLandmarks = (landmarks: NormalizedLandmark[], timestamp: number, handedness?: string) => {
      const indexPoint = getIndexPoint(landmarks)
      const viewportPoint = normalizedToViewport(indexPoint, handedness)
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
      const pinchDistance = distance2d(landmarks[4], landmarks[8])
      // Removed overly aggressive isPrePinching freeze which caused random stuttering
      const isCursorFrozen = timestamp < cursorFreezeUntilRef.current

      previousIndexRef.current = { ...indexPoint, time: timestamp }

      landmarksRef.current = landmarks

      if (!isCursorFrozen) {
        const previousCursor = previousCursorRef.current
        
        // Smooth dynamic LERP to eliminate "stop-and-go" stuttering
        let alpha = Math.min(
          Math.max(CURSOR_BASE_ALPHA + speed * CURSOR_SPEED_MULTIPLIER, CURSOR_BASE_ALPHA),
          CURSOR_MAX_ALPHA
        )
        
        // Dynamic Pre-Pinch Stabilization:
        // As the user closes their fingers to pinch, their hand naturally shifts.
        // We progressively reduce the alpha (up to 90% slower) to make the cursor "heavy" and anchor it in place
        // right before the click, preventing it from sliding off the button.
        if (pinchDistance < 0.09) {
          const progress = Math.max(0, (pinchDistance - PINCH_DISTANCE_THRESHOLD) / (0.09 - PINCH_DISTANCE_THRESHOLD))
          const pinchStabilization = 0.1 + 0.9 * progress
          alpha *= pinchStabilization
        }
        
        const nextCursor = previousCursor
          ? {
              x: lerp(previousCursor.x, viewportPoint.x, alpha),
              y: lerp(previousCursor.y, viewportPoint.y, alpha),
            }
          : viewportPoint

        previousCursorRef.current = nextCursor
        setState((prev) => {
          if (prev.cursor.visible && !prev.cursor.frozen && prev.handPresent) {
            return prev
          }
          return {
            ...prev,
            cursor: {
              ...nextCursor,
              visible: true,
              frozen: false,
            },
            handPresent: true,
            landmarks,
          }
        })
      } else {
        setState((prev) => {
          if (prev.cursor.visible && prev.cursor.frozen && prev.handPresent) {
            return prev
          }
          return {
            ...prev,
            cursor: {
              ...prev.cursor,
              visible: true,
              frozen: true,
            },
            handPresent: true,
            landmarks,
          }
        })
      }

      const currentCursor = previousCursorRef.current ?? viewportPoint
      const commonEvent = {
        point: currentCursor,
        velocity,
        speed,
        timestamp,
      }

      const peaceSignPose = isPeaceSignPose(landmarks)
      const pinkyPointPose = isPinkyPointPose(landmarks)
      const fistPose = areMainFingersFolded(landmarks)
      const openPalmPose = areMainFingersExtended(landmarks)
      const isPinching = pinchDistance < PINCH_DISTANCE_THRESHOLD
      const canSwipe =
        timestamp - lastSwipeAtRef.current > SWIPE_COOLDOWN_MS &&
        Math.abs(velocity.x) > SWIPE_SPEED_THRESHOLD &&
        Math.abs(velocity.x) > Math.abs(velocity.y) * SWIPE_AXIS_DOMINANCE

      let detectedPose = 'cursor'

      if (peaceSignPose) {
        detectedPose = 'peace-sign'
      } else if (pinkyPointPose) {
        detectedPose = 'pinky-point'
      } else if (fistPose) {
        detectedPose = 'fist-zoom'
      } else if (isPinching) {
        detectedPose = 'pinch'
      } else if (canSwipe) {
        detectedPose = 'swipe'
      } else if (openPalmPose) {
        detectedPose = 'palm-scroll'
      }

      if (['peace-sign', 'pinky-point', 'fist-zoom', 'palm-scroll'].includes(detectedPose)) {
        if (poseHoldFramesRef.current.pose === detectedPose) {
          poseHoldFramesRef.current.count++
        } else {
          poseHoldFramesRef.current = { pose: detectedPose, count: 1 }
        }

        if (poseHoldFramesRef.current.count < 4) {
          detectedPose = 'cursor'
        }
      } else {
        poseHoldFramesRef.current = { pose: detectedPose, count: 0 }
      }

      if (detectedPose !== 'peace-sign') peaceSignDownRef.current = false
      if (detectedPose !== 'pinky-point') pinkyPointDownRef.current = false
      if (detectedPose !== 'fist-zoom') previousFistYRef.current = null
      if (detectedPose !== 'palm-scroll') previousPalmYRef.current = null
      if (detectedPose !== 'pinch' && pinchDistance > PINCH_RELEASE_DISTANCE) pinchDownRef.current = false

      if (detectedPose === 'peace-sign') {
        pinchDownRef.current = false
        updateActiveGesture('peace-sign')

        if (!peaceSignDownRef.current && timestamp - lastPeaceSignAtRef.current > PEACE_SIGN_COOLDOWN_MS) {
          peaceSignDownRef.current = true
          lastPeaceSignAtRef.current = timestamp
          emitGesture({ ...commonEvent, type: 'peace-sign' })
        }
        return
      }

      if (detectedPose === 'pinky-point') {
        pinchDownRef.current = false
        updateActiveGesture('pinky-point')

        if (!pinkyPointDownRef.current && timestamp - lastPinkyPointAtRef.current > PINKY_POINT_COOLDOWN_MS) {
          pinkyPointDownRef.current = true
          lastPinkyPointAtRef.current = timestamp
          emitGesture({ ...commonEvent, type: 'pinky-point' })
        }
        return
      }

      if (detectedPose === 'fist-zoom') {
        updateActiveGesture('fist-zoom')
        const palmY = getPalmY(landmarks)
        const previousFistY = previousFistYRef.current

        if (previousFistY !== null) {
          const deltaY = (palmY - previousFistY) * getViewportSize().height
          if (Math.abs(deltaY) >= FIST_ZOOM_MIN_DELTA) {
            emitGesture({ ...commonEvent, type: 'fist-zoom', deltaY })
            previousFistYRef.current = palmY
          }
        } else {
          previousFistYRef.current = palmY
        }
        pinchDownRef.current = false
        return
      }

      if (detectedPose === 'swipe') {
        const type = velocity.x > 0 ? 'swipe-right' : 'swipe-left'
        lastSwipeAtRef.current = timestamp
        cursorFreezeUntilRef.current = timestamp + SWIPE_CURSOR_FREEZE_MS
        updateActiveGesture(type)
        emitGesture({ ...commonEvent, type })
        return
      }

      if (detectedPose === 'pinch') {
        updateActiveGesture('pinch')
        if (!pinchDownRef.current && timestamp - lastPinchAtRef.current > PINCH_COOLDOWN_MS) {
          pinchDownRef.current = true
          lastPinchAtRef.current = timestamp
          cursorFreezeUntilRef.current = timestamp + 350
          emitGesture({ ...commonEvent, type: 'pinch' })
        }
        return
      }

      if (detectedPose === 'palm-scroll') {
        updateActiveGesture('palm-scroll')
        const palmY = getPalmY(landmarks)
        let deltaY = 0

        if (palmY < JOYSTICK_DEADZONE_TOP) {
          // Hand is in the upper zone -> Scroll UP
          const intensity = Math.pow((JOYSTICK_DEADZONE_TOP - palmY) / JOYSTICK_DEADZONE_TOP, 1.5)
          deltaY = -JOYSTICK_MAX_SPEED * intensity
        } else if (palmY > JOYSTICK_DEADZONE_BOTTOM) {
          // Hand is in the lower zone -> Scroll DOWN
          const intensity = Math.pow((palmY - JOYSTICK_DEADZONE_BOTTOM) / (1 - JOYSTICK_DEADZONE_BOTTOM), 1.5)
          deltaY = JOYSTICK_MAX_SPEED * intensity
        }

        if (deltaY !== 0) {
          emitGesture({
            ...commonEvent,
            type: 'palm-scroll',
            deltaY,
          })
        }
        
        previousPalmYRef.current = palmY
        return
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

      // Adaptive Performance: Gunakan throttle (FPS limit) hanya jika perangkat terdeteksi nge-lag
      if (currentThrottleRef.current > 0 && timestamp - lastDetectionTimeRef.current < currentThrottleRef.current) {
        rafRef.current = window.requestAnimationFrame(processFrame)
        return
      }
      lastDetectionTimeRef.current = timestamp

      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        
        const t0 = performance.now()
        const result = landmarker.detectForVideo(video, timestamp)
        const t1 = performance.now()

        // --- ADAPTIVE FPS LOGIC ---
        // Catat waktu yang dibutuhkan AI untuk memproses 1 frame
        const inferenceTime = t1 - t0
        const history = performanceHistoryRef.current
        history.push(inferenceTime)
        if (history.length > 20) history.shift() // simpan 20 frame terakhir

        if (history.length === 20) {
          const avg = history.reduce((a, b) => a + b, 0) / 20
          if (avg > 45) {
            // Perangkat sangat kepayahan -> Batasi ke ~15 FPS (66ms) agar tidak nge-hang
            currentThrottleRef.current = 66
          } else if (avg > 25) {
            // Perangkat mulai berat -> Batasi ke ~24 FPS (41ms)
            currentThrottleRef.current = 41
          } else if (avg < 15) {
            // Perangkat kuat -> Gas full speed tanpa batas FPS
            currentThrottleRef.current = 0
          }
        }
        // --------------------------
        const landmarks = result.landmarks[0]

        const handedness = result.handednesses?.[0]?.[0]?.categoryName
        if (landmarks?.length) {
          processLandmarks(landmarks, timestamp, handedness)
        } else {
          previousIndexRef.current = null
          previousFistYRef.current = null
          previousPalmYRef.current = null
          pinchDownRef.current = false
          peaceSignDownRef.current = false
          pinkyPointDownRef.current = false
          updateActiveGesture('none')
          landmarksRef.current = null
          setState((prev) => {
            if (!prev.cursor.visible && !prev.cursor.frozen && !prev.handPresent) return prev;
            return {
              ...prev,
              cursor: {
                ...prev.cursor,
                visible: false,
                frozen: false,
              },
              handPresent: false,
              landmarks: null,
            }
          })
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
          getAvailableVideoStream(),
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

        let message =
          error instanceof Error
            ? error.message
            : 'Gagal mengaktifkan hand gesture.'

        const lowerMsg = message.toLowerCase()
        if (lowerMsg.includes('could not start video source') || lowerMsg.includes('notreadableerror') || lowerMsg.includes('trackstarterror')) {
          message = 'Kamera sedang digunakan oleh aplikasi lain (misal Zoom/Meet) atau bermasalah. Mohon tutup aplikasi tersebut dan coba lagi.'
        } else if (lowerMsg.includes('permission denied') || lowerMsg.includes('notallowederror')) {
          message = 'Izin kamera ditolak. Mohon izinkan akses kamera di browser Anda.'
        } else if (lowerMsg.includes('requested device not found') || lowerMsg.includes('notfounderror')) {
          message = 'Kamera tidak ditemukan. Pastikan kamera terhubung dengan benar.'
        }

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
    cursorRef: previousCursorRef,
    landmarksRef,
  }
}
