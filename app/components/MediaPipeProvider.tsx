'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Camera, Hand, LoaderCircle, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  useHandGestureTracking,
  type HandGestureEvent,
  type HandGestureName,
} from '@/lib/hooks/useHandGestureTracking'

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])

const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
]

const CLICKABLE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[tabindex]',
  '.cursor-pointer',
  '.alphabet-letter-card',
  '[data-gesture-clickable]',
].join(', ')

function normalizePathname(pathname: string | null) {
  if (!pathname) return ''
  return pathname.replace(/\/$/, '') || '/'
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname)
}

function dispatchGestureEvent(name: string, detail: HandGestureEvent) {
  const event = new CustomEvent(name, { detail })
  window.dispatchEvent(event)
  document.dispatchEvent(event)
}

function triggerAudioCue(name: 'laser' | 'success') {
  document.dispatchEvent(new CustomEvent(`app:audio:${name}`))
}

function clickElementAtPoint(x: number, y: number) {
  const element = document.elementFromPoint(x, y) as HTMLElement | null
  const target = element?.closest(CLICKABLE_SELECTOR) as HTMLElement | null

  if (!target) return
  if (target.closest('[data-hand-gesture-root]')) return
  if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') return

  target.focus?.({ preventScroll: true })
  target.click()
}

function getElementByDataValue(attributeName: string, value: string) {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(`[${attributeName}]`)).find(
      (element) => element.getAttribute(attributeName) === value,
    ) ?? null
  )
}

function getControlCenterSectionElement(button: HTMLButtonElement) {
  const sectionId = button.dataset.controlCenterSectionId
  if (!sectionId) return null

  return (
    document.getElementById(sectionId) ??
    getElementByDataValue('data-section-id', sectionId) ??
    getElementByDataValue('data-gesture-section-id', sectionId)
  )
}

function getViewportSectionScore(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1
  const viewportCenter = viewportHeight / 2
  const visibleTop = Math.max(rect.top, 0)
  const visibleBottom = Math.min(rect.bottom, viewportHeight)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  const containsViewportCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter
  const distanceFromCenter = containsViewportCenter
    ? 0
    : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter))

  if (rect.height <= 0 && visibleHeight <= 0) return Number.NEGATIVE_INFINITY

  return (
    (containsViewportCenter ? 1_000_000 : 0) +
    (visibleHeight > 0 ? 100_000 : 0) +
    Math.min(visibleHeight, viewportHeight) -
    distanceFromCenter
  )
}

function findBestVisibleControlCenterButton(buttons: HTMLButtonElement[]) {
  let bestButton: HTMLButtonElement | null = null
  let bestScore = Number.NEGATIVE_INFINITY

  for (const button of buttons) {
    const sectionElement = getControlCenterSectionElement(button)
    if (!sectionElement) continue

    const score = getViewportSectionScore(sectionElement)
    if (score > bestScore) {
      bestScore = score
      bestButton = button
    }
  }

  return bestButton
}

function clickControlCenterPlayButton() {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-control-center-playstop="true"]'),
  ).filter(
    (button) => !button.disabled && button.getAttribute('aria-disabled') !== 'true',
  )
  const target = findBestVisibleControlCenterButton(buttons) ?? buttons[0]

  if (!target) return false

  target.click()
  return true
}

function clickControlCenterIpaToggle() {
  const scopedInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(
      '[data-control-center-root="true"] [data-control-center-ipa-toggle="true"]',
    ),
  )
  const fallbackInputs = scopedInputs.length
    ? scopedInputs
    : Array.from(document.querySelectorAll<HTMLInputElement>('[data-control-center-ipa-toggle="true"]'))
  const target = fallbackInputs.find(
    (input) => !input.disabled && input.getAttribute('aria-disabled') !== 'true',
  )

  if (!target) return false

  target.click()
  return true
}

function getButtonTitle(enabled: boolean, status: string, error: string | null) {
  if (status === 'error') return error ? `Hand gesture error: ${error}` : 'Hand gesture error'
  if (enabled) return 'Hand gesture: On'
  return 'Hand gesture: Off'
}

