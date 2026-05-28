'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, Star, ArrowRight, MapPin, ChevronRight, Quote, UtensilsCrossed, Sparkles, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─── Sample Data ─────────────────────────────────────────────────────────────

const QUICK_DISHES = ['Biryani', 'Butter Chicken', 'Masala Dosa', 'Vada Pav', 'Chole Bhature']

const MARQUEE_ITEMS = [
  '4.2 Lakh Dishes Reviewed', '47 Indian Cities', '18,000+ Restaurants',
  'Dish-Level Search', '2.1 Lakh Verified Reviewers',
]

const STATS = [
  { value: '4.2L', label: 'Dishes Reviewed' },
  { value: '47+', label: 'Indian Cities' },
  { value: '18K', label: 'Restaurants' },
  { value: '2.1L', label: 'Verified Reviewers' },
]

const HERO_DISHES = [
  { name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, top: 5, right: 5 },
  { name: 'Masala Dosa', restaurant: 'MTR Bengaluru', score: 9.6, top: 28, right: 0 },
  { name: 'Vada Pav', restaurant: "Ashok's Mumbai", score: 9.1, top: 52, right: 8 },
]

const LEADERBOARD = [
  { rank: 1, emoji: '👑', name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, reviews: 4200 },
  { rank: 2, emoji: '🔥', name: 'Mutton Biryani', restaurant: 'Shah Ghouse', score: 9.2, reviews: 3100 },
  { rank: 3, emoji: '⭐', name: 'Chicken Biryani', restaurant: 'Bawarchi', score: 8.9, reviews: 2800 },
  { rank: 4, emoji: '💛', name: 'Kacchi Biryani', restaurant: 'Cafe Bahar', score: 8.7, reviews: 1950 },
  { rank: 5, emoji: '🌿', name: 'Veg Biryani', restaurant: 'Pista House', score: 8.4, reviews: 1700 },
]

const TRENDING = [
  { emoji: '🍛', name: 'Hyderabadi Dum Biryani', city: 'Hyderabad', score: 9.4, reviews: 4200, badge: '🔥 Viral', tags: ['Non-Veg', 'Spicy'] },
  { emoji: '🥞', name: 'Masala Dosa', city: 'Bengaluru', score: 9.6, reviews: 5600, badge: '🏆 Top Rated', tags: ['Veg'] },
  { emoji: '🍗', name: 'Butter Chicken', city: 'Delhi', score: 9.1, reviews: 3400, badge: '📈 Rising', tags: ['Non-Veg'] },
  { emoji: '🫓', name: 'Chole Bhature', city: 'Delhi', score: 8.8, reviews: 2100, badge: '✨ New', tags: ['Veg', 'Spicy'] },
]

const CITIES = [
  { emoji: '🌆', name: 'Mumbai', count: 3200 },
  { emoji: '🕌', name: 'Hyderabad', count: 1240 },
  { emoji: '🌿', name: 'Bengaluru', count: 2500 },
  { emoji: '🏛️', name: 'Delhi', count: 2800 },
  { emoji: '🐟', name: 'Chennai', count: 1800 },
  { emoji: '🎨', name: 'Kolkata', count: 1500 },
]

const HOW_IT_WORKS = [
  { number: '01', icon: Search, title: 'Search any dish', desc: 'Type any dish — Biryani, Dosa, Butter Chicken — and instantly see every restaurant serving it, ranked by dish score.' },
  { number: '02', icon: Star, title: 'Read dish reviews', desc: 'Dive into scores and reviews for that specific dish alone — not the restaurant\'s overall rating. Pure, focused feedback.' },
  { number: '03', icon: ChefHat, title: 'Share your review', desc: 'Had an amazing dish? Rate it. Help others discover the best plates in your city. Your taste buds do the ranking.' },
]

const REVIEWS = [
  { quote: 'Finally, a platform that understands food is about dishes, not just restaurants. I found the best biryani in my city within seconds.', name: 'Arjun Mehta', initials: 'AM', dish: 'Hyderabadi Biryani', stars: 5 },
  { quote: 'The dish-level rankings are a game changer. No more guesswork — I know exactly where to go for the perfect Masala Dosa.', name: 'Priya Sharma', initials: 'PS', dish: 'Masala Dosa', stars: 5 },
  { quote: 'As someone who travels across India for work, DishCritic has become my go-to. Every city, every dish — ranked and reviewed.', name: 'Rahul Joshi', initials: 'RJ', dish: 'Pani Puri', stars: 4 },
]

const LEADERBOARD_TABS = ['Biryani', 'Butter Chicken', 'Masala Dosa', 'Dal Makhani', 'Gulab Jamun']

// ─── Intersection Observer Hook ──────────────────────────────────────────────

function useFadeInUp(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null!)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

function FadeInSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useFadeInUp()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Home Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('')
  const [activeTab, setActiveTab] = useState('Biryani')

  const handleSearch = useCallback(() => {
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}&city=Hyderabad`
    }
  }, [searchInput])

  return (
    <div className="bg-cream text-ink overflow-hidden">
      {/* ═══════ 1. HERO ═══════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[70%] rounded-full bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-8%] w-[40%] h-[50%] rounded-full bg-gradient-radial from-saffron/5 via-transparent to-transparent pointer-events-none" />
        {/* Dot grid */}
        <div className="absolute right-[5%] top-[15%] w-[35%] h-[70%] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #1E1208 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[80vh]">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                India&apos;s dish-first review platform
              </div>

              {/* Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
                Find India&apos;s Best Dishes,
                <br />
                <span className="text-saffron">Not Just Restaurants</span>
              </h1>

              {/* Subtext */}
              <p className="text-brown-muted text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Search any dish. Get ranked results by that specific dish — not the overall restaurant. 4.2 lakh reviews across 47 Indian cities.
              </p>

              {/* Search Bar */}
              <div className="flex items-center gap-2 max-w-xl mx-auto lg:mx-0 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all shadow-sm"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-12 px-6 rounded-xl bg-saffron hover:bg-saffron-light text-cream font-semibold text-sm gap-1.5 shrink-0 transition-all shadow-sm hover:shadow-md"
                >
                  Search Dishes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="text-xs text-brown-muted mr-1">Popular:</span>
                {QUICK_DISHES.map((dish) => (
                  <Link
                    key={dish}
                    href={`/search?q=${encodeURIComponent(dish)}&city=Hyderabad`}
                    className="px-3 py-1 rounded-full border border-brown-muted/15 text-xs text-brown-muted hover:border-saffron/40 hover:text-saffron hover:bg-saffron/5 transition-all"
                  >
                    {dish}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Floating Dish Cards */}
            <div className="flex-1 hidden lg:block relative h-[520px] w-full max-w-md mx-auto">
              {HERO_DISHES.map((dish, i) => (
                <div
                  key={dish.name}
                  className={`absolute p-5 rounded-2xl bg-cream border border-brown-muted/10 shadow-xl shadow-brown-muted/5 hover:-translate-y-1 transition-all duration-500 w-72 animate-slide-in-right`}
                  style={{
                    top: `${dish.top}%`,
                    right: `${dish.right}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-brown-muted uppercase tracking-wider mb-0.5">{dish.restaurant}</p>
                      <h3 className="font-serif text-lg font-semibold text-ink truncate">{dish.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-saffron/10 px-2 py-1 rounded-lg shrink-0 ml-2">
                      <span className="text-saffron font-bold font-sans text-sm">{dish.score}</span>
                      <span className="text-saffron/60 text-xs">/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brown-muted">
                    <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
                    <span>{'★'.repeat(Math.min(5, Math.ceil(dish.score / 2))).trim() || '★★★★★'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float hidden lg:block">
          <ChevronRight className="w-6 h-6 text-brown-muted/40 rotate-90" />
        </div>
      </section>

      {/* ═══════ 2. MARQUEE STRIP ═══════ */}
      <section className="bg-cream-darker border-y border-brown-muted/10 py-4 overflow-hidden">
        <div className="flex animate-marquee-new whitespace-nowrap">
          {[...Array(2)].map((_, groupIdx) => (
            <div key={groupIdx} className="flex items-center gap-8 mx-4">
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center gap-3 text-sm font-medium text-ink/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. STATS ROW ═══════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative group text-center py-6 px-4">
                {i > 0 && <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-px bg-brown-muted/10" />}
                <h3 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-1">{stat.value}</h3>
                <p className="text-xs text-brown-muted uppercase tracking-widest font-medium">{stat.label}</p>
                <div className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ═══════ 4. LEADERBOARD SECTION ═══════ */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-4">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">This week · Hyderabad</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink text-center mb-6">Best Biryani in the City</h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {LEADERBOARD_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-saffron text-cream'
                      : 'bg-cream text-brown-muted hover:bg-cream-darker hover:text-ink border border-brown-muted/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </FadeInSection>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Ranked List (Left 3/5) */}
            <FadeInSection className="lg:col-span-3">
              <div className="space-y-2">
                {LEADERBOARD.map((item) => (
                  <Link
                    key={item.rank}
                    href={`/search?q=${encodeURIComponent(item.name)}`}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-sm transition-all cursor-pointer"
                  >
                    {/* Rank */}
                    <span className="font-serif text-2xl font-bold text-ink/20 w-8 text-center shrink-0">
                      {item.rank === 1 ? '👑' : item.rank}
                    </span>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-lg font-semibold text-ink truncate">{item.name}</h4>
                      <p className="text-xs text-brown-muted truncate">{item.restaurant}</p>
                    </div>
                    {/* Score */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-saffron font-bold font-sans text-lg">{item.score.toFixed(1)}</span>
                        <span className="text-xs text-brown-muted">/10</span>
                      </div>
                      <p className="text-xs text-brown-muted">{item.reviews.toLocaleString()} reviews</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-brown-muted/0 group-hover:text-saffron transition-all" />
                  </Link>
                ))}
              </div>
            </FadeInSection>

            {/* Featured #1 Card (Right 2/5) */}
            <FadeInSection className="lg:col-span-2">
              <div className="rounded-2xl bg-cream border border-brown-muted/10 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-saffron/20 via-cream-dark to-saffron/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #C8702A 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  <span className="text-6xl relative z-10">👑</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-saffron font-semibold uppercase tracking-wider">#1 Top Rated</p>
                    <h3 className="font-serif text-2xl font-bold text-ink mt-1">{LEADERBOARD[0]?.name}</h3>
                    <p className="text-sm text-brown-muted">{LEADERBOARD[0]?.restaurant} · Hyderabad</p>
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Score', value: '9.4/10' },
                      { label: 'Reviews', value: '4,200' },
                      { label: 'Price', value: '₹450' },
                      { label: 'Years Top 3', value: '3' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-cream-dark rounded-lg p-3 text-center">
                        <p className="font-serif text-lg font-bold text-ink">{stat.value}</p>
                        <p className="text-xs text-brown-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/search?q=${encodeURIComponent(LEADERBOARD[0]?.name || 'Biryani')}`}>
                    <Button className="w-full bg-saffron hover:bg-saffron-light text-cream gap-2 shadow-sm">
                      View Full Dish Page
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ═══════ 5. TRENDING DISHES ═══════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">🔥 What&apos;s Hot</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Trending Dishes This Week</h2>
            </div>
            <Link href="/leaderboards">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-saffron gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING.map((dish) => (
              <Link
                key={dish.name}
                href={`/search?q=${encodeURIComponent(dish.name)}&city=${encodeURIComponent(dish.city)}`}
                className="group relative rounded-2xl border border-brown-muted/10 bg-cream overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                {/* Gradient background */}
                <div className="h-40 bg-gradient-to-br from-saffron/15 via-cream-dark to-cream-darker flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" />
                  {/* Decorative circles */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-saffron/5" />
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-saffron/8" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="text-[10px] px-2 py-0.5">{dish.badge}</Badge>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{dish.name}</h3>
                    <p className="text-xs text-brown-muted flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {dish.city}
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
                    <p className="text-xs text-brown-muted">{dish.reviews >= 1000 ? (dish.reviews / 1000).toFixed(1) + 'K' : dish.reviews} reviews</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex sm:hidden justify-center mt-6">
            <Link href="/leaderboards">
              <Button variant="ghost" size="sm" className="text-saffron gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </FadeInSection>

      {/* ═══════ 6. CITY PICKER ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Explore</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Pick Your City</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CITIES.map((city) => (
                <Link
                  key={city.name}
                  href={`/cities/${city.name.toLowerCase()}`}
                  className="group text-center p-6 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{city.emoji}</span>
                  <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-saffron transition-colors">{city.name}</h3>
                  <p className="text-xs text-brown-muted mt-1">{city.count.toLocaleString()} restaurants</p>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════ 7. HOW IT WORKS ═══════ */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Simple Process</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-brown-muted/10 rounded-2xl overflow-hidden">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative bg-cream p-8 sm:p-10 hover:bg-cream-dark transition-colors duration-500 group">
                {/* Decorative number */}
                <span className="absolute top-4 right-6 font-serif text-7xl sm:text-8xl font-bold text-ink/[0.04] select-none pointer-events-none">
                  {step.number}
                </span>
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-saffron/10 flex items-center justify-center mb-5 group-hover:bg-saffron/20 transition-colors">
                  <step.icon className="w-6 h-6 text-saffron" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3 relative z-10">{step.title}</h3>
                <p className="text-sm text-brown-muted leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* ═══════ 8. REVIEW CARDS ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Testimonials</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">What Foodies Are Saying</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {REVIEWS.map((review) => (
                <div key={review.name} className="group relative bg-cream rounded-2xl border border-brown-muted/10 p-6 sm:p-8 hover:shadow-lg transition-all duration-500">
                  {/* Top saffron line */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-saffron/20 mb-4" />
                  {/* Dish pill */}
                  <Badge variant="outline" className="mb-4 text-xs">
                    {review.dish}
                  </Badge>
                  {/* Quote text */}
                  <p className="font-serif italic text-base sm:text-lg text-ink leading-relaxed mb-6">&ldquo;{review.quote}&rdquo;</p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-brown-muted/10">
                    <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-saffron">{review.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{review.name}</p>
                      <p className="text-xs text-brown-muted">Verified Foodie</p>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.stars ? 'text-saffron fill-saffron' : 'text-brown-muted/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ═══════ 9. CTA SECTION ═══════ */}
      <section className="relative bg-ink py-24 overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-4">
            Start Reviewing Your Favourite Dishes
          </h2>
          <p className="text-brown-muted text-lg mb-10">Free to join. Free forever.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth">
              <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20 hover:shadow-xl hover:shadow-saffron/30 transition-all">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50 px-8 py-6 text-base">
                Browse as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
