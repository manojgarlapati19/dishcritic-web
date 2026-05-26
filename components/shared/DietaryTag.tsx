'use client'

import { cn } from '@/lib/utils'

interface DietaryTagProps {
  type: 'veg' | 'non-veg' | 'jain' | 'halal'
  className?: string
}

const dietaryConfig = {
  veg: {
    label: 'Veg',
    icon: '🟢',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  'non-veg': {
    label: 'Non-Veg',
    icon: '🔴',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  jain: {
    label: 'Jain',
    icon: '🟡',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  halal: {
    label: 'Halal',
    icon: '🟢',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
}

export function DietaryTag({ type, className }: DietaryTagProps) {
  const config = dietaryConfig[type]
  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
