'use client'

import { cn } from '@/lib/utils'
import { DishCard } from '@/components/dish/DishCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import type { Dish, Restaurant } from '@/types'

interface MustOrderSectionProps {
  dishes: (Dish & { restaurant?: Restaurant })[]
  className?: string
}

export function MustOrderSection({ dishes, className }: MustOrderSectionProps) {
  if (!dishes.length) return null

  return (
    <section className={cn('space-y-4', className)}>
      <SectionHeader
        title="Must Order"
        subtitle="Top-rated dishes at this restaurant"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {dishes.slice(0, 6).map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  )
}