function getCursorClasses(activeGesture: HandGestureName) {
  if (activeGesture === 'pinch') {
    return 'border-fuchsia-300 bg-fuchsia-300/20 shadow-[0_0_18px_rgba(232,121,249,0.75)] scale-75'
  }

  if (activeGesture === 'fist-scroll') {
    return 'border-lime-300 bg-lime-300/15 shadow-[0_0_18px_rgba(190,242,100,0.65)] scale-110'
  }

  if (activeGesture === 'thumbs-up') {
    return 'border-amber-200 bg-amber-200/20 shadow-[0_0_20px_rgba(253,230,138,0.75)] scale-110'
  }

  if (activeGesture === 'pinky-point') {
    return 'border-pink-200 bg-pink-300/20 shadow-[0_0_20px_rgba(244,114,182,0.78)] scale-110'
  }

  if (activeGesture === 'swipe-left' || activeGesture === 'swipe-right') {
    return 'border-cyan-100 bg-cyan-300/25 shadow-[0_0_22px_rgba(103,232,249,0.85)] scale-125'
  }

  return 'border-cyan-300 bg-cyan-300/10 shadow-[0_0_16px_rgba(34,211,238,0.55)]'
}

function getCoverPoint(
  landmark: NormalizedLandmark,
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement | null,
) {
  const width = canvas.clientWidth || window.innerWidth
  const height = canvas.clientHeight || window.innerHeight
  const videoWidth = video?.videoWidth || 0
  const videoHeight = video?.videoHeight || 0

  if (!videoWidth || !videoHeight) {
    return {
      x: (1 - landmark.x) * width,
      y: landmark.y * height,
    }
  }

  const videoAspect = videoWidth / videoHeight
  const canvasAspect = width / height
  const displayWidth = videoAspect > canvasAspect ? height * videoAspect : width
  const displayHeight = videoAspect > canvasAspect ? height : width / videoAspect
  const offsetX = (width - displayWidth) / 2
  const offsetY = (height - displayHeight) / 2

  return {
    x: offsetX + (1 - landmark.x) * displayWidth,
    y: offsetY + landmark.y * displayHeight,
  }
}

function drawHandLandmarks(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement | null,
  landmarks: NormalizedLandmark[] | null,
) {
  const context = canvas.getContext('2d')
  if (!context) return

  const pixelRatio = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = window.innerHeight
  const nextWidth = Math.floor(width * pixelRatio)
  const nextHeight = Math.floor(height * pixelRatio)

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth
    canvas.height = nextHeight
  }

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, width, height)

  if (!landmarks?.length) return

  const points = landmarks.map((landmark) => getCoverPoint(landmark, canvas, video))

  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = 3
  context.strokeStyle = 'rgba(103, 232, 249, 0.86)'
  context.shadowColor = 'rgba(34, 211, 238, 0.9)'
  context.shadowBlur = 10

  for (const [from, to] of HAND_CONNECTIONS) {
    const start = points[from]
    const end = points[to]
    if (!start || !end) continue

    context.beginPath()
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
  }

  context.shadowBlur = 12
  for (const [index, point] of points.entries()) {
    context.beginPath()
    context.fillStyle = index === 8 ? 'rgba(244, 114, 182, 0.96)' : 'rgba(255, 255, 255, 0.92)'
    context.arc(point.x, point.y, index === 8 ? 6 : 4, 0, Math.PI * 2)
    context.fill()
  }
}

