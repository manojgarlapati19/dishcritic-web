'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  className?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

const labelMap: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
  6: 'Outstanding',
  7: 'Amazing',
  8: 'Superb',
  9: 'Brilliant',
  10: 'Perfect',
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const displayValue = hovered ?? value

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
          const filled = star <= displayValue
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onMouseEnter={() => !readOnly && setHovered(star)}
              onMouseLeave={() => !readOnly && setHovered(null)}
              onClick={() => onChange?.(star)}
              className={cn(
                'transition-all',
                !readOnly && 'cursor-pointer hover:scale-110',
                readOnly && 'cursor-default'
              )}
              aria-label={`Rate ${star} out of 10`}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  'transition-colors',
                  filled
                    ? 'fill-saffron text-saffron'
                    : 'fill-none text-brown-muted/40'
                )}
              />
            </button>
          )
        })}
      </div>
      {displayValue > 0 && (
        <span className="text-xs text-brown-muted font-medium">
          {labelMap[displayValue]} — {displayValue}/10
        </span>
      )}
    </div>
  )
}
