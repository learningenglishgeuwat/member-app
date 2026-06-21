'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Camera, Hand, LoaderCircle, Settings, ZoomIn, ZoomOut, Gamepad2, Info, ChevronRight, ChevronLeft } from 'lucide-react'
import GlobalSfxButton from './GlobalSfxButton'
import { usePathname } from 'next/navigation'
import {
  useHandGestureTracking,
  type HandGestureEvent,
  type HandGestureName,
} from '@/lib/hooks/useHandGestureTracking'
import { speakSentence } from '@/lib/tts'
import {
  normalizePathname,
  isPublicPath,
  dispatchGestureEvent,
  triggerAudioCue,
  getClickableElementAtPoint,
  simulateClickAtPoint,
  getActiveScrollableElement,
  clickControlCenterPlayButton,
  clickControlCenterIpaToggle,
  getButtonTitle,
  getCursorClasses,
  drawHandLandmarks
} from '@/lib/utils/media-pipe-helpers'
export default function MediaPipeProvider() {
  const pathname = normalizePathname(usePathname())
  const [enabled, setEnabled] = useState(false)
  const [showControlPanel, setShowControlPanel] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [previewCamera, setPreviewCamera] = useState(false)
  const [showLandmarks, setShowLandmarks] = useState(false)
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [showZoomIndicator, setShowZoomIndicator] = useState(false)
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const cursorRef = useRef({ x: 0, y: 0, visible: false, frozen: false })
  const activeGestureRef = useRef<HandGestureName>('none')

  useEffect(() => {

    const handleZoomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<HandGestureEvent>
      const deltaY = customEvent.detail?.deltaY ?? 0
      
      const currentZoom = parseFloat(document.body.style.zoom || '1')
      const zoomFactor = 0.0018
      let newZoom = currentZoom + deltaY * zoomFactor
      newZoom = Math.min(Math.max(newZoom, 0.5), 2.5)
      newZoom = Math.round(newZoom * 100) / 100
      
      document.body.style.zoom = newZoom.toString()
      
      // Update DOM synchronously to prevent 1-frame jitter before React re-renders
      const videoEl = document.querySelector('video.pointer-events-none') as HTMLVideoElement | null
      if (videoEl) {
        videoEl.style.width = `${100 / newZoom}vw`
        videoEl.style.height = `${100 / newZoom}vh`
      }
      const canvasEl = document.querySelector('canvas.pointer-events-none') as HTMLCanvasElement | null
      if (canvasEl) {
        canvasEl.style.width = `${100 / newZoom}vw`
        canvasEl.style.height = `${100 / newZoom}vh`
      }
      const cursorEl = document.getElementById('hand-cursor')
      if (cursorEl) {
        cursorEl.style.transform = `translate(-50%, -50%) scale(${1 / newZoom})`
      }

      setZoomLevel(newZoom)
      setShowZoomIndicator(true)
      
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current)
      }
      zoomTimeoutRef.current = setTimeout(() => {
        setShowZoomIndicator(false)
      }, 1500)
    }
    window.addEventListener('app:gesture:zoom', handleZoomEvent as EventListener)

    return () => {
      window.removeEventListener('app:gesture:zoom', handleZoomEvent as EventListener)
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current)
      }
    }
  }, [])

  const handleGesture = useCallback((event: HandGestureEvent) => {
    if (event.type === 'swipe-right') {
      if (pathname === '/skill/pronunciation') {
        dispatchGestureEvent('app:gesture:pronunciation-topic-next', event)
      }

      if (pathname.startsWith('/skill/pronunciation/alphabet')) {
        return
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
        return
      }

      dispatchGestureEvent('app:gesture:navigate-prev', event)
      triggerAudioCue('laser')
      return
    }

    if (event.type === 'pinch') {
      dispatchGestureEvent('app:gesture:pinch', event)
      if (simulateClickAtPoint(event.point.x, event.point.y)) {
        triggerAudioCue('success')
      }
      return
    }

    if (event.type === 'fist-zoom') {
      dispatchGestureEvent('app:gesture:zoom', event)
      return
    }

    if (event.type === 'palm-scroll') {
      const scrollableElement = getActiveScrollableElement(event.point.x, event.point.y)
      if (scrollableElement) {
        scrollableElement.scrollBy({ top: event.deltaY ?? 0, left: 0, behavior: 'instant' })
      } else {
        window.scrollBy({ top: event.deltaY ?? 0, left: 0, behavior: 'instant' })
      }
      dispatchGestureEvent('app:gesture:scroll', event)
      return
    }

    if (event.type === 'peace-sign') {
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
      speakSentence('Camera is deactivated')
    } else {
      speakSentence('Camera is active')
    }

    setEnabled((prev) => !prev)
  }, [enabled])

  useEffect(() => {
    cursorRef.current = cursor
  }, [cursor])

  useEffect(() => {
    activeGestureRef.current = activeGesture
  }, [activeGesture])

  useEffect(() => {
    if (previewCamera && enabled) {
      document.body.classList.add('is-camera-full-page')
    } else {
      document.body.classList.remove('is-camera-full-page')
    }
    
    return () => {
      document.body.classList.remove('is-camera-full-page')
    }
  }, [previewCamera, enabled])

  useEffect(() => {
    const canvas = landmarkCanvasRef.current
    if (!canvas) return

    if (!enabled || !showLandmarks) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    drawHandLandmarks(canvas, videoRef.current, landmarks, zoomLevel)
  }, [enabled, landmarks, showLandmarks, videoRef, zoomLevel])

  useEffect(() => {
    if (!enabled) {
      const t = setTimeout(() => setIsHoveringClickable(false), 0)
      return () => clearTimeout(t)
    }

    const tick = () => {
      const currentCursor = cursorRef.current
      let hoveredTarget: HTMLElement | null = null
      if (currentCursor.visible) {
        hoveredTarget = getClickableElementAtPoint(currentCursor.x, currentCursor.y)
      }
      const isClickable = !!(hoveredTarget && document.contains(hoveredTarget))
      setIsHoveringClickable(isClickable)

      window.requestAnimationFrame(tick)
    }

    const rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!pathname || isPublicPath(pathname)) return null

  return (
    <div data-hand-gesture-root>
      <style dangerouslySetInnerHTML={{ __html: `body { zoom: ${zoomLevel}; }` }} />
      <div
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-[130] transition-transform duration-300 ease-in-out flex shadow-[0_0_20px_rgba(0,0,0,0.8)] ${
          showControlPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Content */}
        <div className={`border border-l-0 border-white/10 rounded-r-lg p-2 sm:p-3 flex flex-col items-center gap-3 sm:gap-4 max-h-[80vh] overflow-y-auto transition-colors duration-300 ${
          previewCamera && enabled ? 'bg-[#101314]/30 backdrop-blur-md' : 'bg-[#101314]/95 backdrop-blur-sm'
        }`}>
          
          {enabled ? (
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={settingsOpen}
              title="Gesture settings"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="group flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full border border-cyan-400/30 bg-[#1a1f24]/60 backdrop-blur-sm transition-all duration-300 active:scale-95 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          ) : null}

          <button
            type="button"
            aria-label={enabled ? 'Matikan hand gesture kamera' : 'Aktifkan hand gesture kamera'}
            aria-pressed={enabled}
            title={buttonTitle}
            onClick={handleToggleEnabled}
            className={[
              'relative flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full border-2 transition-all duration-300 group',
              enabled
                ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.5)] text-cyan-400'
                : 'border-cyan-400/40 bg-cyan-400/5 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] text-cyan-400',
              status === 'error' && 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.5)] text-red-500',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {status === 'error' ? (
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : isBusy ? (
              <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : enabled ? (
              <Hand className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          <GlobalSfxButton />

          <Link 
            href="/skill/game-links"
            className="group flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full border border-cyan-400/30 bg-[#1a1f24]/60 backdrop-blur-sm transition-all duration-300 active:scale-95 text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            title="Mini Games"
          >
            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {/* Toggle Tab */}
        <button
          onClick={() => setShowControlPanel(!showControlPanel)}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border border-l-0 border-white/10 p-1 sm:p-1.5 rounded-r-md transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.3)] ${
            previewCamera && enabled ? 'bg-[#101314]/30 backdrop-blur-md' : 'bg-[#101314]'
          }`}
          style={{ color: '#22d3ee' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#06b6d4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#22d3ee'; }}
          aria-label={showControlPanel ? 'Close Control Panel' : 'Open Control Panel'}
        >
          {showControlPanel ? <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>
      </div>

      {showControlPanel && enabled && settingsOpen && (
        <div 
          className="fixed inset-0 z-[110]" 
          onClick={() => setSettingsOpen(false)} 
        />
      )}
      <div className={`fixed left-[70px] sm:left-[80px] top-1/2 -translate-y-1/2 z-[120] transition-all duration-300 ${
        showControlPanel && enabled && settingsOpen ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 pointer-events-none -translate-x-4'
      }`}>
        {showControlPanel && enabled && settingsOpen ? (
          <div className={`ml-1 w-64 rounded-lg border border-cyan-300/35 p-3 text-xs text-slate-100 shadow-[0_0_24px_rgba(34,211,238,0.22)] backdrop-blur-md transition-colors duration-300 ${
            previewCamera && enabled ? 'bg-black/30' : 'bg-black/85'
          }`}>
            <button
              onClick={() => {
                setGuideOpen(true)
                setSettingsOpen(false)
              }}
              className="mb-2.5 flex w-full items-center gap-2 rounded border border-fuchsia-400/50 bg-fuchsia-500/20 px-2.5 py-2 text-left font-semibold text-fuchsia-100 shadow-[0_0_8px_rgba(232,121,249,0.3)] transition-all hover:scale-[1.02] hover:bg-fuchsia-500/30"
            >
              <Info className="h-4 w-4" />
              <span>Panduan Hand Tracking</span>
            </button>
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
            ? 'left-0 top-0 z-[90] scale-x-[-1] object-cover opacity-45'
            : 'bottom-0 left-0 h-px w-px opacity-0',
        ].join(' ')}
        style={
          previewCamera && enabled
            ? {
                width: `${100 / zoomLevel}vw`,
                height: `${100 / zoomLevel}vh`,
              }
            : undefined
        }
      />

      {enabled && showLandmarks ? (
        <canvas
          ref={landmarkCanvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[95]"
          style={{
            width: `${100 / zoomLevel}vw`,
            height: `${100 / zoomLevel}vh`,
          }}
        />
      ) : null}

      {enabled && cursor.visible ? (
        <div
          aria-hidden="true"
          className={[
            'pointer-events-none fixed z-[99999] h-8 w-8 rounded-full border-2 transition-[transform,border-color,background-color,box-shadow] duration-150',
            cursor.frozen && 'opacity-80',
            isHoveringClickable && 'scale-110 border-fuchsia-400 bg-fuchsia-400/10 shadow-[0_0_18px_rgba(232,121,249,0.7)]',
            cursorClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            left: `${cursor.x / zoomLevel}px`,
            top: `${cursor.y / zoomLevel}px`,
            transform: `translate(-50%, -50%) scale(${1 / zoomLevel})`,
            zIndex: 999999,
          }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
          <span className="absolute inset-[-7px] rounded-full border border-cyan-200/20" />
        </div>
      ) : null}

      {/* Zoom HUD indicator */}
      {enabled && showZoomIndicator ? (
        <div 
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-[#070b19] px-4 py-2 text-[11px] font-mono font-bold tracking-wider text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.35)]"
        >
          {zoomLevel >= 1 ? (
            <ZoomIn className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          ) : (
            <ZoomOut className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          )}
          <span>ZOOM {Math.round(zoomLevel * 100)}%</span>
        </div>
      ) : null}

      {/* Guide Modal */}
      {guideOpen ? (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setGuideOpen(false)}
        >
          <div 
            className={`relative w-full max-w-md rounded-2xl border border-cyan-400/50 p-6 text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-md transition-colors duration-300 ${
              previewCamera && enabled ? 'bg-[#070b19]/40' : 'bg-[#070b19]/90'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGuideOpen(false)}
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-cyan-300">
              <Info className="h-6 w-6 text-fuchsia-400" />
              Panduan Hand Tracking
            </h2>
            
            <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              <p className="text-sm leading-relaxed text-slate-300">
                Halo Pembelajar! Fitur <strong>Hand Tracking</strong> memungkinkan Anda mengontrol aplikasi ini sepenuhnya menggunakan gestur tangan. Berikut adalah panduan <em>coaching</em> untuk menguasainya:
              </p>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">👆</span> Kursor (Mengarahkan Layar)
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Arahkan <strong>telapak tangan Anda</strong> dengan santai menghadap kamera. Kursor di layar akan secara otomatis mengikuti arah pergerakan tangan Anda untuk bernavigasi.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">🤏</span> Pinch (Mencubit) untuk Klik
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Arahkan kursor ke tombol target, lalu <strong>katupkan ujung jempol dan telunjuk</strong> secara bersamaan. Gestur ini memicu aksi <em>Click</em> pada tombol yang disorot.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">✌️</span> Peace Sign (Dua Jari) untuk Play All
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Acungkan pose <strong>Peace (jari telunjuk dan tengah)</strong>. Gestur ini berguna untuk memicu tombol <em>Play All</em> agar aplikasi membacakan semua materi sekaligus secara otomatis.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">🤙</span> Pinky Point (Kelingking) untuk Show IPA
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Angkat hanya <strong>jari kelingking Anda</strong> ke arah kamera. Gestur ini berfungsi sebagai sakelar (<em>toggle</em>) untuk memunculkan atau menyembunyikan simbol fonetik IPA.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">💨</span> Swipe (Geser Cepat) untuk Navigasi
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Gerakkan telapak tangan Anda <strong>dengan cepat ke kiri atau kanan</strong> layaknya sedang menepis. Gestur ini memicu aksi pindah halaman <em>Next</em> atau <em>Previous</em>.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">✋</span> Palm Scroll (Menggulir)
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Tunjukkan <strong>telapak tangan terbuka</strong> ke kamera. Gerakkan perlahan ke batas atas layar untuk <em>Scroll Up</em> atau ke bawah untuk <em>Scroll Down</em>.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
                <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
                  <span className="text-lg">✊</span> Fist Zoom (Perbesar)
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  <strong>Kepalkan tangan</strong>, lalu gerakkan sedikit ke atas atau bawah. Gunakan gestur ini untuk <em>Zoom In</em> dan <em>Zoom Out</em> halaman.
                </p>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button 
                onClick={() => setGuideOpen(false)}
                className="rounded-full border border-cyan-400/50 bg-cyan-600/20 px-6 py-2 text-sm font-semibold text-cyan-100 transition-all hover:scale-105 hover:bg-cyan-500/30"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
