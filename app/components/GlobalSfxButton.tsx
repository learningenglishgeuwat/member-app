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
    <div className="fixed left-0 top-1/2 z-[100] -translate-y-1/2">
      <button
        type="button"
        aria-label={sfxEnabled ? 'Disable sound effects' : 'Enable sound effects'}
        title={sfxEnabled ? 'SFX: On' : 'SFX: Off'}
        onClick={toggleSfx}
        className="group flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/60 bg-black/70 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.25)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300/70 hover:text-fuchsia-300 hover:shadow-[0_0_12px_rgba(232,121,249,0.35)]"
      >
        {sfxEnabled ? <Volume2 className="h-2 w-2" /> : <VolumeX className="h-2 w-2" />}
      </button>
    </div>
  )
}
