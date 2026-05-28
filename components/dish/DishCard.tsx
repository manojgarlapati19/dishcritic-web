'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { ScoreBadge } from '@/components/shared/ScoreBadge'
import { DietaryTag } from '@/components/shared/DietaryTag'
import { MapPin } from 'lucide-react'
import type { Dish, Restaurant } from '@/types'

interface DishCardProps {
  dish: Dish & { restaurant?: Restaurant }
  className?: string
}

export function DishCard({ dish, className }: DishCardProps) {
  return (
    <Link
      href={`/dish/${dish.id}`}
      className={cn(
        'group block p-4 rounded-lg border border-brown-muted/10 bg-cream hover:bg-cream-dark hover:border-saffron/30 transition-all shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Dish Image Placeholder */}
        <div className="w-16 h-16 rounded-lg bg-cream-dark flex items-center justify-center flex-shrink-0 overflow-hidden">
          {dish.photo_url ? (
            <Image src={dish.photo_url} alt={dish.name} className="w-full h-full object-cover" width={64} height={64} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-4xl">
              🍽️
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-ink group-hover:text-saffron transition-colors truncate">
                {dish.name}
              </h3>
              {dish.restaurant && (
                <p className="text-sm text-brown-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {dish.restaurant.name}
                </p>
              )}
            </div>
            <ScoreBadge score={dish.score} size="sm" />
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <DietaryTag type={dish.is_veg ? 'veg' : 'non-veg'} />
            {dish.is_halal && <DietaryTag type="halal" />}
            {dish.is_jain && <DietaryTag type="jain" />}
            {dish.price && (
              <span className="text-xs text-brown-muted font-medium">
                {formatPrice(dish.price)}
              </span>
            )}
            <span className="text-xs text-brown-muted">
              {dish.review_count} {dish.review_count === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
