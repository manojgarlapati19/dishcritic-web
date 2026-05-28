'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Award, TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, Star, MapPin, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/* ───────────── Types ───────────── */

interface LeaderboardEntry {
  rank: number
  name: string
  restaurant: string
  score: number
  reviews: number
}

interface WeeklyMover {
  name: string
  restaurant: string
  city: string
  score: number
  change: number // positive = up, negative = down
  direction: 'up' | 'down'
}

interface CategoryCard {
  category: string
  city: string
  topDish: string
  topRestaurant: string
  topScore: number
  second: string
  third: string
}

/* ───────────── Data ───────────── */

const CITIES = ['All India', 'Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai']
const CATEGORIES = ['All', 'Biryani', 'South Indian', 'Street Food', 'North Indian', 'Desserts', 'Seafood']

const CITY_CARDS: CategoryCard[] = [
  { category: 'Best Biryani', city: 'Hyderabad', topDish: 'Hyderabadi Dum Biryani', topRestaurant: 'Paradise Restaurant', topScore: 9.4, second: 'Shah Ghouse Cafe', third: 'Bawarchi' },
  { category: 'Best Dosa', city: 'Bengaluru', topDish: 'Masala Dosa', topRestaurant: 'MTR', topScore: 9.6, second: 'Vidyarthi Bhavan', third: 'CTR' },
  { category: 'Best Butter Chicken', city: 'Delhi', topDish: 'Butter Chicken', topRestaurant: 'Moti Mahal', topScore: 9.1, second: 'Gulati', third: 'Haldiram' },
  { category: 'Best Vada Pav', city: 'Mumbai', topDish: 'Vada Pav', topRestaurant: 'Ashok Vada Pav', topScore: 9.0, second: 'Kirti College', third: 'Anand' },
  { category: 'Best Filter Coffee', city: 'Chennai', topDish: 'Filter Coffee', topRestaurant: 'Saravana Bhavan', topScore: 8.9, second: 'Ratna Cafe', third: 'Sangeetha' },
  { category: 'Best Kathi Roll', city: 'Kolkata', topDish: 'Kathi Roll', topRestaurant: 'Nizam\'s', topScore: 8.8, second: 'Kusum Roll', third: 'Bedouin' },
  { category: 'Best Biryani', city: 'Bengaluru', topDish: 'Chicken Biryani', topRestaurant: 'Meghana Foods', topScore: 8.9, second: 'Donne Biryani', third: 'Nagavara' },
  { category: 'Best Pav Bhaji', city: 'Mumbai', topDish: 'Pav Bhaji', topRestaurant: 'Sardar Pav Bhaji', topScore: 9.2, second: 'Cannon Pav Bhaji', third: 'Shree' },
]

