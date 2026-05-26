'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/utils'
import { StarRating } from './StarRating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, Flag } from 'lucide-react'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <div className={cn('p-4 rounded-lg border border-brown-muted/10 bg-cream', className)}>
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <Avatar className="w-9 h-9">
          <AvatarImage src={review.user?.avatar_url} />
          <AvatarFallback className="text-xs">
            {review.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-medium text-sm text-ink">
                {review.user?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-brown-muted ml-2">
                {timeAgo(review.created_at)}
              </span>
            </div>
            <StarRating value={review.rating} size="sm" readOnly />
          </div>

          {/* Tags */}
          {review.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {review.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Review Text */}
          {review.text && (
            <p className="mt-2 text-sm text-ink/80 leading-relaxed">{review.text}</p>
          )}

          {/* Photo */}
          {review.photo_url && (
            <Image
              src={review.photo_url}
              alt="Review photo"
              className="mt-2 rounded-lg max-h-48 object-cover"
              width={500}
              height={300}
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button className="flex items-center gap-1 text-xs text-brown-muted hover:text-saffron transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{review.helpful_count}</span>
            </button>
            <button className="flex items-center gap-1 text-xs text-brown-muted hover:text-red-500 transition-colors">
              <Flag className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
            {review.is_verified && (
              <Badge variant="success" className="text-[10px] px-1.5 py-0 ml-auto">
                Verified Visit
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
