'use client'

import Link from '../../components/HoverPrefetchLink'
import { usePathname } from 'next/navigation'
import { Gamepad2, Volume2, VolumeX } from 'lucide-react'
import { useState } from 'react'
import { audioManager } from '../../../lib/audio/audioManager'

export default function SkillGameButton() {
  const pathname = usePathname()
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(!!audioManager.enabled)

  if (
    pathname?.startsWith('/dashboard') ||
    pathname === '/skill' ||
    pathname === '/skill/' ||
    pathname === '/skill/game-links'
  ) {
    return null
  }

  const toggleSfx = async () => {
    if (sfxEnabled) {
      audioManager.disable()
      setSfxEnabled(false)
    } else {
      audioManager.enable()
      try { await audioManager.resume() } catch {}
      // play a small confirmation tap
      try { audioManager.playTap() } catch {}
      setSfxEnabled(true)
    }
  }

  return (
    <div className="fixed left-0 top-1/2 z-[90] -translate-y-1/2 translate-y-8">
      <Link prefetch={false}
        href="/skill/game-links"
        aria-label="Open Games Links"
        title="Games Links"
        className="group flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/60 bg-black/70 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.25)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300/70 hover:text-fuchsia-300 hover:shadow-[0_0_12px_rgba(232,121,249,0.35)]"
      >
        <Gamepad2 className="h-2 w-2" />
      </Link>
    </div>
  )
}
