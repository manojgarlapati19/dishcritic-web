'use client'

import { cn } from '@/lib/utils'
import { DishCard } from './DishCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Dish, Restaurant } from '@/types'

interface DishLeaderboardProps {
  title: string
  subtitle?: string
  dishes: (Dish & { restaurant?: Restaurant })[]
  showViewAll?: boolean
  className?: string
}

export function DishLeaderboard({
  title,
  subtitle,
  dishes,
  showViewAll = true,
  className,
}: DishLeaderboardProps) {
  return (
    <section className={cn('space-y-4', className)}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        action={
          showViewAll && (
            <Button variant="ghost" size="sm" className="gap-1 text-saffron">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          )
        }
      />
      <div className="space-y-3">
        {dishes.map((dish, index) => (
          <div key={dish.id} className="flex items-start gap-3">
            <span
              className={cn(
                'text-lg font-bold font-serif flex-shrink-0 w-8 text-center pt-4',
                index === 0
                  ? 'text-yellow-500'
                  : index === 1
                  ? 'text-gray-400'
                  : index === 2
                  ? 'text-amber-600'
                  : 'text-brown-muted'
              )}
            >
              #{index + 1}
            </span>
            <DishCard dish={dish} className="flex-1" />
          </div>
        ))}
      </div>
    </section>
  )
}
