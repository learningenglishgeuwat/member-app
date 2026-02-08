'use client'

import React from 'react'
import { Settings } from 'lucide-react'

interface SpinningWheelProps {
  spinning: boolean
  className?: string
  color?: string
  reverse?: boolean
  onClick?: () => void
}

export const SpinningWheel: React.FC<SpinningWheelProps> = ({
  spinning,
  className = '',
  color = 'text-purple-400',
  reverse = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center ${className} ${onClick ? 'cursor-pointer group/wheel' : ''}`}
    >
      {/* Outer Glow Ring */}
      <div
        className={`absolute inset-[-4px] rounded-full border border-white/5 bg-gradient-to-b from-white/5 to-transparent ${spinning ? 'opacity-100' : 'opacity-30 group-hover/wheel:opacity-60'} transition-opacity`}
      />

      {/* Active Glow when spinning or hovering */}
      <div
        className={`absolute inset-0 ${color} blur-md transition-all duration-500 ${spinning ? 'opacity-60 scale-125' : 'opacity-0 group-hover/wheel:opacity-40 scale-100'}`}
      />

      {/* The Gear */}
      <div className="relative z-10 bg-black/80 rounded-full p-1.5 border border-white/10 shadow-lg backdrop-blur-sm transition-transform active:scale-95">
        <Settings
          className={`w-6 h-6 ${color} transition-all duration-[2000ms] ease-linear
            ${
              spinning
                ? reverse
                  ? 'animate-[spin_2s_linear_infinite_reverse]'
                  : 'animate-[spin_2s_linear_infinite]'
                : 'rotate-0 group-hover/wheel:rotate-45 transition-transform duration-500'
            }`}
          strokeWidth={1.5}
        />

        {/* Center pivot point detail */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/10 rounded-full border border-white/20"></div>
      </div>
    </div>
  )
}
