'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import RequireActive from '@/app/components/RequireActive'

const publicPaths = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password'])

export default function RequireActiveWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (publicPaths.has(pathname)) {
    return <>{children}</>
  }

  return <RequireActive>{children}</RequireActive>
}
