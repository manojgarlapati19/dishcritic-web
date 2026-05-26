'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MapPin } from 'lucide-react'

interface CityCardProps {
  name: string
  state: string
  emoji: string
  restaurantCount: number
  className?: string
}

export function CityCard({ name, state, emoji, restaurantCount, className }: CityCardProps) {
  return (
    <Link
      href={`/search?city=${encodeURIComponent(name)}`}
      className={cn(
        'group flex items-center gap-4 p-4 rounded-lg border border-brown-muted/10 bg-cream hover:bg-cream-dark hover:border-saffron/30 transition-all shadow-sm',
        className
      )}
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink group-hover:text-saffron transition-colors truncate">
          {name}
        </h3>
        <p className="text-xs text-brown-muted">{state}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-brown-muted">
        <MapPin className="w-3 h-3" />
        <span>{restaurantCount}</span>
      </div>
    </Link>
  )
}
