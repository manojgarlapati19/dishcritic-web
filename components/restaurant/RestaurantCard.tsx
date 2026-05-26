'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatScore } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Clock, Phone } from 'lucide-react'
import type { Restaurant } from '@/types'

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className={cn(
        'group block p-5 rounded-lg border border-brown-muted/10 bg-cream hover:bg-cream-dark hover:border-saffron/30 transition-all shadow-sm',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="w-20 h-20 rounded-lg bg-cream-darker flex-shrink-0 overflow-hidden">
          {restaurant.photo_urls?.[0] ? (
            <Image src={restaurant.photo_urls[0]} alt={restaurant.name} className="w-full h-full object-cover" width={80} height={80} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-ink group-hover:text-saffron transition-colors">
                {restaurant.name}
              </h3>
              <p className="text-sm text-brown-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className={cn(
                'text-lg font-bold',
                restaurant.overall_score >= 8 ? 'text-green-600' : restaurant.overall_score >= 6 ? 'text-saffron' : 'text-orange-500'
              )}>
                {formatScore(restaurant.overall_score)}
              </span>
              <span className="text-xs text-brown-muted">/10</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {restaurant.is_verified && (
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                ✓ Verified
              </Badge>
            )}
            {restaurant.cuisine_type.slice(0, 3).map((cuisine) => (
              <Badge key={cuisine} variant="secondary" className="text-[10px] px-1.5 py-0">
                {cuisine}
              </Badge>
            ))}
            <span className="text-xs text-brown-muted flex items-center gap-1">
              <Star className="w-3 h-3" />
              {restaurant.review_count} reviews
            </span>
            <span className="text-xs text-brown-muted">
              {'₹'.repeat(restaurant.price_range)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
