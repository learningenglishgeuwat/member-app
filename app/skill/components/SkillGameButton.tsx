'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2 } from 'lucide-react'

export default function SkillGameButton() {
  const pathname = usePathname()

  // Hide button on the target page itself.
  if (pathname === '/skill/game-links') {
    return null
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      <Link
        href="/skill/game-links"
        aria-label="Open Games Links"
        title="Games Links"
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/60 bg-black/70 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.45)] backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-fuchsia-300/70 hover:text-fuchsia-300 hover:shadow-[0_0_24px_rgba(232,121,249,0.55)]"
      >
        <Gamepad2 className="h-6 w-6" />
      </Link>
    </div>
  )
}

