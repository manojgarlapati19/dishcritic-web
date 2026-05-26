'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Star, MapPin, Clock, Phone, Share2, Heart,
  ChevronRight, ThumbsUp,
  PenSquare, Filter, Bookmark, Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { getRestaurant, getDishesByRestaurant, getReviewsByRestaurant } from '@/lib/queries'
import type { Restaurant, Dish, Review } from '@/types'
import { useParams } from 'next/navigation'

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

const CATEGORIES_LIST = ['All', 'Biryani', 'Starters', 'Main Course', 'Desserts', 'Drinks']

const DEFAULT_RESTAURANT = {
  id: '1',
  name: 'Paradise Restaurant',
  city: 'Hyderabad',
  address: 'SD Road, Secunderabad, Hyderabad, Telangana 500003',
  cuisine_type: ['Hyderabadi', 'Mughlai', 'North Indian', 'Biryani'],
  price_range: 2,
  overall_score: 9.2,
  is_verified: true,
  phone: '+91 40 2784 0000',
  review_count: 4230,
  hours: { Mon: '11am – 11pm', Tue: '11am – 11pm', Wed: '11am – 11pm', Thu: '11am – 11pm', Fri: '11am – 11pm', Sat: '11am – 11:30pm', Sun: '11am – 11:30pm' },
}

const DEFAULT_DISHES: Dish[] = [
  { id: '1', restaurant_id: '1', name: 'Hyderabadi Dum Biryani', price: 350, is_veg: false, is_halal: true, is_jain: false, score: 9.4, review_count: 4200, is_available: true, created_at: '' },
  { id: '2', restaurant_id: '1', name: 'Chicken Biryani', price: 320, is_veg: false, is_halal: true, is_jain: false, score: 9.0, review_count: 2800, is_available: true, created_at: '' },
  { id: '3', restaurant_id: '1', name: 'Haleem', price: 320, is_veg: false, is_halal: true, is_jain: false, score: 8.8, review_count: 2100, is_available: true, created_at: '' },
]

const DEFAULT_REVIEWS: Review[] = [
  { id: '1', user_id: '1', restaurant_id: '1', dish_id: '1', rating: 9.4, text: 'The biryani here is simply unparalleled. Every grain of rice is perfectly cooked, the masala is well-balanced, and the chicken falls off the bone.', tags: ['Biryani Connoisseur'], helpful_count: 84, is_verified: true, is_flagged: false, created_at: new Date().toISOString() },
  { id: '2', user_id: '2', restaurant_id: '1', dish_id: '3', rating: 8.8, text: 'This Haleem is the best I have had outside of the old city. Creamy texture, perfectly spiced.', tags: ['Food Blogger'], helpful_count: 56, is_verified: true, is_flagged: false, created_at: new Date().toISOString() },
  { id: '3', user_id: '3', restaurant_id: '1', dish_id: '2', rating: 9.0, text: 'The Chicken Biryani here is incredibly flavorful. Perfectly spiced rice with tender chicken.', tags: ['Hyderabadi Food Lover'], helpful_count: 42, is_verified: true, is_flagged: false, created_at: new Date().toISOString() },
]

const PRICE_SYMBOLS = ['', '₹', '₹₹', '₹₹₹', '₹₹₹₹']

