'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Hand, HelpCircle, Menu, X } from 'lucide-react'

export const GlobalGestureToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [clickMethod, setClickMethod] = useState<'pinch' | 'peace' | 'dwell'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app:gesture:clickMethod')
      if (saved === 'pinch' || saved === 'peace' || saved === 'dwell') {
        return saved
      }
    }
    return 'dwell'
  })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMethodChange = (event: CustomEvent) => {
      if (event.detail?.method) {
        setClickMethod(event.detail.method)
      }
    }
    window.addEventListener('gesture:clickMethod', handleMethodChange as EventListener)

    const handleResetAll = () => {
      setClickMethod('dwell')
    }
    window.addEventListener('gesture:reset', handleResetAll)

    return () => {
      window.removeEventListener('gesture:clickMethod', handleMethodChange as EventListener)
      window.removeEventListener('gesture:reset', handleResetAll)
    }
  }, [])

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    
    // Emit custom event for global gesture tracking
    window.dispatchEvent(
      new CustomEvent('gesture:toggle', {
        detail: { enabled: newState },
      }),
    )
  }

  const handleShowCursor = () => {
    const newState = !showCursor
    setShowCursor(newState)
    window.dispatchEvent(
      new CustomEvent('gesture:showCursor', {
        detail: { show: newState },
      }),
    )
  }

  const handleHapticFeedback = () => {
    const newState = !hapticFeedback
    setHapticFeedback(newState)
    window.dispatchEvent(
      new CustomEvent('gesture:hapticFeedback', {
        detail: { enabled: newState },
      }),
    )
  }

  const handleClickMethodChange = (method: 'pinch' | 'peace' | 'dwell') => {
    setClickMethod(method)
    localStorage.setItem('app:gesture:clickMethod', method)
    window.dispatchEvent(
      new CustomEvent('gesture:clickMethod', {
        detail: { method },
      }),
    )
  }

  const handleReset = () => {
    setIsEnabled(false)
    setShowCursor(false)
    setHapticFeedback(true)
    setClickMethod('dwell')
    localStorage.setItem('app:gesture:clickMethod', 'dwell')
    window.dispatchEvent(new CustomEvent('gesture:reset'))
    window.dispatchEvent(
      new CustomEvent('gesture:clickMethod', {
        detail: { method: 'dwell' },
      }),
    )
    setShowMenu(false)
  }

  return (
    <div className="fixed left-6 top-24 z-50 flex flex-col items-center gap-3">
      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl ${
          isEnabled
            ? 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white'
            : 'bg-gradient-to-br from-slate-300 to-slate-500 text-slate-700'
        }`}
        title="Toggle gesture tracking"
      >
        <Hand size={24} strokeWidth={2} />
      </button>

      {/* Status Text */}
      <span
        className={`text-xs font-semibold transition-opacity ${
          isEnabled ? 'text-cyan-600' : 'text-slate-400'
        } opacity-0 group-hover:opacity-100`}
      >
        {isEnabled ? 'ON' : 'OFF'}
      </span>

      {/* Help Button */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shadow-lg"
        title="Show gesture guide"
      >
        <HelpCircle size={24} />
      </button>

      {/* Menu Button */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors shadow-lg"
          title="Settings"
        >
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute left-0 top-16 w-48 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50"
          >
            <button
              onClick={handleShowCursor}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${
                showCursor
                  ? 'bg-cyan-100 text-cyan-900'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              {showCursor ? '✓ ' : ''}Show Cursor
            </button>
            <button
              onClick={handleHapticFeedback}
              className={`w-full text-left px-4 py-2 rounded transition-colors ${
                hapticFeedback
                  ? 'bg-cyan-100 text-cyan-900'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              {hapticFeedback ? '✓ ' : ''}Haptic Feedback
            </button>
            
            <hr className="my-2" />
            <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metode Klik</div>
            <div className="flex flex-col gap-1 px-1">
              <button
                onClick={() => handleClickMethodChange('pinch')}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                  clickMethod === 'pinch'
                    ? 'bg-cyan-100 text-cyan-900 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {clickMethod === 'pinch' ? '✓ ' : ''}1. Pinch (Mencubit)
              </button>
              <button
                onClick={() => handleClickMethodChange('peace')}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                  clickMethod === 'peace'
                    ? 'bg-cyan-100 text-cyan-900 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {clickMethod === 'peace' ? '✓ ' : ''}2. Peace Sign (2 Jari)
              </button>
              <button
                onClick={() => handleClickMethodChange('dwell')}
                className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                  clickMethod === 'dwell'
                    ? 'bg-cyan-100 text-cyan-900 font-semibold'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {clickMethod === 'dwell' ? '✓ ' : ''}3. Dwell / Hover (2s)
              </button>
            </div>
            
            <hr className="my-2" />
            <button
              onClick={handleReset}
              className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-600 transition-colors"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Gesture Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-md shadow-2xl overflow-y-auto max-h-[85vh]">
            <h3 className="text-lg font-bold mb-4 text-slate-900 border-b pb-2">Gesture & Click Guide</h3>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-cyan-600">👉 Swipe Left/Right</p>
                <p className="text-xs">Geser jari telunjuk Anda ke kiri/kanan dengan cepat untuk navigasi halaman.</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-600">✊ Fist Drag</p>
                <p className="text-xs">Kepalkan tangan Anda dan gerakkan ke atas/bawah secara vertikal untuk menggulir halaman (scroll).</p>
              </div>
              
              <div className="border-t border-slate-100 pt-3 mt-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Metode Klik (Pilih di Pengaturan):</p>
                
                <div className={`p-2 rounded mb-2 border transition-all ${clickMethod === 'pinch' ? 'bg-cyan-50 border-cyan-200' : 'border-transparent'}`}>
                  <p className="font-semibold text-cyan-700">1. Pinch (Mencubit)</p>
                  <p className="text-xs text-slate-600">Satukan ujung ibu jari dan jari telunjuk di atas tombol yang ingin Anda klik.</p>
                </div>
                
                <div className={`p-2 rounded mb-2 border transition-all ${clickMethod === 'peace' ? 'bg-cyan-50 border-cyan-200' : 'border-transparent'}`}>
                  <p className="font-semibold text-cyan-700">2. Peace Sign (2 Jari)</p>
                  <p className="text-xs text-slate-600">Tunjukkan gestur tanda damai (jari telunjuk & tengah terbentang) di atas tombol untuk mengeklik.</p>
                </div>
                
                <div className={`p-2 rounded border transition-all ${clickMethod === 'dwell' ? 'bg-emerald-50 border-emerald-200' : 'border-transparent'}`}>
                  <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
                    3. Dwell Time / Hover (Menahan Kursor)
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded font-normal">Paling Aman</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>Cara kerja:</strong> Pengguna tidak perlu melakukan gerakan jari sama sekali. Cukup arahkan kursor tangan ke atas tombol yang ingin diklik, lalu diamkan (hover) selama 2 detik. Biasanya akan muncul animasi lingkaran loading yang berputar, dan begitu lingkaran penuh, sistem otomatis melakukan klik.
                  </p>
                  <p className="text-[10px] text-emerald-800 mt-1 font-medium italic">
                    Kenapa ini aman: Ini adalah opsi paling aman dari crash karena mendeteksi waktu diam, bukan bentuk gestur tangan. Selain itu, cara ini bikin tangan pengguna tidak cepat lelah.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
