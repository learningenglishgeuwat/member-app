'use client'

import React, { useState, useRef } from 'react'
import { Hand, HelpCircle, Menu, X } from 'lucide-react'

export const GlobalGestureToggle = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showCursor, setShowCursor] = useState(false)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

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

  const handleReset = () => {
    setIsEnabled(false)
    setShowCursor(false)
    setHapticFeedback(true)
    window.dispatchEvent(new CustomEvent('gesture:reset'))
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
          <div className="bg-white rounded-lg p-6 max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Gesture Guide</h3>
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <p className="font-semibold text-cyan-600">👉 Swipe Left/Right</p>
                <p>Move your index finger left or right quickly to navigate</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-600">✌️ Pinch</p>
                <p>Bring thumb and index finger together to select/confirm</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-600">👍 Thumbs Up</p>
                <p>Point your thumb upward to trigger special actions</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-600">✊ Fist Drag</p>
                <p>Make a fist and move vertically to scroll</p>
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