const WEEKLY_MOVERS: WeeklyMover[] = [
  { name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', city: 'Hyderabad', score: 9.4, change: 3, direction: 'up' },
  { name: 'Masala Dosa', restaurant: 'MTR', city: 'Bengaluru', score: 9.6, change: 1, direction: 'up' },
  { name: 'Pav Bhaji', restaurant: 'Sardar Pav Bhaji', city: 'Mumbai', score: 9.2, change: 2, direction: 'up' },
  { name: 'Chole Bhature', restaurant: 'Haldiram', city: 'Delhi', score: 8.7, change: 1, direction: 'down' },
  { name: 'Meen Curry', restaurant: 'Kayees', city: 'Kochi', score: 9.0, change: 4, direction: 'up' },
  { name: 'Kathi Roll', restaurant: 'Nizam\'s', city: 'Kolkata', score: 8.5, change: 1, direction: 'down' },
]

const CITY_EMOJIS: Record<string, string> = {
  'Hyderabad': '🕌',
  'Mumbai': '🌆',
  'Bengaluru': '🌿',
  'Delhi': '🏛️',
  'Chennai': '🐟',
  'Kolkata': '🎨',
}

/* ───────────── Component ───────────── */

export default function LeaderboardsPage() {
  const [selectedCity, setSelectedCity] = useState('All India')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredCards = CITY_CARDS.filter((card) => {
    if (selectedCity !== 'All India' && card.city !== selectedCity) return false
    if (selectedCategory !== 'All' && !card.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide">
              <Award className="w-3.5 h-3.5" />
              Updated Weekly
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-4">
              India&apos;s Best Dishes, <span className="text-saffron">Ranked</span>
            </h1>
            <p className="text-brown-muted text-base sm:text-lg leading-relaxed">
              Updated weekly from verified reviews. See which restaurants make the best dishes in every city.
            </p>
          </div>

          {/* City Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCity === city
                    ? 'bg-saffron text-cream shadow-sm'
                    : 'bg-cream-dark text-brown-muted hover:text-ink hover:bg-cream-darker border border-brown-muted/10'
                )}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORY FILTERS ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                selectedCategory === cat
                  ? 'bg-ink text-cream shadow-sm'
                  : 'bg-cream-dark text-brown-muted hover:text-ink border border-brown-muted/10'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════ LEADERBOARD CARDS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-dark border border-brown-muted/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-brown-muted/50" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ink mb-1">No leaderboards found</h3>
            <p className="text-sm text-brown-muted">Try a different city or category</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCards.map((card, i) => (
              <Link
                key={`${card.category}-${card.city}-${i}`}
                href={`/search?q=${encodeURIComponent(card.topDish)}&city=${encodeURIComponent(card.city)}`}
                className="group rounded-2xl bg-cream border border-brown-muted/10 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:border-saffron/30 transition-all duration-500"
              >
                {/* Header */}
                <div className="p-5 pb-3 border-b border-brown-muted/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-saffron uppercase tracking-wider">{card.category}</span>
                    <span className="flex items-center gap-1 text-xs text-brown-muted">
                      <MapPin className="w-3 h-3" />
                      {card.city}
                    </span>
                  </div>
                </div>

                {/* #1 */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-saffron flex items-center justify-center text-sm font-bold text-cream shrink-0">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">{card.topDish}</p>
                      <p className="text-xs text-brown-muted truncate">{card.topRestaurant}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-saffron font-bold font-sans text-base">{card.topScore.toFixed(1)}</span>
                      <span className="text-[10px] text-brown-muted">/10</span>
                    </div>
                  </div>

                  {/* #2 and #3 */}
                  <div className="space-y-2 pt-2 border-t border-brown-muted/5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-cream-dark flex items-center justify-center text-[10px] font-bold text-brown-muted shrink-0">2</span>
                      <span className="text-xs text-brown-muted truncate">{card.second}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-cream-dark flex items-center justify-center text-[10px] font-bold text-brown-muted shrink-0">3</span>
                      <span className="text-xs text-brown-muted truncate">{card.third}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full mt-1 text-saffron hover:text-saffron hover:bg-saffron/5 gap-1 text-xs">
                    View Full Leaderboard
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ WEEKLY MOVERS ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">
                <Flame className="w-3.5 h-3.5 inline mr-1" />
                Trending
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">This Week&apos;s Biggest Movers</h2>
              <p className="text-brown-muted text-sm mt-1">Dishes climbing and falling in the rankings</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEEKLY_MOVERS.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-sm transition-all group"
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  item.direction === 'up' ? 'bg-green-100' : 'bg-red-100'
                )}>
                  {item.direction === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink truncate group-hover:text-saffron transition-colors">{item.name}</h3>
                    <span className={cn(
                      'text-xs font-bold shrink-0',
                      item.direction === 'up' ? 'text-green-600' : 'text-red-500'
                    )}>
                      {item.direction === 'up' ? '↑' : '↓'}{item.change}
                    </span>
                  </div>
                  <p className="text-xs text-brown-muted truncate">{item.restaurant} · {item.city}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-saffron font-bold font-sans">{item.score.toFixed(1)}</span>
                </div>

                <ChevronRight className="w-4 h-4 text-brown-muted/0 group-hover:text-saffron transition-all shrink-0" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="sm" className="text-brown-muted gap-1">
              View All Rankings <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative bg-ink py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream leading-tight mb-3">
            Your Favourite Dish Not Ranked Yet?
          </h2>
          <p className="text-brown-muted text-base mb-8">Be the first to review it and help the community discover the best</p>
          <Link href="/review/new">
            <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20">
              Write a Review
              <Star className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