export default function MediaPipeProvider() {
  const pathname = normalizePathname(usePathname())
  const [enabled, setEnabled] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [previewCamera, setPreviewCamera] = useState(false)
  const [showLandmarks, setShowLandmarks] = useState(false)
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleGesture = useCallback((event: HandGestureEvent) => {
    if (event.type === 'swipe-right') {
      if (pathname === '/skill/pronunciation') {
        dispatchGestureEvent('app:gesture:pronunciation-topic-next', event)
      }

      if (pathname.startsWith('/skill/pronunciation/alphabet')) {
        dispatchGestureEvent('app:gesture:alphabet-next', event)
      }

      dispatchGestureEvent('app:gesture:navigate-next', event)
      triggerAudioCue('laser')
      return
    }

    if (event.type === 'swipe-left') {
      if (pathname === '/skill/pronunciation') {
        dispatchGestureEvent('app:gesture:pronunciation-topic-prev', event)
      }

      if (pathname.startsWith('/skill/pronunciation/alphabet')) {
        dispatchGestureEvent('app:gesture:alphabet-prev', event)
      }

      dispatchGestureEvent('app:gesture:navigate-prev', event)
      triggerAudioCue('laser')
      return
    }

    if (event.type === 'pinch') {
      clickElementAtPoint(event.point.x, event.point.y)
      dispatchGestureEvent('app:gesture:pinch', event)
      return
    }

    if (event.type === 'fist-scroll') {
      window.scrollBy({ top: event.deltaY ?? 0, left: 0, behavior: 'auto' })
      dispatchGestureEvent('app:gesture:scroll', event)
      return
    }

    if (event.type === 'thumbs-up') {
      const didClickPlayButton = clickControlCenterPlayButton()
      dispatchGestureEvent('app:gesture:control-center-play', event)

      if (didClickPlayButton) {
        triggerAudioCue('success')
      }
      return
    }

    if (event.type === 'pinky-point') {
      const didClickIpaToggle = clickControlCenterIpaToggle()
      dispatchGestureEvent('app:gesture:ipa-toggle', event)

      if (didClickIpaToggle) {
        triggerAudioCue('success')
      }
    }
  }, [pathname])

  const { status, error, cursor, activeGesture, videoRef, landmarks } = useHandGestureTracking({
    enabled,
    onGesture: handleGesture,
  })

  const isBusy = status === 'loading' || status === 'camera'
  const buttonTitle = getButtonTitle(enabled, status, error)
  const cursorClassName = useMemo(() => getCursorClasses(activeGesture), [activeGesture])

  const handleToggleEnabled = useCallback(() => {
    if (enabled) {
      setSettingsOpen(false)
      setPreviewCamera(false)
      setShowLandmarks(false)
    }

    setEnabled((prev) => !prev)
  }, [enabled])

  useEffect(() => {
    const canvas = landmarkCanvasRef.current
    if (!canvas) return

    if (!enabled || !showLandmarks) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    drawHandLandmarks(canvas, videoRef.current, landmarks)
  }, [enabled, landmarks, showLandmarks, videoRef])

  if (!pathname || isPublicPath(pathname)) return null

  return (
    <div data-hand-gesture-root>
      <div className="fixed left-0 top-[calc(50%_-_2rem)] z-[130] flex -translate-y-1/2 items-center gap-1">
        <button
          type="button"
          aria-label={enabled ? 'Matikan hand gesture kamera' : 'Aktifkan hand gesture kamera'}
          aria-pressed={enabled}
          title={buttonTitle}
          onClick={handleToggleEnabled}
          className={[
            'group flex h-6 w-6 items-center justify-center rounded-full border bg-black/75 backdrop-blur-sm transition-all duration-200 hover:scale-105',
            enabled
              ? 'border-cyan-300/75 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
              : 'border-slate-500/60 text-slate-300 shadow-[0_0_8px_rgba(148,163,184,0.2)]',
            status === 'error' && 'border-red-300/75 text-red-200 shadow-[0_0_12px_rgba(248,113,113,0.45)]',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {status === 'error' ? (
            <AlertTriangle className="h-2.5 w-2.5" />
          ) : isBusy ? (
            <LoaderCircle className="h-2.5 w-2.5 animate-spin" />
          ) : enabled ? (
            <Hand className="h-2.5 w-2.5" />
          ) : (
            <Camera className="h-2.5 w-2.5" />
          )}
        </button>

        {enabled ? (
          <button
            type="button"
            aria-label="Pengaturan hand gesture"
            aria-expanded={settingsOpen}
            title="Gesture settings"
            onClick={() => setSettingsOpen((prev) => !prev)}
            className="group flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/60 bg-black/75 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.3)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300/70 hover:text-fuchsia-200"
          >
            <Settings className="h-2.5 w-2.5" />
          </button>
        ) : null}

        {enabled && settingsOpen ? (
          <div className="ml-1 w-64 rounded-lg border border-cyan-300/35 bg-black/85 p-3 text-xs text-slate-100 shadow-[0_0_24px_rgba(34,211,238,0.22)] backdrop-blur-md">
            <label className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={previewCamera}
                onChange={(event) => setPreviewCamera(event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
              />
              <span>Preview camera full page</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={showLandmarks}
                onChange={(event) => setShowLandmarks(event.target.checked)}
                className="h-4 w-4 accent-cyan-300"
              />
              <span>Tampilkan landmark hand gesture</span>
            </label>
          </div>
        ) : null}
      </div>

      <video
        ref={videoRef}
        aria-hidden="true"
        playsInline
        muted
        className={[
          'pointer-events-none fixed bg-black',
          previewCamera && enabled
            ? 'inset-0 z-[90] h-screen w-screen scale-x-[-1] object-cover opacity-45'
            : 'bottom-0 left-0 h-px w-px opacity-0',
        ].join(' ')}
      />

      {enabled && showLandmarks ? (
        <canvas
          ref={landmarkCanvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[95] h-screen w-screen"
        />
      ) : null}

      {enabled && cursor.visible ? (
        <div
          aria-hidden="true"
          className={[
            'pointer-events-none fixed z-[2147483000] h-8 w-8 rounded-full border-2 transition-[transform,border-color,background-color,box-shadow] duration-150',
            cursor.frozen && 'opacity-80',
            cursorClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
          <span className="absolute inset-[-7px] rounded-full border border-cyan-200/20" />
        </div>
      ) : null}
    </div>
  )
}
