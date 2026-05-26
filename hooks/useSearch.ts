'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import type { Dish, Restaurant } from '@/types'

export function useSearch() {
  const [results, setResults] = useState<(Dish & { restaurant?: Restaurant })[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { searchQuery, searchFilters } = useStore()

  const search = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      let queryBuilder = supabase
        .from('dishes')
        .select('*, restaurant:restaurants(*)')
        .ilike('name', `%${query}%`)
        .eq('is_available', true)

      if (searchFilters.city) {
        queryBuilder = queryBuilder.eq('restaurant.city_id', searchFilters.city)
      }
      if (searchFilters.is_veg !== undefined) {
        queryBuilder = queryBuilder.eq('is_veg', searchFilters.is_veg)
      }
      if (searchFilters.is_halal !== undefined) {
        queryBuilder = queryBuilder.eq('is_halal', searchFilters.is_halal)
      }
      if (searchFilters.min_score !== undefined) {
        queryBuilder = queryBuilder.gte('score', searchFilters.min_score)
      }

      const sortField = searchFilters.sort_by === 'review_count' ? 'review_count' : 'score'
      queryBuilder = queryBuilder
        .order(sortField, { ascending: false })
        .limit(20)

      const { data, error: searchError } = await queryBuilder

      if (searchError) throw searchError
      setResults(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return {
    results,
    loading,
    error,
    search,
    setResults,
  }
}
