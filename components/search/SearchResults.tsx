'use client'

import { cn } from '@/lib/utils'
import { DishCard } from '@/components/dish/DishCard'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchIcon, AlertCircle } from 'lucide-react'
import type { Dish, Restaurant } from '@/types'

interface SearchResultsProps {
  results: (Dish & { restaurant?: Restaurant })[]
  loading: boolean
  error: string | null
  query: string
  className?: string
}

export function SearchResults({
  results,
  loading,
  error,
  query,
  className,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-brown-muted/10">
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-brown-muted">Something went wrong. Please try again.</p>
      </div>
    )
  }

  if (!query) {
    return (
      <div className={cn('text-center py-12', className)}>
        <SearchIcon className="w-12 h-12 text-brown-muted/40 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-ink mb-1">Search for a dish</h3>
        <p className="text-brown-muted text-sm">
          Try searching for &ldquo;Biryani&rdquo;, &ldquo;Masala Dosa&rdquo;, or any dish you love
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <SearchIcon className="w-12 h-12 text-brown-muted/40 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-ink mb-1">No dishes found</h3>
        <p className="text-brown-muted text-sm">
          No results for &ldquo;{query}&rdquo;. Try a different dish name or adjust your filters.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm text-brown-muted mb-2">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>
      {results.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  )
}
