'use client'

import React from 'react'

interface LoginButtonProps {
  isLoading: boolean
  isEnabled: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({ isLoading, isEnabled }) => {
  return (
    <div className="flex justify-center pt-4">
      <button
        type="submit"
        disabled={!isEnabled || isLoading}
        className={`relative px-8 py-3 font-medium transition-all duration-500 transform overflow-hidden btn-slanted
          ${isEnabled && !isLoading
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 hover:from-cyan-400 hover:to-purple-500'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }
          ${isLoading ? 'cursor-wait' : ''}
        `}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Button Text */}
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
          {isLoading ? 'Authenticating...' : 'Sign In'}
        </span>

        {/* Glow Effect when enabled */}
        {isEnabled && !isLoading && (
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur-lg -z-10"></div>
        )}
      </button>
    </div>
  )
}
