'use client'

import React from 'react'

interface FormBackgroundProps {
  isFullyActive: boolean
}

export const FormBackground: React.FC<FormBackgroundProps> = ({ isFullyActive }) => {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Main Background Card - Nebula Style */}
      <div className={`relative bg-slate-900/50 backdrop-blur-xl rounded-2xl transition-all duration-700 ${
        isFullyActive 
          ? 'shadow-neon' 
          : 'shadow-lg shadow-nebula-500/20'
      }`}>
        {/* Animated Gradient Overlay - Nebula Style */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 ${
          isFullyActive
            ? 'bg-gradient-to-br from-nebula-500/5 via-transparent to-purple-600/5'
            : 'bg-gradient-to-br from-nebula-500/3 via-transparent to-indigo-600/3'
        }`}></div>
        
        {/* Additional Nebula Effects */}
        {isFullyActive && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-600/10 to-transparent animate-pulse"></div>
        )}
        
        {/* Noise Texture */}
        <div className="absolute inset-0 rounded-2xl opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Edge Glow */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
          isFullyActive
            ? 'shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]'
            : 'shadow-[inset_0_0_10px_rgba(139,92,246,0.05)]'
        }`}></div>
      </div>
    </div>
  )
}
