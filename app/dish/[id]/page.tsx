'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Star, MapPin, Share2, ChevronRight, ThumbsUp,
  PenSquare, Filter, ChevronLeft, Flame, Award, Trophy,
  Bookmark, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getDish, getDishLeaderboard, getReviewsByDish } from '@/lib/queries'
import type { Dish, Restaurant, Review } from '@/types'
import { useParams } from 'next/navigation'

/* ───────────── Intersection Observer hook ───────────── */
function useFadeIn(threshold = 0.12) {
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

const DEFAULT_DISH_DATA = {
  id: '1',
  name: 'Hyderabadi Dum Biryani',
  is_veg: false,
  is_halal: true,
  is_jain: false,
  score: 9.4,
  review_count: 12400,
  price: 400,
  description: 'The iconic Hyderabadi Dum Biryani is a fragrant rice dish layered with marinated chicken or mutton, slow-cooked in a sealed handi (clay pot). Infused with saffron, cardamom, and rose water, each grain of basmati rice is separate yet bursting with flavour. A culinary masterpiece from the Nizami kitchens.',
  restaurant: { name: 'Paradise Restaurant', city: { name: 'Hyderabad' } },
  category: 'Biryani',
}

const DEFAULT_LEADERBOARD_DATA = [
  { id: '1', name: 'Paradise Restaurant', score: 9.4, review_count: 3241, price: 450, city: 'Hyderabad', area: 'Secunderabad' },
  { id: '2', name: 'Shah Ghouse Cafe', score: 9.2, review_count: 2108, price: 420, city: 'Hyderabad', area: 'Old City' },
  { id: '3', name: 'Bawarchi', score: 9.0, review_count: 1876, price: 380, city: 'Hyderabad', area: 'RTC Cross Roads' },
  { id: '4', name: 'Cafe Bahar', score: 8.9, review_count: 1543, price: 480, city: 'Hyderabad', area: 'Basheerbagh' },
  { id: '5', name: 'Shadab Hotel', score: 8.8, review_count: 1234, price: 400, city: 'Hyderabad', area: 'Old City' },
  { id: '6', name: 'Sarvi Restaurant', score: 8.7, review_count: 980, price: 350, city: 'Hyderabad', area: 'Malakpet' },
  { id: '7', name: 'Mehfil Restaurant', score: 8.6, review_count: 876, price: 520, city: 'Hyderabad', area: 'Banjara Hills' },
  { id: '8', name: 'Pista House', score: 8.5, review_count: 743, price: 430, city: 'Hyderabad', area: 'Nimboliadda' },
]

const LEADERBOARD_EMOJIS = ['👑', '🕌', '🔥', '🍛', '⭐', '🌿', '💛', '✨']

/* ───────────── Component ───────────── */
export default function DishPage() {
  const params = useParams()
  const id = params?.id as string

  const [dish, setDish] = useState<Dish | null>(null)
  const [leaderboard, setLeaderboard] = useState<typeof DEFAULT_LEADERBOARD_DATA>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRestaurant, setFilterRestaurant] = useState('All Restaurants')
  const [sortBy, setSortBy] = useState('Most Recent')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const dishData = await getDish(id)
        if (dishData) setDish(dishData)

        // Fetch leaderboard using the dish name
        const dishName = dishData?.name || 'Biryani'
        const cityId = dishData?.restaurant?.city?.id
        const leaderboardData = await getDishLeaderboard(dishName, cityId)
        if (leaderboardData.length > 0) {
          setLeaderboard(
            leaderboardData.map((d: Dish & { restaurant: Restaurant }, i) => ({
              id: d.restaurant?.id || String(i),
              name: d.restaurant?.name || 'Unknown',
              score: d.score,
              review_count: d.review_count,
              price: d.price || 0,
              city: d.restaurant?.city?.name || '',
              area: d.restaurant?.address?.split(',').slice(0, 2).join(', ') || '',
            }))
          )
        }

        const reviewsData = await getReviewsByDish(id)
        if (reviewsData.length > 0) setReviews(reviewsData)
      } catch (err) {
        console.error('Error fetching dish:', err)
        setLeaderboard(DEFAULT_LEADERBOARD_DATA)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const DISH = dish || DEFAULT_DISH_DATA
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : DEFAULT_LEADERBOARD_DATA
  const displayReviews = reviews

  const scrollSimilar = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 240
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const sortedReviews = [...displayReviews].sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating
    if (sortBy === 'Most Helpful') return b.helpful_count - a.helpful_count
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const similarDishes = displayLeaderboard.slice(0, 6).map((item, i) => ({
    id: item.id + '-similar',
    name: DISH.name,
    category: (dish?.category || 'Biryani'),
    restaurant: item.name,
    score: item.score,
    emoji: LEADERBOARD_EMOJIS[i % LEADERBOARD_EMOJIS.length],
  }))

  const cityName = (dish?.restaurant as any)?.city?.name || 'Hyderabad'
  const restaurantName = (dish?.restaurant as any)?.name || ''

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-6 bg-[#F5EDD9] rounded-lg w-48" />
          <div className="h-48 bg-[#F5EDD9] rounded-2xl" />
          <div className="h-8 bg-[#F5EDD9] rounded-lg w-64" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-[#F5EDD9] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* ═══════ BREADCRUMB ═══════ */}
      <FadeUpSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brown-muted">
            <Link href="/" className="hover:text-saffron transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/search?city=${encodeURIComponent(cityName)}`} className="hover:text-saffron transition-colors">{cityName}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/search?category=${encodeURIComponent(DISH.category || 'Biryani')}`} className="hover:text-saffron transition-colors">{DISH.category || 'Biryani'}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">{DISH.name}</span>
          </nav>
        </div>
      </FadeUpSection>

      {/* ═══════ MAIN LAYOUT ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0 lg:max-w-[calc(70%-1.25rem)]">
            {/* ══ DISH HERO ══ */}
            <FadeUpSection>
              <section>
                <div className="w-full aspect-[2/1] sm:aspect-[3/1] rounded-2xl bg-gradient-to-br from-saffron/25 via-cream-darker to-saffron/10 flex items-center justify-center mb-8 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/20 to-transparent" />
                  <span className="text-7xl sm:text-8xl relative z-10">{DISH.is_veg ? '🥗' : '🍛'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                        {DISH.name}
                      </h1>
                      <Badge variant={DISH.is_veg ? 'veg' : 'nonveg'} className="text-[10px] px-2 py-0.5">
                        {DISH.is_veg ? 'Veg' : (DISH as any).is_halal ? 'Halal' : 'Non-Veg'}
                      </Badge>
                    </div>

                    <p className="text-sm text-brown-muted mb-3">
                      Ranked across <span className="font-semibold text-ink">{displayLeaderboard.length} restaurants</span> in {cityName}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {DISH.category && <Badge variant="secondary" className="text-xs">{DISH.category}</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0">
                    <div>
                      <Badge className="bg-saffron text-cream text-xs px-2 py-0.5 mb-1">City Score</Badge>
                      <div className="bg-saffron rounded-2xl p-4 text-center min-w-[88px] shadow-lg shadow-saffron/20">
                        <span className="block text-3xl font-bold text-cream">{DISH.score.toFixed(1)}</span>
                        <span className="block text-[10px] text-cream/80 uppercase tracking-wider">/ 10</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-brown-muted leading-snug">
                        Across all<br />restaurants<br />in {cityName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dish attributes */}
                <div className="flex flex-wrap items-center gap-6 mt-6 p-4 rounded-xl bg-cream-dark/50 border border-brown-muted/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brown-muted">Avg Price:</span>
                    <span className="text-sm font-medium text-ink">₹{DISH.price || displayLeaderboard[0]?.price || 400}</span>
                  </div>
                  <div className="w-px h-5 bg-brown-muted/15" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brown-muted">Reviews:</span>
                    <span className="text-sm font-medium text-ink">{DISH.review_count.toLocaleString()}</span>
                  </div>
                  <div className="w-px h-5 bg-brown-muted/15" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brown-muted">Best at:</span>
                    <span className="text-sm font-medium text-ink">{restaurantName || displayLeaderboard[0]?.name || 'Various'}</span>
                  </div>
                </div>
              </section>
            </FadeUpSection>

            {/* ══ CITY LEADERBOARD ══ */}
            <FadeUpSection>
              <section className="mt-14">
                <div className="mb-8">
                  <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">{cityName} · Updated this week</span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mt-1">
                    Who Makes the Best {DISH.name}?
                  </h2>
                  <p className="text-sm text-brown-muted mt-1">Ranked by dish score from verified reviews</p>
                </div>

                <div className="space-y-3">
                  {displayLeaderboard.map((item, i) => (
                    <Link
                      key={item.id || i}
                      href={`/restaurant/${item.id}`}
                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        i === 0
                          ? 'bg-gradient-to-r from-saffron/15 via-saffron/8 to-cream border border-saffron/20 hover:border-saffron/40 shadow-md shadow-saffron/5'
                          : 'bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-sm border-l-2 border-transparent hover:border-l-saffron'
                      }`}
                    >
                      <div className="flex items-center gap-2 w-16 shrink-0">
                        {i === 0 ? (
                          <Trophy className="w-7 h-7 text-saffron" />
                        ) : (
                          <span className={`font-serif text-2xl font-bold ${i === 1 ? 'text-brown-muted/60' : 'text-brown-muted/40'} w-7 text-center`}>
                            {i + 1}
                          </span>
                        )}
                      </div>

                      <span className="text-2xl shrink-0">{LEADERBOARD_EMOJIS[i] || '🍽️'}</span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-serif font-bold truncate ${i === 0 ? 'text-xl text-ink' : 'text-lg text-ink'} group-hover:text-saffron transition-colors`}>
                            {item.name}
                          </h3>
                          {i === 0 && (
                            <Badge className="bg-saffron text-cream text-[9px] px-1.5 py-0 gap-1 shrink-0">
                              <Award className="w-2.5 h-2.5" />
                              Best in City
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-brown-muted">{item.area || item.city}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <span className={`font-bold font-sans ${item.score >= 9.0 ? 'text-saffron text-lg' : 'text-saffron text-base'}`}>
                            {item.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-[10px] text-brown-muted">{item.review_count.toLocaleString()} reviews</p>
                      </div>

                      <div className="hidden sm:block text-right shrink-0 min-w-[60px]">
                        <p className="text-sm font-semibold text-ink">₹{item.price}</p>
                        <p className="text-[10px] text-brown-muted">per dish</p>
                      </div>

                      <div className="hidden sm:flex items-center gap-1 text-xs text-saffron opacity-0 group-hover:opacity-100 transition-all shrink-0 whitespace-nowrap">
                        View Restaurant <ChevronRight className="w-3 h-3" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Link href={`/search?q=${encodeURIComponent(DISH.name)}&city=${encodeURIComponent(cityName)}`}>
                    <Button variant="ghost" size="sm" className="text-saffron gap-1">
                      See all {displayLeaderboard.length} restaurants <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </section>
            </FadeUpSection>

            {/* ══ ABOUT THIS DISH ══ */}
            <FadeUpSection>
              <section className="mt-14">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-6">About this Dish</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 p-5 rounded-xl bg-cream border border-brown-muted/10">
                    <p className="text-sm text-ink/80 leading-relaxed">{DISH.description}</p>
                  </div>

                  {[
                    { label: 'Average Score', value: `${DISH.score}/10`, icon: '⭐' },
                    { label: 'Total Reviews', value: `${DISH.review_count.toLocaleString()}`, icon: '💬' },
                    { label: 'Avg Price', value: `₹${DISH.price || displayLeaderboard[0]?.price || 400}`, icon: '💰' },
                    { label: 'Restaurants', value: `${displayLeaderboard.length} in ${cityName}`, icon: '🏆' },
                  ].map((attr) => (
                    <div key={attr.label} className="flex items-center gap-3 p-4 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/15 hover:shadow-sm transition-all">
                      <span className="text-xl">{attr.icon}</span>
                      <div>
                        <p className="text-xs text-brown-muted">{attr.label}</p>
                        <p className="text-sm font-semibold text-ink">{attr.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </FadeUpSection>

            {/* ══ REVIEWS ══ */}
            <FadeUpSection>
              <section className="mt-14">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Reviews</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">
                      Reviews for {DISH.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-cream border border-brown-muted/15 rounded-lg px-3 py-2 pr-8 text-xs text-brown-muted font-medium focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all cursor-pointer"
                      >
                        <option>Most Recent</option>
                        <option>Highest Rated</option>
                        <option>Most Helpful</option>
                      </select>
                      <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brown-muted pointer-events-none" />
                    </div>
                    <Link href="/review/new">
                      <Button className="bg-saffron hover:bg-saffron-light text-cream text-xs gap-1 h-9 whitespace-nowrap">
                        <PenSquare className="w-3.5 h-3.5" />
                        Write a Review
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedReviews.slice(0, 10).map((review) => (
                    <div key={review.id} className="group relative bg-cream rounded-xl border border-brown-muted/10 p-5 sm:p-6 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-saffron">
                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm text-ink">{review.user?.name || 'User'}</span>
                                {review.is_verified && (
                                  <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[9px] px-1.5 py-0">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-brown-muted mt-0.5">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-saffron font-bold font-sans text-lg">{review.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-brown-muted">/10</span>
                            </div>
                          </div>
                          {review.text && (
                            <p className="font-serif italic text-sm sm:text-base text-ink/80 mt-3 leading-relaxed">
                              &ldquo;{review.text}&rdquo;
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-brown-muted/10">
                            <div className="flex items-center gap-1.5 text-xs text-brown-muted">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{review.helpful_count} found helpful</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button variant="outline" size="sm" className="gap-1 text-brown-muted">
                    View All Reviews <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </section>
            </FadeUpSection>

            {/* ══ SIMILAR DISHES ══ */}
            <FadeUpSection>
              <section className="mt-14 mb-14">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Discover More</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">You Might Also Love</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => scrollSimilar('left')} className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => scrollSimilar('right')} className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
                  {similarDishes.map((item, i) => (
                    <Link
                      key={item.id + i}
                      href={`/restaurant/${item.id}`}
                      className="group flex-shrink-0 w-[200px] sm:w-[220px] snap-start rounded-xl bg-cream border border-brown-muted/10 p-4 hover:border-saffron/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="w-full h-24 rounded-lg bg-gradient-to-br from-saffron/15 via-cream-darker to-cream-dark flex items-center justify-center mb-3">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0 mb-1">{item.category}</Badge>
                      <h3 className="font-serif text-base font-semibold text-ink group-hover:text-saffron transition-colors truncate">
                        {item.restaurant}
                      </h3>
                      <p className="text-xs text-brown-muted truncate">{item.name}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-brown-muted/10">
                        <span className="text-saffron font-bold font-sans text-sm">{item.score.toFixed(1)}</span>
                        <span className="text-[10px] text-brown-muted">/10</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeUpSection>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-[30%] shrink-0">
            <FadeUpSection>
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="rounded-2xl bg-cream border border-brown-muted/10 p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-ink mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-saffron" />
                    Top 3 for this Dish
                  </h3>
                  <div className="space-y-3">
                    {displayLeaderboard.slice(0, 3).map((item, i) => (
                      <Link
                        key={item.id || i}
                        href={`/restaurant/${item.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-sans ${
                          i === 0 ? 'bg-saffron text-cream' : 'bg-cream-darker text-brown-muted'
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink group-hover:text-saffron transition-colors truncate">{item.name}</p>
                          <p className="text-xs text-brown-muted">{item.area || item.city}</p>
                        </div>
                        <span className="text-saffron font-bold font-sans text-sm">{item.score.toFixed(1)}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-cream border border-brown-muted/10 p-6 shadow-sm space-y-3">
                  <Link href="/review/new">
                    <Button className="w-full bg-saffron hover:bg-saffron-light text-cream gap-2">
                      <PenSquare className="w-4 h-4" />
                      Review this Dish
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 gap-2 text-xs">
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </Button>
                    <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 gap-2 text-xs">
                      <Bookmark className="w-3.5 h-3.5" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-cream-dark/50 border border-brown-muted/10 p-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="font-serif text-xl font-bold text-ink">{DISH.score.toFixed(1)}</p>
                      <p className="text-[10px] text-brown-muted uppercase tracking-wider">City Score</p>
                    </div>
                    <div>
                      <p className="font-serif text-xl font-bold text-ink">{displayLeaderboard.length}</p>
                      <p className="text-[10px] text-brown-muted uppercase tracking-wider">Restaurants</p>
                    </div>
                    <div>
                      <p className="font-serif text-xl font-bold text-ink">₹{DISH.price || displayLeaderboard[0]?.price || 400}</p>
                      <p className="text-[10px] text-brown-muted uppercase tracking-wider">Avg Price</p>
                    </div>
                    <div>
                      <p className="font-serif text-xl font-bold text-ink">{(DISH.review_count / 1000).toFixed(1)}K</p>
                      <p className="text-[10px] text-brown-muted uppercase tracking-wider">Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUpSection>
          </div>
        </div>
      </div>
    </div>
  )
}
