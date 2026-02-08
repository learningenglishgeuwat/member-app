'use client'

import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface LoginErrorPopupProps {
  isOpen: boolean
  errorMessage: string
  onClose: () => void
  showForgotPassword?: boolean
}

export const LoginErrorPopup: React.FC<LoginErrorPopupProps> = ({
  isOpen,
  errorMessage,
  onClose,
  showForgotPassword = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden bg-[#0f172a] border border-red-500/30 rounded-2xl shadow-2xl shadow-red-900/20 scale-100 animate-in zoom-in-95 duration-200">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-75"></div>
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>

        <div className="p-6 text-center space-y-4 relative z-10">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-wide">Login Failed</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {errorMessage || 'Incorrect email or password.'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-900/20 hover:shadow-red-700/30 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            {showForgotPassword && (
              <a
                href="/forgot-password"
                className="block text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                Forgot password?
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
