'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const TRENDING_DISHES = [
  { emoji: '🍛', name: 'Hyderabadi Dum Biryani', city: 'Hyderabad', restaurant: 'Paradise Restaurant', score: 9.4, reviews: 4200, badge: '🔥 Viral', tags: ['Non-Veg', 'Spicy'] },
  { emoji: '🥞', name: 'Masala Dosa', city: 'Bengaluru', restaurant: 'MTR', score: 9.6, reviews: 5600, badge: '🏆 Top Rated', tags: ['Veg'] },
  { emoji: '🍗', name: 'Butter Chicken', city: 'Delhi', restaurant: 'Motimahal', score: 9.1, reviews: 3400, badge: '📈 Rising', tags: ['Non-Veg'] },
  { emoji: '🫓', name: 'Chole Bhature', city: 'Delhi', restaurant: 'Sita Ram Diwan Chand', score: 8.8, reviews: 2100, badge: '✨ New', tags: ['Veg', 'Spicy'] },
  { emoji: '🥘', name: 'Pav Bhaji', city: 'Mumbai', restaurant: "Sardar's Pavilion", score: 9.0, reviews: 3800, badge: '🔥 Viral', tags: ['Veg'] },
  { emoji: '🍝', name: 'Chettinad Chicken', city: 'Chennai', restaurant: 'Annalakshmi', score: 8.7, reviews: 1600, badge: '📈 Rising', tags: ['Non-Veg', 'Spicy'] },
  { emoji: '🥟', name: 'Kolkata Kathi Roll', city: 'Kolkata', restaurant: 'Kusum Rolls', score: 8.9, reviews: 2200, badge: '✨ New', tags: ['Non-Veg'] },
  { emoji: '🫘', name: 'Dal Makhani', city: 'Delhi', restaurant: 'Bukhara', score: 9.2, reviews: 2900, badge: '🏆 Top Rated', tags: ['Veg'] },
  { emoji: '🍜', name: 'Hyderabadi Haleem', city: 'Hyderabad', restaurant: 'Pista House', score: 9.3, reviews: 1800, badge: '🔥 Viral', tags: ['Non-Veg', 'Spicy'] },
  { emoji: '🧋', name: 'Mumbai Cutting Chai', city: 'Mumbai', restaurant: 'Prakash Upahaar Kendra', score: 8.6, reviews: 1400, badge: '📈 Rising', tags: ['Veg'] },
  { emoji: '🥞', name: 'Rava Dosa', city: 'Bengaluru', restaurant: 'Vidyarthi Bhavan', score: 8.5, reviews: 2600, badge: '✨ New', tags: ['Veg'] },
  { emoji: '🦐', name: 'Goan Fish Curry', city: 'Goa', restaurant: 'Martin\'s Corner', score: 9.0, reviews: 1900, badge: '🏆 Top Rated', tags: ['Non-Veg'] },
]

export default function TrendingPage() {
  return (
    <div className="bg-cream text-ink">
      {/* ═══════ HEADER ═══════ */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide">
            <Flame className="w-3.5 h-3.5" />
            What&apos;s Hot Right Now
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-4">
            Trending Dishes Across India
          </h1>
          <p className="text-brown-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover the most popular dishes being talked about right now in cities across India.
          </p>
        </div>
      </section>

      {/* ═══════ TRENDING GRID ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TRENDING_DISHES.map((dish) => (
            <Link
              key={dish.name + dish.city}
              href={`/search?q=${encodeURIComponent(dish.name)}&city=${encodeURIComponent(dish.city)}`}
              className="group relative rounded-2xl border border-brown-muted/10 bg-cream overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              {/* Gradient background */}
              <div className="h-36 bg-gradient-to-br from-saffron/15 via-cream-dark to-cream-darker flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" />
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-saffron/5" />
                <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-saffron/8" />
                <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
                {/* Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="text-[10px] px-2 py-0.5 bg-saffron text-cream">{dish.badge}</Badge>
                </div>
              </div>
              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{dish.name}</h3>
                  <p className="text-xs text-brown-muted flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {dish.city} · {dish.restaurant}
                  </p>
                </div>
                {/* Tags */}
                <div className="flex gap-1.5">
                  {dish.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        tag === 'Veg' ? 'bg-green-100 text-green-700' :
                        tag === 'Non-Veg' ? 'bg-red-100 text-red-700' :
                        'bg-saffron/10 text-saffron'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Score & Reviews */}
                <div className="flex items-center justify-between pt-1 border-t border-brown-muted/10">
                  <div className="flex items-center gap-1">
                    <span className="text-saffron font-bold font-sans">{dish.score.toFixed(1)}</span>
                    <span className="text-xs text-brown-muted">/10</span>
                  </div>
                  <p className="text-xs text-brown-muted">
                    {dish.reviews >= 1000 ? (dish.reviews / 1000).toFixed(1) + 'K' : dish.reviews} reviews
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ═══════ CTA TO LEADERBOARDS ═══════ */}
        <div className="mt-14 text-center">
          <div className="max-w-lg mx-auto p-8 rounded-2xl bg-cream-dark border border-brown-muted/10">
            <h2 className="font-serif text-2xl font-bold text-ink mb-2">Want to See the Full Rankings?</h2>
            <p className="text-sm text-brown-muted mb-6">
              View comprehensive city-wise leaderboards and discover the best dishes in every category.
            </p>
            <Link href="/leaderboards">
              <Button className="bg-saffron hover:bg-saffron-light text-cream px-6 gap-2">
                Explore Leaderboards
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
