'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface DishScoreProps {
  score: number
  reviewCount: number
  size?: 'sm' | 'md' | 'lg'
  showBar?: boolean
  className?: string
}

const sizeMap = {
  sm: { star: 14, text: 'text-sm', score: 'text-lg', count: 'text-xs' },
  md: { star: 18, text: 'text-base', score: 'text-2xl', count: 'text-sm' },
  lg: { star: 24, text: 'text-lg', score: 'text-3xl', count: 'text-base' },
}

export function DishScore({ score, reviewCount, size = 'md', showBar = true, className }: DishScoreProps) {
  const s = sizeMap[size]
  const percentage = (score / 10) * 100
  const color = score >= 9 ? '#2E7D32' : score >= 7 ? '#C8702A' : score >= 5 ? '#F59E0B' : '#C0392B'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex flex-col items-center">
        <span className={cn('font-bold leading-none', s.score)} style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className={cn('text-brown-muted', s.text)}>/10</span>
      </div>

      {showBar && (
        <div className="flex-1 max-w-[120px]">
          <div className="h-2 rounded-full bg-cream-dark overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className={cn('fill-yellow-500 text-yellow-500', s.star)} size={s.star} />
            <span className={cn('text-brown-muted', s.count)}>
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
