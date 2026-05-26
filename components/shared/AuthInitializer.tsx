'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function AuthInitializer() {
  const initializeAuth = useStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return null
}
