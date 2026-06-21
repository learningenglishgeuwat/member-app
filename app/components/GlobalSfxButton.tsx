"use client"

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { audioManager } from '../../lib/audio/audioManager'

export default function GlobalSfxButton() {
  const pathname = usePathname()
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(!!audioManager.enabled)

  // Hide on login page(s)
  if (!pathname) return null
  if (pathname.startsWith('/login')) return null

  const toggleSfx = async () => {
    if (sfxEnabled) {
      audioManager.disable()
      setSfxEnabled(false)
    } else {
      audioManager.enable()
      try { await audioManager.resume() } catch {}
      try { audioManager.playTap() } catch {}
      setSfxEnabled(true)
    }
  }

  return (
    <button
      type="button"
      aria-label={sfxEnabled ? 'Disable sound effects' : 'Enable sound effects'}
      title={sfxEnabled ? 'SFX: On' : 'SFX: Off'}
      onClick={toggleSfx}
      className="group flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center rounded-full border bg-[#1a1f24] backdrop-blur-sm transition-all duration-300 active:scale-95 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
    >
      {sfxEnabled ? <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" /> : <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />}
    </button>
  )
}
