'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const LAST_SKILL_PATH_KEY = 'lastSkillPath'
const AUTO_RESUME_KEY = 'skillAutoResume'

function isHeavySkillPath(path: string) {
  return path.startsWith('/skill/pronunciation/phoneticSymbols/')
}

export default function SkillRoutePersistence() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!pathname.startsWith('/skill')) return

    if (pathname === '/skill') {
      const autoResume = localStorage.getItem(AUTO_RESUME_KEY)
      if (autoResume === 'off') return

      const lastPath = localStorage.getItem(LAST_SKILL_PATH_KEY)
      if (
        lastPath &&
        lastPath.startsWith('/skill/') &&
        lastPath !== pathname &&
        !isHeavySkillPath(lastPath)
      ) {
        router.replace(lastPath)
      }
      return
    }

    if (!isHeavySkillPath(pathname)) {
      localStorage.setItem(LAST_SKILL_PATH_KEY, pathname)
    }
  }, [pathname, router])

  return null
}
