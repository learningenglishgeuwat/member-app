'use client'

import React from 'react'
import RequireActive from '@/app/components/RequireActive'
import SkillRoutePersistence from './components/SkillRoutePersistence'

export default function SkillLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireActive>
      <SkillRoutePersistence />
      {children}
    </RequireActive>
  )
}