/* ───────────── Component ───────────── */
export default function RestaurantPage() {
  const params = useParams()
  const id = params?.id as string

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('Most Recent')

  useEffect(() => {
    async function fetchData() {
      try {
        const [restaurantData, dishesData, reviewsData] = await Promise.all([
          getRestaurant(id),
          getDishesByRestaurant(id),
          getReviewsByRestaurant(id),
        ])
        if (restaurantData) setRestaurant(restaurantData)
        if (dishesData.length > 0) setDishes(dishesData)
        if (reviewsData.length > 0) setReviews(reviewsData)
      } catch (err) {
        console.error('Error fetching restaurant:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const displayRestaurant = restaurant || DEFAULT_RESTAURANT
  const displayDishes = dishes.length > 0 ? dishes : DEFAULT_DISHES
  const displayReviews = reviews.length > 0 ? reviews : DEFAULT_REVIEWS

  const filteredMenu = activeCategory === 'All'
    ? displayDishes
    : displayDishes.filter((item) => (item.category || '').toLowerCase() === activeCategory.toLowerCase())

  const sortedReviews = [...displayReviews].sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating
    if (sortBy === 'Most Helpful') return b.helpful_count - a.helpful_count
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const mustOrderDishes = displayDishes
    .filter((d) => d.score >= 8.5 || d.review_count > 500)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const getCuisineCategories = () => {
    const cats = new Set<string>()
    displayDishes.forEach((d) => {
      if (d.category) cats.add(d.category)
    })
    return cats.size > 0 ? ['All', ...Array.from(cats)] : CATEGORIES_LIST
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-6 bg-[#F5EDD9] rounded-lg w-48" />
          <div className="h-64 bg-[#F5EDD9] rounded-2xl" />
          <div className="h-8 bg-[#F5EDD9] rounded-lg w-64" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-40 bg-[#F5EDD9] rounded-xl" />
            <div className="h-40 bg-[#F5EDD9] rounded-xl" />
            <div className="h-40 bg-[#F5EDD9] rounded-xl" />
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
            <Link href={`/search?city=${encodeURIComponent(typeof displayRestaurant.city === 'object' ? displayRestaurant.city?.name || '' : displayRestaurant.city || 'Hyderabad')}`} className="hover:text-saffron transition-colors">
              {typeof displayRestaurant.city === 'object' ? displayRestaurant.city?.name : displayRestaurant.city || 'Hyderabad'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink font-medium">{displayRestaurant.name}</span>
          </nav>
        </div>
      </FadeUpSection>

      {/* ═══════ MAIN LAYOUT ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0 lg:max-w-[calc(70%-1.25rem)]">
            {/* ══ HERO ══ */}
            <FadeUpSection>
              <section>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-xl bg-gradient-to-br overflow-hidden"
                      style={{
                        backgroundImage: `linear-gradient(135deg, 
                          ${i === 0 ? 'rgba(200,112,42,0.2)' : 'rgba(200,112,42,0.12)'},
                          ${i === 1 ? '#F0E6CE' : '#F5EDD9'},
                          ${i === 2 ? 'rgba(200,112,42,0.08)' : 'rgba(200,112,42,0.06)'},
                          ${i === 3 ? '#F0E6CE' : '#F5EDD9'}
                        )`,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl">
                          {['🍽️', '🍛', '🥘', '🍗'][i]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                        {displayRestaurant.name}
                      </h1>
                      {displayRestaurant.is_verified && (
                        <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[10px] px-2.5 gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-brown-muted mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {typeof displayRestaurant.city === 'object' ? displayRestaurant.city?.name : displayRestaurant.city || 'Hyderabad'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-brown-muted/30" />
                      <span className="text-lg font-semibold text-ink">
                        {PRICE_SYMBOLS[displayRestaurant.price_range] || '₹₹'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-brown-muted/30" />
                      <span className="text-brown-muted">
                        {(displayRestaurant.cuisine_type || []).join(' · ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:text-right shrink-0">
                    <div className="bg-saffron rounded-xl p-3 text-center min-w-[72px]">
                      <span className="block text-2xl font-bold text-cream">{displayRestaurant.overall_score.toFixed(1)}</span>
                      <span className="block text-[10px] text-cream/80 uppercase tracking-wider">Score</span>
                    </div>
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(displayRestaurant.overall_score / 2) ? 'text-saffron fill-saffron' : 'text-brown-muted/20'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-brown-muted mt-0.5">{displayRestaurant.review_count.toLocaleString()} reviews</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {(displayRestaurant.cuisine_type || []).map((c: string) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </section>
            </FadeUpSection>

            {/* ══ MUST ORDER ══ */}
            {mustOrderDishes.length > 0 && (
              <FadeUpSection>
                <section className="mt-14">
                  <div className="mb-6">
                    <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Don&apos;t leave without trying</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">Must Order Dishes</h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {mustOrderDishes.map((dish) => (
                      <Link
                        key={dish.id}
                        href={`/dish/${dish.id}`}
                        className="group relative rounded-2xl bg-saffron/5 border border-saffron/15 p-5 hover:bg-saffron/10 hover:border-saffron/25 hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-saffron flex items-center justify-center shadow-lg shadow-saffron/20 z-10">
                          <span className="text-white font-bold font-sans text-sm">{dish.score.toFixed(1)}</span>
                        </div>
                        <div className="h-24 rounded-lg bg-gradient-to-br from-saffron/20 via-cream-darker to-saffron/10 flex items-center justify-center mb-4 overflow-hidden">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-500">{dish.is_veg ? '🥗' : '🍛'}</span>
                        </div>
                        <Badge variant={dish.is_veg ? 'veg' : 'nonveg'} className="text-[10px] px-1.5 py-0 mb-2">
                          {dish.is_veg ? 'Veg' : 'Non-Veg'}
                        </Badge>
                        <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{dish.name}</h3>
                        <p className="text-xs text-brown-muted mt-1 leading-relaxed line-clamp-2">{dish.description || ''}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-saffron/10">
                          <span className="text-sm font-semibold text-ink">₹{dish.price || 0}</span>
                          <span className="text-xs text-brown-muted">{dish.review_count.toLocaleString()} reviews</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              </FadeUpSection>
            )}

            {/* ══ FULL MENU ══ */}
            <FadeUpSection>
              <section className="mt-14">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-6">Full Menu</h2>

                <div className="flex flex-wrap items-center gap-2 mb-8">
                  {getCuisineCategories().map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? 'bg-saffron text-cream shadow-sm shadow-saffron/20'
                          : 'bg-cream text-brown-muted border border-brown-muted/15 hover:border-saffron/30 hover:text-saffron'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredMenu.map((item) => (
                    <Link
                      key={item.id}
                      href={`/dish/${item.id}`}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-sm transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{item.name}</h3>
                          {item.score >= 9 && (
                            <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[10px] px-1.5 py-0">
                              ★ Top Rated
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-brown-muted mt-0.5 line-clamp-1">{item.description || ''}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm font-semibold text-ink">₹{item.price || 0}</span>
                          <Badge variant={item.is_veg ? 'veg' : 'nonveg'} className="text-[9px] px-1 py-0">
                            {item.is_veg ? 'Veg' : 'Non-Veg'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-saffron font-bold font-sans text-sm">{item.score.toFixed(1)}</span>
                          <span className="text-[10px] text-brown-muted">/10</span>
                        </div>
                        <p className="text-[10px] text-brown-muted">{item.review_count.toLocaleString()} reviews</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </FadeUpSection>

            {/* ══ REVIEWS ══ */}
            <FadeUpSection>
              <section className="mt-14 mb-14">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Reviews</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mt-1">What People Are Saying</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-cream border border-brown-muted/15 rounded-lg px-3 py-2 pr-8 text-xs text-brown-muted font-medium focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all cursor-pointer"
                      >
                        <option>Most Recent</option>
                        <option>Most Helpful</option>
                        <option>Highest Rated</option>
                      </select>
                      <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-brown-muted pointer-events-none" />
                    </div>
                    <Link href="/review/new">
                      <Button className="bg-saffron hover:bg-saffron-light text-cream text-xs gap-1 h-9">
                        <PenSquare className="w-3.5 h-3.5" />
                        Write a Review
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedReviews.slice(0, 10).map((review) => (
                    <div
                      key={review.id}
                      className="group relative bg-cream rounded-xl border border-brown-muted/10 p-5 sm:p-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-saffron">
                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-ink">{review.user?.name || 'User'}</span>
                                {review.is_verified && (
                                  <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[9px] px-1.5 py-0">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-brown-muted mt-0.5">
                                Reviewed <span className="font-medium text-ink/70">{review.dish?.name || 'Dish'}</span> · {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <span className="text-saffron font-bold font-sans text-base">{review.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-brown-muted">/10</span>
                            </div>
                          </div>
                          {review.text && (
                            <p className="text-sm text-ink/80 mt-3 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
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
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:w-[30%] shrink-0">
            <FadeUpSection>
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="rounded-2xl bg-cream border border-brown-muted/10 p-6 space-y-5 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 text-ink mb-1.5">
                      <MapPin className="w-4 h-4 text-saffron" />
                      <span className="font-semibold text-sm">Address</span>
                    </div>
                    <p className="text-sm text-brown-muted pl-6">{displayRestaurant.address}</p>
                  </div>

                  <div className="h-px bg-brown-muted/10" />

                  <div className="flex items-center gap-2 text-ink mb-1.5">
                    <Phone className="w-4 h-4 text-saffron" />
                    <span className="font-semibold text-sm">Phone</span>
                  </div>
                  <p className="text-sm text-brown-muted pl-6">{displayRestaurant.phone || 'Not available'}</p>

                  <div className="h-px bg-brown-muted/10" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-brown-muted uppercase tracking-wider">Price Range</span>
                      <p className="text-sm font-semibold text-ink">{PRICE_SYMBOLS[displayRestaurant.price_range] || '₹₹'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-brown-muted uppercase tracking-wider">Cuisine</span>
                      <p className="text-sm font-semibold text-ink">{(displayRestaurant.cuisine_type || []).length} types</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button className="bg-saffron hover:bg-saffron-light text-cream text-xs h-9 gap-1 col-span-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-full border-brown-muted/20">
                      <Heart className="w-4 h-4 text-brown-muted" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-full border-brown-muted/20">
                      <Share2 className="w-4 h-4 text-brown-muted" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl bg-cream border border-brown-muted/10 p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-ink mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Food', score: Math.min(10, displayRestaurant.overall_score + 0.2) },
                      { label: 'Service', score: Math.max(0, displayRestaurant.overall_score - 0.4) },
                      { label: 'Ambience', score: Math.max(0, displayRestaurant.overall_score - 0.7) },
                      { label: 'Value', score: Math.min(10, displayRestaurant.overall_score - 0.2) },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-brown-muted">{item.label}</span>
                          <span className="font-bold text-ink font-sans">{item.score.toFixed(1)}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-cream-darker overflow-hidden">
                          <div
                            className="h-full rounded-full bg-saffron transition-all duration-700"
                            style={{ width: `${(item.score / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/review/new">
                  <Button variant="outline" className="w-full border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 gap-2">
                    <PenSquare className="w-4 h-4" />
                    Write a Review
                  </Button>
                </Link>
              </div>
            </FadeUpSection>
          </div>
        </div>
      </div>
    </div>
  )
}
