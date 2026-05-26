'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export function useSupabase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return {
    supabase,
    loading,
    setLoading,
    error,
    setError,
  }
}
