'use client'

import React from 'react'
import Image from 'next/image'

interface LoginHeaderProps {
  isFullyActive: boolean
  isPartiallyActive: boolean
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({
  isFullyActive,
  isPartiallyActive,
}) => {
  return (
    <div className="flex justify-center items-center mb-8">
      <div className="relative">
        {/* Back Glow - changes color based on state */}
        <div
          className={`absolute inset-0 blur-2xl opacity-20 animate-pulse transition-colors duration-700 ${
            isFullyActive ? 'bg-cyan-400' : 'bg-purple-500'
          }`}
        />

        {/* Logo Image - Transparent 3D Icon with Dynamic Effects */}
        <Image
          src="/learning_english_geuwat_rb_3d.png"
          alt="GEUWAT Logo"
          width={128}
          height={128}
          loading="eager"
          className={`relative w-32 h-32 object-contain transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${
              isFullyActive
                ? 'scale-110 rotate-0 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]'
                : isPartiallyActive
                  ? 'scale-105 rotate-0 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                  : 'scale-100 rotate-0 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]'
            }
          `}
        />
      </div>
    </div>
  )
}
