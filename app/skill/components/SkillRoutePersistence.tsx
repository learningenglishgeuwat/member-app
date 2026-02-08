'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const LAST_SKILL_PATH_KEY = 'lastSkillPath'

export default function SkillRoutePersistence() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!pathname.startsWith('/skill')) return

    if (pathname === '/skill') {
      const lastPath = localStorage.getItem(LAST_SKILL_PATH_KEY)
      if (lastPath && lastPath.startsWith('/skill/') && lastPath !== pathname) {
        router.replace(lastPath)
      }
      return
    }

    localStorage.setItem(LAST_SKILL_PATH_KEY, pathname)
  }, [pathname, router])

  return null
}
