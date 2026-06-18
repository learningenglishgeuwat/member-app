'use client'

import React from 'react'
import { GlobalGestureToggle } from './GlobalGestureToggle'

interface GlobalGestureWrapperProps {
  children?: React.ReactNode
}

export const GlobalGestureWrapper = ({ children }: GlobalGestureWrapperProps) => {
  return (
    <>
      <GlobalGestureToggle />
      {children}
    </>
  )
}
