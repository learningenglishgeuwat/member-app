'use client'

import React, { useState } from 'react'
import { SpinningWheel } from '../../../ui/SpinningWheel'
import { Eye, EyeOff } from 'lucide-react'

interface GearInputRowProps {
  variant: 'left' | 'right'
  type: string
  name: string
  placeholder: string
  value: string
  isActive: boolean
  onToggle: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  // Styling Props
  gearColorClass: string
  containerShadowClass: string
  innerGlowClass: string
}

export const GearInputRow: React.FC<GearInputRowProps> = ({
  variant,
  type,
  name,
  placeholder,
  value,
  isActive,
  onToggle,
  onChange,
  gearColorClass,
  containerShadowClass,
  innerGlowClass,
}) => {
  const isRight = variant === 'right'
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'

  return (
    <div
      className={`flex items-center ${isRight ? 'justify-end' : 'justify-start'} gap-4 min-h-[70px]`}
    >
      {/* If Variant LEFT: Gear appears first */}
      {!isRight && (
        <div className="w-10 flex justify-center perspective-500 shrink-0">
          <SpinningWheel
            spinning={isActive}
            color={gearColorClass}
            reverse={true}
            onClick={onToggle}
          />
        </div>
      )}

      {/* Input Wrapper (Slides out when active) */}
      <div
        className={`relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden ${
          isActive
            ? 'flex-1 opacity-100 translate-x-0'
            : `w-0 opacity-0 ${isRight ? 'translate-x-10' : '-translate-x-10'}`
        }`}
      >
        <div className="relative group/field m-[6px]">
          <div className={`absolute -inset-[2px] rounded-xl overflow-hidden pointer-events-none z-0`}>
            <div className={`absolute inset-0 ${isActive ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 ${isRight ? 'bg-pink-500' : 'bg-purple-500'} rounded-full blur-sm ${isRight ? 'shadow-pink-500/50' : 'shadow-purple-500/50'} shadow-2xl`}></div>
            </div>
          </div>
          <div className={`relative flex items-center bg-[#050505] backdrop-blur-md rounded-xl z-10 overflow-hidden ${containerShadowClass}`}>
            <div className={`absolute inset-0 opacity-40 ${innerGlowClass}`}></div>
            <input 
              placeholder={placeholder}
              className="w-full relative z-20 bg-transparent px-4 py-3.5 text-white placeholder-white/30 outline-none font-light tracking-wide focus:placeholder-white/50 transition-colors"
              type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
              value={value}
              name={name}
              required={isActive}
              onChange={onChange}
            />
            {/* Password Toggle Button */}
            {isPasswordField && isActive && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="relative z-30 p-2 mr-2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* If Variant RIGHT: Gear appears last */}
      {isRight && (
        <div className="w-10 flex justify-center perspective-500 shrink-0">
          <SpinningWheel
            spinning={isActive}
            color={gearColorClass}
            onClick={onToggle}
          />
        </div>
      )}
    </div>
  )
}
