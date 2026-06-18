'use client'

import Link from '../../components/HoverPrefetchLink'
import { usePathname } from 'next/navigation'
import { Gamepad2 } from 'lucide-react'

export default function SkillGameButton() {
  const pathname = usePathname()

  if (
    pathname?.startsWith('/dashboard') ||
    pathname === '/skill' ||
    pathname === '/skill/' ||
    pathname === '/skill/game-links'
  ) {
    return null
  }

  return (
    <div className="fixed left-0 top-[calc(50%_+_2rem)] z-[90] -translate-y-1/2">
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
