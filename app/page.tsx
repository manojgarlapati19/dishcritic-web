'use client'

import { useState, useEffect } from 'react'
import { Search, Star, ArrowRight, MapPin, ChevronRight, ExternalLink, Quote, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/store/useStore'

// ─── Sample Data ─────────────────────────────────────────────────────────────

const STATS = [
  { value: '4.2L', label: 'Dishes Reviewed' },
  { value: '47+', label: 'Indian Cities' },
  { value: '18K', label: 'Restaurants' },
  { value: '2.1L', label: 'Verified Reviewers' },
]

const LEADERBOARD = [
  { rank: 1, emoji: '👑', name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, reviews: 4200 },
  { rank: 2, emoji: '🔥', name: 'Chicken Biryani', restaurant: 'Bawarchi', score: 8.9, reviews: 3100 },
  { rank: 3, emoji: '⭐', name: 'Mutton Biryani', restaurant: 'Shadab Restaurant', score: 8.7, reviews: 2800 },
  { rank: 4, emoji: '💛', name: 'Veg Biryani', restaurant: 'Pista House', score: 8.4, reviews: 1950 },
  { rank: 5, emoji: '🌿', name: 'Chicken Dum Biryani', restaurant: 'Cafe Bahar', score: 8.2, reviews: 1700 },
]

const TRENDING = [
  { emoji: '🍛', name: 'Hyderabadi Dum Biryani', city: 'Hyderabad', score: 9.4, reviews: 4200, badge: '🔥 Viral' },
  { emoji: '🥞', name: 'Masala Dosa', city: 'Bengaluru', score: 9.6, reviews: 5600, badge: '🏆 Top Rated' },
  { emoji: '🍗', name: 'Butter Chicken', city: 'Delhi', score: 9.1, reviews: 3400, badge: '📈 Rising' },
  { emoji: '🫓', name: 'Chole Bhature', city: 'Delhi', score: 8.8, reviews: 2100, badge: '✨ New' },
]

const CITIES = [
  { emoji: '🕌', name: 'Hyderabad', count: 1240 },
  { emoji: '🌆', name: 'Mumbai', count: 3200 },
  { emoji: '🌿', name: 'Bengaluru', count: 2500 },
  { emoji: '🏛️', name: 'Delhi', count: 2800 },
  { emoji: '🐟', name: 'Chennai', count: 1800 },
  { emoji: '🎨', name: 'Kolkata', count: 1500 },
]

const HOW_IT_WORKS = [
  { icon: '🔍', title: 'Search any dish', desc: 'Type any dish — Biryani, Dosa, Butter Chicken — and instantly see every restaurant serving it, ranked by dish score.' },
  { icon: '📊', title: 'Read dish-level reviews', desc: 'Dive into scores and reviews for that specific dish alone — not the restaurant\'s overall rating. Pure, focused feedback.' },
  { icon: '✍️', title: 'Share your review', desc: 'Had an amazing dish? Rate it. Help others discover the best plates in your city. Your taste buds do the ranking.' },
]

const REVIEWS = [
  { quote: 'Finally, a platform that understands food is about dishes, not just restaurants. I found the best biryani in my city within seconds.', name: 'Arjun Mehta', initial: 'AM', title: 'Biryani Connoisseur', stars: 5, dish: 'Hyderabadi Biryani' },
  { quote: 'The dish-level rankings are a game changer. No more guesswork — I know exactly where to go for the perfect Masala Dosa.', name: 'Priya Sharma', initial: 'PS', title: 'South Indian Lover', stars: 5, dish: 'Masala Dosa' },
  { quote: 'As someone who travels across India for work, DishCritic has become my go-to. Every city, every dish — ranked and reviewed.', name: 'Rahul Joshi', initial: 'RJ', title: 'Street Food Explorer', stars: 4, dish: 'Pani Puri' },
]

const QUICK_DISHES = ['Biryani', 'Butter Chicken', 'Masala Dosa', 'Vada Pav', 'Chole Bhature']

// ─── Home Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('')
  const { setSearchQuery } = useStore()

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}&city=Hyderabad`
    }
  }

  return (
    <div className="bg-[#FBF6EE]">
      {/* ═══════ 1. HERO ═══════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBF6EE] via-[#FBF6EE] to-[#F5EDD9] pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-[#C8702A]/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-gradient-radial from-[#C8702A]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-20 lg:py-0">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8702A]/10 text-[#C8702A] text-xs font-medium mb-6 tracking-wide">
                <Star className="w-3.5 h-3.5" />
                India&apos;s dish-first review platform
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1E1208] leading-[1.1] tracking-tight mb-6">
                Find India&apos;s Best Dishes,
                <br />
                <span className="text-[#C8702A]">Not Just Restaurants</span>
              </h1>

              <p className="text-[#A08060] text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Search any dish. Get ranked results by that specific dish across every restaurant in your city. 4.2L dish reviews across 47 cities.
              </p>

              <div className="flex items-center gap-2 max-w-xl mx-auto lg:mx-0 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08060]" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#A08060]/20 bg-[#FBF6EE] text-[#1E1208] placeholder:text-[#A08060]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8702A]/30 focus:border-[#C8702A] transition-all"
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 px-6 rounded-xl bg-[#C8702A] hover:bg-[#E08030] text-[#FBF6EE] font-semibold text-sm gap-1.5 shrink-0 transition-all">
                  Search
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="text-xs text-[#A08060] mr-1">Popular:</span>
                {QUICK_DISHES.map((dish) => (
                  <button
                    key={dish}
                    onClick={() => { setSearchQuery(dish); window.location.href = `/search?q=${encodeURIComponent(dish)}&city=Hyderabad` }}
                    className="px-3 py-1 rounded-full border border-[#A08060]/15 text-xs text-[#A08060] hover:border-[#C8702A]/40 hover:text-[#C8702A] hover:bg-[#C8702A]/5 transition-all"
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 hidden lg:block relative">
              <div className="relative w-full max-w-md mx-auto h-[500px]">
                {TRENDING.slice(0, 3).map((dish, i) => (
                  <div
                    key={dish.name}
                    className="absolute p-5 rounded-2xl bg-[#FBF6EE] border border-[#A08060]/10 shadow-xl shadow-[#A08060]/5 hover:-translate-y-1 transition-all duration-500"
                    style={{
                      top: `${[5, 30, 5][i]}%`,
                      right: `${[5, 0, 15][i]}%`,
                      width: '18rem',
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-[#A08060] uppercase tracking-wider mb-0.5">{dish.city}</p>
                        <h3 className="font-serif text-lg font-semibold text-[#1E1208]">{dish.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-[#C8702A]/10 px-2 py-1 rounded-lg">
                        <span className="text-[#C8702A] font-bold font-sans text-sm">{dish.score.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#A08060]">
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

      {/* ═══════ 2. STATS ROW ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative group text-center py-6 px-4">
              {i > 0 && <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-px bg-[#A08060]/10" />}
              <h3 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1208] mb-1">{stat.value}</h3>
              <p className="text-xs text-[#A08060] uppercase tracking-widest font-medium">{stat.label}</p>
              <div className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-[#C8702A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3. LEADERBOARD ═══════ */}
      <section className="bg-[#F5EDD9] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Top Rated</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1208] text-center mb-8">Best Dishes Right Now</h2>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-1">
              {LEADERBOARD.map((item) => (
                <a
                  key={item.rank}
                  href={`/search?q=${encodeURIComponent(item.name)}`}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-[#FBF6EE] border border-[#A08060]/10 hover:border-[#C8702A]/20 hover:shadow-sm transition-all cursor-pointer"
                >
                  <span className="font-serif text-2xl font-bold text-[#1E1208]/30 w-8 text-center">{item.rank}</span>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-lg font-semibold text-[#1E1208] truncate">{item.name}</h4>
                    <p className="text-xs text-[#A08060] truncate">{item.restaurant}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#C8702A] font-bold font-sans text-lg">{item.score.toFixed(1)}</span>
                      <span className="text-xs text-[#A08060]">/10</span>
                    </div>
                    <p className="text-xs text-[#A08060]">{item.reviews.toLocaleString()} reviews</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#A08060]/0 group-hover:text-[#C8702A] transition-all" />
                </a>
              ))}
            </div>

            <div className="lg:col-span-2 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-[#FBF6EE] border border-[#A08060]/10 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="h-48 bg-gradient-to-br from-[#C8702A]/20 via-[#F5EDD9] to-[#C8702A]/10 flex items-center justify-center">
                  <span className="text-6xl">👑</span>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <p className="text-xs text-[#C8702A] font-semibold uppercase tracking-wider">#1 Top Rated</p>
                    <h3 className="font-serif text-2xl font-bold text-[#1E1208] mt-1">{LEADERBOARD[0]?.name || 'Top Dish'}</h3>
                    <p className="text-sm text-[#A08060]">{LEADERBOARD[0]?.restaurant || ''} · Hyderabad</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Score', value: (LEADERBOARD[0]?.score || 9.4).toFixed(1) + '/10' },
                      { label: 'Reviews', value: (LEADERBOARD[0]?.reviews || 4200).toLocaleString() },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#F5EDD9] rounded-lg p-3 text-center">
                        <p className="font-serif text-lg font-bold text-[#1E1208]">{stat.value}</p>
                        <p className="text-xs text-[#A08060]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <a href={`/search?q=${encodeURIComponent(LEADERBOARD[0]?.name || 'Biryani')}`}>
                    <Button className="w-full bg-[#C8702A] hover:bg-[#E08030] text-[#FBF6EE] gap-2">
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

      {/* ═══════ 4. TRENDING DISHES ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">🔥 What&apos;s Hot</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1208] mt-1">Trending Dishes This Week</h2>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex text-[#C8702A] gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRENDING.map((dish) => (
            <a
              key={dish.name}
              href={`/search?q=${encodeURIComponent(dish.name)}&city=${encodeURIComponent(dish.city)}`}
              className="group relative rounded-2xl border border-[#A08060]/10 bg-[#FBF6EE] overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-[#C8702A]/15 via-[#F5EDD9] to-[#F0E6CE] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6EE]/30 to-transparent" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="text-[10px] px-2 py-0.5 bg-[#C8702A] text-[#FBF6EE]">
                    {dish.badge}
                  </Badge>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#1E1208] group-hover:text-[#C8702A] transition-colors">{dish.name}</h3>
                  <p className="text-xs text-[#A08060] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {dish.city}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[#C8702A] font-bold font-sans">{dish.score.toFixed(1)}</span>
                    <span className="text-xs text-[#A08060]">/10</span>
                  </div>
                </div>
                <p className="text-xs text-[#A08060]">{dish.reviews >= 1000 ? (dish.reviews / 1000).toFixed(1) + 'K' : dish.reviews} reviews</p>
              </div>
            </a>
          ))}
        </div>

        <div className="flex sm:hidden justify-center mt-6">
          <Button variant="ghost" size="sm" className="text-[#C8702A] gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* ═══════ 5. CITY PICKER ═══════ */}
      <section className="bg-[#F0E6CE] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Explore</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1208] mt-1">Pick Your City</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CITIES.map((city) => (
              <a
                key={city.name}
                href={`/search?city=${encodeURIComponent(city.name)}`}
                className="group text-center p-6 rounded-xl bg-[#FBF6EE] border border-[#A08060]/10 hover:border-[#C8702A] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{city.emoji}</span>
                <h3 className="font-serif text-lg font-semibold text-[#1E1208] group-hover:text-[#C8702A] transition-colors">{city.name}</h3>
                <p className="text-xs text-[#A08060] mt-1">{city.count.toLocaleString()} restaurants</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 6. HOW IT WORKS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Simple Process</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1208] mt-1">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[#A08060]/10 rounded-2xl overflow-hidden">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="relative bg-[#FBF6EE] p-8 sm:p-10 hover:bg-[#F5EDD9] transition-colors duration-500 group">
              <span className="absolute top-4 right-6 font-serif text-7xl sm:text-8xl font-bold text-[#1E1208]/[0.04] select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-4xl mb-4 block">{step.icon}</span>
              <h3 className="font-serif text-xl font-bold text-[#1E1208] mt-1 mb-3">{step.title}</h3>
              <p className="text-sm text-[#A08060] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 7. REVIEW CARDS ═══════ */}
      <section className="bg-[#F5EDD9] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">Testimonials</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1208] mt-1">What Foodies Are Saying</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((review) => (
              <div key={review.name} className="group relative bg-[#FBF6EE] rounded-2xl border border-[#A08060]/10 p-6 sm:p-8 hover:shadow-lg transition-all duration-500">
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-[#C8702A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                <Quote className="w-10 h-10 text-[#C8702A]/20 mb-4" />
                <Badge variant="outline" className="mb-4 text-xs border-[#C8702A]/20 text-[#C8702A] bg-[#C8702A]/5">
                  {review.dish}
                </Badge>
                <p className="font-serif italic text-base sm:text-lg text-[#1E1208] leading-relaxed mb-6">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#A08060]/10">
                  <div className="w-10 h-10 rounded-full bg-[#C8702A]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#C8702A]">{review.initial}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E1208]">{review.name}</p>
                    <p className="text-xs text-[#A08060]">{review.title}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.stars ? 'text-[#C8702A] fill-[#C8702A]' : 'text-[#A08060]/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 8. CTA ═══════ */}
      <section className="relative bg-[#1E1208] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBF6EE] leading-tight mb-4">
            Start Reviewing Your Favourite Dishes Today
          </h2>
          <p className="text-[#A08060] text-lg mb-10">Free to join. Free forever.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/auth">
              <Button className="bg-[#C8702A] hover:bg-[#E08030] text-[#FBF6EE] px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-[#C8702A]/20 hover:shadow-xl hover:shadow-[#C8702A]/30 transition-all">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <a href="/search">
              <Button variant="outline" className="border-[#FBF6EE]/30 text-[#FBF6EE] hover:bg-[#FBF6EE]/10 hover:border-[#FBF6EE]/50 px-8 py-6 text-base">
                Browse as Guest
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
