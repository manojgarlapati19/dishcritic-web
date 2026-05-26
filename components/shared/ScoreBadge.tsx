'use client'

import { cn } from '@/lib/utils'
import { getScoreColour } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

export function ScoreBadge({ score, size = 'md', showLabel = false, className }: ScoreBadgeProps) {
  const color = getScoreColour(score)

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-bold font-sans',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: `${color}18`, color }}
      title={`Score: ${score.toFixed(1)}`}
    >
      {score.toFixed(1)}
      {showLabel && <span className="text-[0.5em] ml-0.5 opacity-70">/10</span>}
    </div>
  )
}
