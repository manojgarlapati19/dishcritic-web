'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SlidersHorizontal, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useState } from 'react'
import type { SearchFilters as SearchFiltersType } from '@/types'

const cuisineOptions = [
  'North Indian',
  'South Indian',
  'Chinese',
  'Mughlai',
  'Street Food',
  'Continental',
  'Italian',
  'Thai',
]

const sortOptions = [
  { value: 'score' as const, label: 'Highest Rated' },
  { value: 'review_count' as const, label: 'Most Reviewed' },
  { value: 'price_asc' as const, label: 'Price: Low to High' },
  { value: 'price_desc' as const, label: 'Price: High to Low' },
]

interface SearchFiltersProps {
  className?: string
}

export function SearchFilters({ className }: SearchFiltersProps) {
  const { searchFilters, setSearchFilters } = useStore()
  const [showMobile, setShowMobile] = useState(false)

  const activeCount = [
    searchFilters.is_veg !== undefined,
    searchFilters.is_halal,
    searchFilters.min_score !== undefined,
    searchFilters.cuisine,
    searchFilters.price_range?.length,
  ].filter(Boolean).length

  const clearAll = () => {
    setSearchFilters({})
  }

  const toggleVeg = () => {
    setSearchFilters({
      ...searchFilters,
      is_veg: searchFilters.is_veg ? undefined : true,
    })
  }

  const toggleHalal = () => {
    setSearchFilters({
      ...searchFilters,
      is_halal: searchFilters.is_halal ? undefined : true,
    })
  }

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden gap-1.5"
        onClick={() => setShowMobile(!showMobile)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <Badge variant="default" className="ml-1 text-[10px] px-1.5">
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* Filter Content */}
      <div
        className={cn(
          'space-y-6',
          !showMobile && 'hidden lg:block',
          showMobile && 'block',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink text-sm">Filters</h3>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-saffron hover:text-saffron-light flex items-center gap-0.5"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        {/* Dietary */}
        <div>
          <h4 className="text-xs font-medium text-brown-muted uppercase tracking-wider mb-2">
            Dietary
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={toggleVeg}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                searchFilters.is_veg
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-cream text-brown-muted border-brown-muted/30 hover:border-green-300'
              )}
            >
              🟢 Veg Only
            </button>
            <button
              onClick={toggleHalal}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                searchFilters.is_halal
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                  : 'bg-cream text-brown-muted border-brown-muted/30 hover:border-emerald-300'
              )}
            >
              Halal
            </button>
          </div>
        </div>

        {/* Minimum Score */}
        <div>
          <h4 className="text-xs font-medium text-brown-muted uppercase tracking-wider mb-2">
            Minimum Score
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[5, 6, 7, 8, 9].map((score) => (
              <button
                key={score}
                onClick={() =>
                  setSearchFilters({
                    ...searchFilters,
                    min_score: searchFilters.min_score === score ? undefined : score,
                  })
                }
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                  searchFilters.min_score === score
                    ? 'bg-saffron text-cream border-saffron'
                    : 'bg-cream text-brown-muted border-brown-muted/30 hover:border-saffron/50'
                )}
              >
                {score}+
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-xs font-medium text-brown-muted uppercase tracking-wider mb-2">
            Sort By
          </h4>
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setSearchFilters({
                    ...searchFilters,
                    sort_by: searchFilters.sort_by === option.value ? undefined : option.value,
                  })
                }
                className={cn(
                  'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                  searchFilters.sort_by === option.value
                    ? 'bg-saffron/10 text-saffron font-medium'
                    : 'text-brown-muted hover:bg-cream-dark hover:text-ink'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
