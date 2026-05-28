'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, ArrowRight, Star, TrendingUp, Award, MapPin, ChevronRight, Quote, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCities, getTopRatedDishes, getTrendingDishes, getPlatformStats } from '@/lib/queries'
import type { City, Dish, Restaurant } from '@/types'
import { useStore } from '@/store/useStore'

/* ───────────── Intersection Observer hook ───────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function FadeUpSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useFadeIn()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

const QUICK_DISHES = ['Biryani', 'Butter Chicken', 'Masala Dosa', 'Vada Pav', 'Chole Bhature']

const MARQUEE_ITEMS = [
  '4.2 Lakh Dishes Reviewed',
  '47 Indian Cities',
  '18,000+ Restaurants',
  'Dish-Level Search — Only on DishCritic',
  '2.1 Lakh Verified Reviewers',
]

const DEFAULT_TRENDING = [
  { emoji: '🍛', name: 'Hyderabadi Dum Biryani', city: 'Hyderabad', score: 9.4, reviews: 4200, badge: '🔥 Viral', dietary: 'non-veg' as const },
  { emoji: '🥞', name: 'Masala Dosa', city: 'Bengaluru', score: 9.6, reviews: 5600, badge: '🏆 Top Rated', dietary: 'veg' as const },
  { emoji: '🍗', name: 'Butter Chicken', city: 'Delhi', score: 9.1, reviews: 3400, badge: '📈 Rising', dietary: 'non-veg' as const },
  { emoji: '🫓', name: 'Chole Bhature', city: 'Delhi', score: 8.8, reviews: 2100, badge: '✨ New', dietary: 'veg' as const },
]

const DEFAULT_LEADERBOARD = [
  { rank: 1, emoji: '👑', name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, reviews: 4200 },
  { rank: 2, emoji: '🔥', name: 'Chicken Biryani', restaurant: 'Bawarchi', score: 8.9, reviews: 3100 },
  { rank: 3, emoji: '⭐', name: 'Mutton Biryani', restaurant: 'Shadab Restaurant', score: 8.7, reviews: 2800 },
  { rank: 4, emoji: '💛', name: 'Veg Biryani', restaurant: 'Pista House', score: 8.4, reviews: 1950 },
  { rank: 5, emoji: '🌿', name: 'Chicken Dum Biryani', restaurant: 'Cafe Bahar', score: 8.2, reviews: 1700 },
]

const DEFAULT_CITIES: CityEmoji[] = [
  { emoji: '🕌', name: 'Hyderabad', restaurantCount: 1240 },
  { emoji: '🌆', name: 'Mumbai', restaurantCount: 3200 },
  { emoji: '🌿', name: 'Bengaluru', restaurantCount: 2500 },
  { emoji: '🏛️', name: 'Delhi', restaurantCount: 2800 },
  { emoji: '🐟', name: 'Chennai', restaurantCount: 1800 },
  { emoji: '🎨', name: 'Kolkata', restaurantCount: 1500 },
]

interface CityEmoji {
  emoji: string
  name: string
  restaurantCount: number
}

const CITY_EMOJIS: Record<string, string> = {
  'Mumbai': '🌆',
  'Hyderabad': '🕌',
  'Bengaluru': '🌿',
  'Delhi': '🏛️',
  'Chennai': '🐟',
  'Kolkata': '🎨',
  'Pune': '🏗️',
  'Ahmedabad': '🏛️',
  'Jaipur': '🏯',
  'Lucknow': '🕌',
}

const REVIEWS = [
  {
    quote: 'Finally, a platform that understands food is about dishes, not just restaurants. I found the best biryani in my city within seconds.',
    name: 'Arjun Mehta',
    initial: 'AM',
    taste: 'Biryani Connoisseur',
    stars: 5,
    dish: 'Hyderabadi Biryani',
  },
  {
    quote: 'The dish-level rankings are a game changer. No more guesswork — I know exactly where to go for the perfect Masala Dosa.',
    name: 'Priya Sharma',
    initial: 'PS',
    taste: 'South Indian Lover',
    stars: 5,
    dish: 'Masala Dosa',
  },
  {
    quote: 'As someone who travels across India for work, DishCritic has become my go-to. Every city, every dish — ranked and reviewed.',
    name: 'Rahul Joshi',
    initial: 'RJ',
    taste: 'Street Food Explorer',
    stars: 4,
    dish: 'Pani Puri',
  },
]

const HOW_IT_WORKS = [
  { number: '01', icon: '🔍', title: 'Search any dish', desc: 'Type any dish — Biryani, Dosa, Butter Chicken — and instantly see every restaurant serving it, ranked by dish score.' },
  { number: '02', icon: '📊', title: 'Read dish-level reviews', desc: 'Dive into scores and reviews for that specific dish alone — not the restaurant\'s overall rating. Pure, focused feedback.' },
  { number: '03', icon: '✍️', title: 'Share your review', desc: 'Had an amazing dish? Rate it. Help others discover the best plates in your city. Your taste buds do the ranking.' },
]

/* ───────────── Component ───────────── */
export default function HomePage() {
  const [cities, setCities] = useState<CityEmoji[]>([])
  const [trending, setTrending] = useState(DEFAULT_TRENDING)
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD)
  const [stats, setStats] = useState({ dishCount: 0, cityCount: 0, restaurantCount: 0, reviewerCount: 0 })
  const [loading, setLoading] = useState(true)
  const { setSearchQuery } = useStore()
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedCities, topDishes, trendingDishes, platformStats] = await Promise.all([
          getCities(),
          getTopRatedDishes(5),
          getTrendingDishes(4),
          getPlatformStats(),
        ])

        // Cities
        if (fetchedCities.length > 0) {
          setCities(
            fetchedCities.map((c: City) => ({
              emoji: CITY_EMOJIS[c.name] || '🌍',
              name: c.name,
              restaurantCount: c.restaurant_count,
            }))
          )
        } else {
          setCities(DEFAULT_CITIES)
        }

        // Trending dishes
        if (trendingDishes.length > 0) {
          setTrending(
            trendingDishes.map((d: Dish & { restaurant: Restaurant }) => ({
              emoji: d.is_veg ? '🥗' : '🍛',
              name: d.name,
              city: d.restaurant?.city?.name || 'Unknown',
              score: d.score,
              reviews: d.review_count,
              badge: d.score >= 9 ? '🔥 Viral' : d.score >= 8.5 ? '🏆 Top Rated' : d.review_count > 100 ? '📈 Rising' : '✨ New',
              dietary: d.is_veg ? 'veg' as const : 'non-veg' as const,
            }))
          )
        }

        // Top rated / leaderboard
        if (topDishes.length > 0) {
          setLeaderboard(
            topDishes.map((d: Dish & { restaurant: Restaurant }, i) => ({
              rank: i + 1,
              emoji: ['👑', '🔥', '⭐', '💛', '🌿'][i] || '🍽️',
              name: d.name,
              restaurant: d.restaurant?.name || 'Unknown',
              score: d.score,
              reviews: d.review_count,
            }))
          )
        }

        // Stats
        setStats({
          dishCount: platformStats.dishCount || 420000,
          cityCount: platformStats.cityCount || 47,
          restaurantCount: platformStats.restaurantCount || 18000,
          reviewerCount: platformStats.reviewerCount || 210000,
        })
      } catch (err) {
        console.error('Error fetching homepage data:', err)
        setCities(DEFAULT_CITIES)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatStat = (n: number): string => {
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
    if (n >= 1000) return Math.floor(n / 1000) + 'K'
    return String(n)
  }

  const STATS_DISPLAY = [
    { value: '4.2L', label: 'Dishes Reviewed' },
    { value: '47+', label: 'Indian Cities' },
    { value: '18K', label: 'Restaurants' },
    { value: '2.1L', label: 'Verified Reviewers' },
  ]

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}&city=Hyderabad`
    }
  }

  const totalCities = cities.length > 0 ? cities : DEFAULT_CITIES

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-10 bg-[#F5EDD9] rounded-xl" />
          <div className="h-6 bg-[#F5EDD9] rounded-lg w-64" />
          <div className="h-48 bg-[#F5EDD9] rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-[#F5EDD9] rounded-xl" />
            <div className="h-40 bg-[#F5EDD9] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* ═══════ 1. HERO ═══════ */}
      <FadeUpSection>
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-gradient-radial from-saffron/5 via-transparent to-transparent pointer-events-none" />

          <div className="absolute right-0 top-0 bottom-0 w-[45%] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1E1208 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-20 lg:py-0">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide">
                  <Star className="w-3.5 h-3.5" />
                  India&apos;s dish-first review platform
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
                  Find India&apos;s Best Dishes,
                  <br />
                  <span className="text-saffron">Not Just Restaurants</span>
                </h1>

                <p className="text-brown-muted text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                  Search any dish. Get ranked results by that specific dish across every restaurant in your city. {formatStat(stats.dishCount)} dish reviews across {stats.cityCount} cities.
                </p>

                <div className="flex items-center gap-2 max-w-xl mx-auto lg:mx-0 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all"
                    />
                  </div>
                  <Button onClick={handleSearch} className="h-12 px-6 rounded-xl bg-saffron hover:bg-saffron-light text-cream font-semibold text-sm gap-1.5 shrink-0 transition-all">
                    Search
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                  <span className="text-xs text-brown-muted mr-1">Popular:</span>
                  {QUICK_DISHES.map((dish) => (
                    <button
                      key={dish}
                      onClick={() => { setSearchQuery(dish); window.location.href = `/search?q=${encodeURIComponent(dish)}&city=Hyderabad` }}
                      className="px-3 py-1 rounded-full border border-brown-muted/15 text-xs text-brown-muted hover:border-saffron/40 hover:text-saffron hover:bg-saffron/5 transition-all"
                    >
                      {dish}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 hidden lg:block relative">
                <div className="relative w-full max-w-md mx-auto h-[500px]">
                  {trending.slice(0, 3).map((dish, i) => (
                    <div
                      key={dish.name}
                      className={`absolute p-5 rounded-2xl bg-cream border border-brown-muted/10 shadow-xl shadow-brown-muted/5 hover:-translate-y-1 transition-all duration-500`}
                      style={{
                        top: `${[5, 30, 5][i]}%`,
                        right: `${[5, 0, 15][i]}%`,
                        bottom: i === 2 ? '5%' : undefined,
                        left: i === 1 ? '0%' : undefined,
                        width: '18rem',
                        animationDelay: `${i * 75}ms`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-brown-muted uppercase tracking-wider mb-0.5">{dish.city}</p>
                          <h3 className="font-serif text-lg font-semibold text-ink">{dish.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 bg-saffron/10 px-2 py-1 rounded-lg">
                          <span className="text-saffron font-bold font-sans text-sm">{dish.score.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brown-muted">
                        <span>{'⭐'.repeat(Math.min(5, Math.ceil(dish.score / 2)))}</span>
                        <span>{dish.reviews >= 1000 ? (dish.reviews / 1000).toFixed(1) + 'K' : dish.reviews} reviews</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 2. SCROLLING MARQUEE ═══════ */}
      <FadeUpSection>
        <section className="border-t border-b border-brown-muted/10 bg-cream-darker py-4 overflow-hidden">
          <div className="overflow-hidden whitespace-nowrap">
            <div className="inline-flex items-center gap-12 animate-marquee-new py-1">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className="flex items-center gap-12">
                  <span className="text-sm font-medium text-brown-muted tracking-wide">{item}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron/40" />
                </span>
              ))}
            </div>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 3. STATS ROW ═══════ */}
      <FadeUpSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS_DISPLAY.map((stat, i) => (
              <div key={stat.label} className="relative group text-center py-6 px-4">
                {i > 0 && <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-px bg-brown-muted/10" />}
                <h3 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-1">{stat.value}</h3>
                <p className="text-xs text-brown-muted uppercase tracking-widest font-medium">{stat.label}</p>
                <div className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 4. LEADERBOARD ═══════ */}
      <FadeUpSection>
        <section className="bg-cream-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Top Rated</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink text-center mb-8">Best Dishes Right Now</h2>

            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3 space-y-1">
                {leaderboard.map((item, i) => (
                  <a
                    key={item.rank}
                    href={`/search?q=${encodeURIComponent(item.name)}`}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <span className="font-serif text-2xl font-bold text-ink/30 w-8 text-center">{item.rank}</span>
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg font-semibold text-ink truncate">{item.name}</h4>
                      <p className="text-xs text-brown-muted truncate">{item.restaurant}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <span className="text-saffron font-bold font-sans text-lg">{item.score.toFixed(1)}</span>
                        <span className="text-xs text-brown-muted">/10</span>
                      </div>
                      <p className="text-xs text-brown-muted">{item.reviews.toLocaleString()} reviews</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brown-muted/0 group-hover:text-saffron transition-all" />
                  </a>
                ))}
              </div>

              <div className="lg:col-span-2 lg:sticky lg:top-24">
                <div className="rounded-2xl bg-cream border border-brown-muted/10 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                  <div className="h-48 bg-gradient-to-br from-saffron/20 via-cream-darker to-saffron/10 flex items-center justify-center">
                    <span className="text-6xl">👑</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs text-saffron font-semibold uppercase tracking-wider">#1 Top Rated</p>
                      <h3 className="font-serif text-2xl font-bold text-ink mt-1">{leaderboard[0]?.name || 'Top Dish'}</h3>
                      <p className="text-sm text-brown-muted">{leaderboard[0]?.restaurant || ''} · Hyderabad</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Score', value: (leaderboard[0]?.score || 9.4).toFixed(1) + '/10' },
                        { label: 'Reviews', value: (leaderboard[0]?.reviews || 4200).toLocaleString() },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-cream-dark rounded-lg p-3 text-center">
                          <p className="font-serif text-lg font-bold text-ink">{stat.value}</p>
                          <p className="text-xs text-brown-muted">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    <a href={`/search?q=${encodeURIComponent(leaderboard[0]?.name || 'Biryani')}`}>
                      <Button className="w-full bg-saffron hover:bg-saffron-light text-cream gap-2">
                        Find Where to Eat It
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 5. TRENDING DISHES ═══════ */}
      <FadeUpSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">🔥 What&apos;s Hot</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Trending Dishes This Week</h2>
            </div>
            <Button variant="ghost" size="sm" className="hidden sm:flex text-saffron gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((dish) => (
              <a
                key={dish.name}
                href={`/search?q=${encodeURIComponent(dish.name)}&city=${encodeURIComponent(dish.city)}`}
                className="group relative rounded-2xl border border-brown-muted/10 bg-cream overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-saffron/15 via-cream-darker to-cream-dark flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant={dish.badge.includes('Viral') || dish.badge.includes('Top') ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                      {dish.badge}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{dish.name}</h3>
                    <p className="text-xs text-brown-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {dish.city}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={dish.dietary === 'veg' ? 'veg' : 'nonveg'} className="text-[10px] px-1.5 py-0">
                        {dish.dietary === 'veg' ? 'Veg' : 'Non-Veg'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-saffron font-bold font-sans">{dish.score.toFixed(1)}</span>
                      <span className="text-xs text-brown-muted">/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-brown-muted">{dish.reviews >= 1000 ? (dish.reviews / 1000).toFixed(1) + 'K' : dish.reviews} reviews</p>
                </div>
              </a>
            ))}
          </div>

          <div className="flex sm:hidden justify-center mt-6">
            <Button variant="ghost" size="sm" className="text-saffron gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 6. CITY PICKER ═══════ */}
      <FadeUpSection>
        <section className="bg-cream-darker py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Explore</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Pick Your City</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {totalCities.map((city) => (
                <a
                  key={city.name}
                  href={`/search?city=${encodeURIComponent(city.name)}`}
                  className="group text-center p-6 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{city.emoji}</span>
                  <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{city.name}</h3>
                  <p className="text-xs text-brown-muted mt-1">{city.restaurantCount.toLocaleString()} restaurants</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 7. HOW IT WORKS ═══════ */}
      <FadeUpSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Simple Process</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-brown-muted/10 rounded-2xl overflow-hidden">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="relative bg-cream p-8 sm:p-10 hover:bg-cream-dark transition-colors duration-500 group">
                <span className="absolute top-4 right-6 font-serif text-7xl sm:text-8xl font-bold text-ink/[0.04] select-none pointer-events-none">
                  {step.number}
                </span>
                <span className="text-4xl mb-4 block">{step.icon}</span>
                <span className="text-xs font-semibold text-saffron uppercase tracking-wider">{step.number}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-1 mb-3">{step.title}</h3>
                <p className="text-sm text-brown-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 8. REVIEW CARDS ═══════ */}
      <FadeUpSection>
        <section className="bg-cream-darker py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Testimonials</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">What Foodies Are Saying</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {REVIEWS.map((review) => (
                <div key={review.name} className="group relative bg-cream rounded-2xl border border-brown-muted/10 p-6 sm:p-8 hover:shadow-lg transition-all duration-500">
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                  <Quote className="w-10 h-10 text-saffron/20 mb-4" />
                  <Badge variant="outline" className="mb-4 text-xs border-saffron/20 text-saffron bg-saffron/5">
                    {review.dish}
                  </Badge>
                  <p className="font-serif italic text-base sm:text-lg text-ink leading-relaxed mb-6">&ldquo;{review.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-brown-muted/10">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-saffron">{review.initial}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{review.name}</p>
                      <p className="text-xs text-brown-muted">{review.taste}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.stars ? 'text-saffron fill-saffron' : 'text-brown-muted/20'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeUpSection>

      {/* ═══════ 9. CTA ═══════ */}
      <FadeUpSection>
        <section className="relative bg-ink py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
              Start Reviewing Your Favourite Dishes Today
            </h2>
            <p className="text-brown-muted text-lg mb-10">Free to join. Free forever.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/auth">
                <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20 hover:shadow-xl hover:shadow-saffron/30 transition-all">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50 px-8 py-6 text-base" asChild>
                <a href="/search">Browse as Guest</a>
              </Button>
            </div>
          </div>
        </section>
      </FadeUpSection>
    </div>
  )
}
