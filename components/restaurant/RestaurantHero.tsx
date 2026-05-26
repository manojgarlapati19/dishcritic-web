'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Phone, Share2 } from 'lucide-react'
import type { Restaurant } from '@/types'

interface RestaurantHeroProps {
  restaurant: Restaurant
  className?: string
}

export function RestaurantHero({ restaurant, className }: RestaurantHeroProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Cover Image */}
      <div className="h-48 sm:h-64 rounded-xl overflow-hidden bg-cream-dark">
        {restaurant.photo_urls?.[0] ? (
          <Image
            src={restaurant.photo_urls[0]}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            width={1200}
            height={400}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Info Overlay */}
      <div className="mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">{restaurant.name}</h1>
              {restaurant.is_verified && (
                <Badge variant="success">✓ Verified</Badge>
              )}
            </div>
            <p className="text-brown-muted flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {restaurant.address}
            </p>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Details Row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-brown-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{restaurant.hours?.today || 'Open now'}</span>
          </div>
          {restaurant.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <span>{restaurant.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{'₹'.repeat(restaurant.price_range)}</span>
          </div>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {restaurant.cuisine_type.map((cuisine) => (
            <Badge key={cuisine} variant="secondary">
              {cuisine}
            </Badge>
          ))}
        </div>

        {restaurant.description && (
          <p className="mt-4 text-ink/80 leading-relaxed">{restaurant.description}</p>
        )}
      </div>
    </div>
  )
}
