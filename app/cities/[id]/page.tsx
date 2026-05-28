'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight, MapPin, Star, TrendingUp, Flame,
  ArrowRight, Award, Trophy, Search,
  ChevronLeft, PenSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ═════════════════════════════════════
   INTERSECTION OBSERVER HOOK
   ═════════════════════════════════════ */

function useFadeIn(threshold = 0.1) {
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

/* ═════════════════════════════════════
   CITY DATA
   ═════════════════════════════════════ */

type CityData = {
  id: string
  name: string
  state: string
  emoji: string
  heroEmoji: string
  restaurantCount: number
  dishReviewCount: number
  cuisineCount: number
  avgScore: number
  description: string
}

const CITIES: Record<string, CityData> = {
  hyderabad: { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', emoji: '🕌', heroEmoji: '🕌', restaurantCount: 2810, dishReviewCount: 42000, cuisineCount: 8, avgScore: 4.8, description: 'The City of Pearls — where centuries of Nizami heritage meet fiery flavours.' },
  mumbai: { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', emoji: '🌆', heroEmoji: '🌆', restaurantCount: 3200, dishReviewCount: 58000, cuisineCount: 12, avgScore: 4.7, description: 'The city that never sleeps — a melting pot of street food and fine dining.' },
  bengaluru: { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', emoji: '🌿', heroEmoji: '🌿', restaurantCount: 2500, dishReviewCount: 45000, cuisineCount: 10, avgScore: 4.6, description: 'India\'s Silicon Valley — where filter coffee meets global cuisine.' },
  delhi: { id: 'delhi', name: 'Delhi', state: 'Delhi', emoji: '🏛️', heroEmoji: '🏛️', restaurantCount: 2800, dishReviewCount: 51000, cuisineCount: 11, avgScore: 4.7, description: 'A thousand years of culinary history — from Mughal feasts to street-side chaat.' },
  chennai: { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', emoji: '🐟', heroEmoji: '🐟', restaurantCount: 1800, dishReviewCount: 32000, cuisineCount: 7, avgScore: 4.5, description: 'The gateway to South India — where rice, coconut, and curry leaves rule.' },
  kolkata: { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', emoji: '🎨', heroEmoji: '🎨', restaurantCount: 1500, dishReviewCount: 28000, cuisineCount: 9, avgScore: 4.6, description: 'The cultural capital — where the fish curry flows as freely as adda.' },
  pune: { id: 'pune', name: 'Pune', state: 'Maharashtra', emoji: '🏗️', heroEmoji: '🏗️', restaurantCount: 1100, dishReviewCount: 20000, cuisineCount: 8, avgScore: 4.4, description: 'Oxford of the East — a vibrant food scene with a Maharashtrian soul.' },
  ahmedabad: { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', emoji: '🏛️', heroEmoji: '🏛️', restaurantCount: 900, dishReviewCount: 16000, cuisineCount: 6, avgScore: 4.5, description: 'The heritage city — where every bite tells a story of trade and tradition.' },
  jaipur: { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', emoji: '🏯', heroEmoji: '🏯', restaurantCount: 750, dishReviewCount: 14000, cuisineCount: 7, avgScore: 4.4, description: 'The Pink City — royal Rajasthani flavours served with regal hospitality.' },
  kochi: { id: 'kochi', name: 'Kochi', state: 'Kerala', emoji: '⛵', heroEmoji: '⛵', restaurantCount: 600, dishReviewCount: 11000, cuisineCount: 6, avgScore: 4.6, description: 'Queen of the Arabian Sea — where coconut, seafood, and spices dance together.' },
}

/* Dish Categories */
const DISH_CATEGORIES = ['All', 'Biryani', 'South Indian', 'Street Food', 'North Indian', 'Seafood', 'Desserts', 'Beverages']

/* Dish emoji map */
const CATEGORY_EMOJI: Record<string, string> = {
  Biryani: '🍛',
  'South Indian': '🥞',
  'Street Food': '🌮',
  'North Indian': '🍗',
  Seafood: '🦐',
  Desserts: '🍨',
  Beverages: '🥤',
}

/* Leaderboard Data */
type LeaderboardCategory = {
  category: string
  dishes: { name: string; restaurant: string; score: number; id: string }[]
}

const HYDERABAD_LEADERBOARDS: LeaderboardCategory[] = [
  {
    category: 'Biryani',
    dishes: [
      { name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, id: 'lib-bir-1' },
      { name: 'Chicken Biryani', restaurant: 'Shah Ghouse Cafe', score: 9.2, id: 'lib-bir-2' },
      { name: 'Mutton Biryani', restaurant: 'Bawarchi', score: 9.0, id: 'lib-bir-3' },
    ],
  },
  {
    category: 'South Indian',
    dishes: [
      { name: 'Masala Dosa', restaurant: 'Ulavacharu', score: 9.1, id: 'lib-sou-1' },
      { name: 'Rava Idli', restaurant: 'Sagari', score: 8.8, id: 'lib-sou-2' },
      { name: 'Filter Coffee', restaurant: 'Chai Shai', score: 8.7, id: 'lib-sou-3' },
    ],
  },
  {
    category: 'Street Food',
    dishes: [
      { name: 'Pani Puri', restaurant: 'Jaljeera Corner', score: 9.0, id: 'lib-str-1' },
      { name: 'Mirchi Bajji', restaurant: 'Street Treats', score: 8.7, id: 'lib-str-2' },
      { name: 'Vada Pav', restaurant: 'Mumbai Express', score: 8.5, id: 'lib-str-3' },
    ],
  },
  {
    category: 'North Indian',
    dishes: [
      { name: 'Butter Chicken', restaurant: 'Punjab Grill', score: 8.9, id: 'lib-nor-1' },
      { name: 'Dal Makhani', restaurant: 'Punjab Grill', score: 8.7, id: 'lib-nor-2' },
      { name: 'Paneer Tikka', restaurant: 'Tandoori Nights', score: 8.5, id: 'lib-nor-3' },
    ],
  },
  {
    category: 'Seafood',
    dishes: [
      { name: 'Andhra Fish Curry', restaurant: 'Coastal Kitchen', score: 9.2, id: 'lib-sea-1' },
      { name: 'Prawns Biryani', restaurant: 'Sea Breeze', score: 8.9, id: 'lib-sea-2' },
      { name: 'Crab Masala', restaurant: 'Coastal Kitchen', score: 8.7, id: 'lib-sea-3' },
    ],
  },
  {
    category: 'Desserts',
    dishes: [
      { name: 'Qubani Ka Meetha', restaurant: 'Nizam\'s Delight', score: 9.3, id: 'lib-des-1' },
      { name: 'Double Ka Meetha', restaurant: 'Nizam\'s Delight', score: 9.0, id: 'lib-des-2' },
      { name: 'Iranian Chai', restaurant: 'Shah Ghouse Cafe', score: 8.8, id: 'lib-des-3' },
    ],
  },
  {
    category: 'Beverages',
    dishes: [
      { name: 'Irani Chai', restaurant: 'Nimrah Cafe', score: 9.1, id: 'lib-bev-1' },
      { name: 'Lassi', restaurant: 'Dairy Delight', score: 8.6, id: 'lib-bev-2' },
      { name: 'Fresh Lime Soda', restaurant: 'Cafe Niloufer', score: 8.4, id: 'lib-bev-3' },
    ],
  },
]

/* Restaurants Data */
type RestaurantData = {
  id: string
  name: string
  area: string
  cuisines: string[]
  overallScore: number
  topDish: string
  topDishScore: number
  priceRange: number
  reviewCount: number
}

const HYDERABAD_RESTAURANTS: RestaurantData[] = [
  { id: 'r1', name: 'Paradise Restaurant', area: 'Secunderabad', cuisines: ['Biryani', 'Mughlai', 'North Indian'], overallScore: 9.2, topDish: 'Hyderabadi Dum Biryani', topDishScore: 9.4, priceRange: 2, reviewCount: 4230 },
  { id: 'r2', name: 'Shah Ghouse Cafe', area: 'Old City', cuisines: ['Biryani', 'Haleem', 'Mughlai'], overallScore: 9.1, topDish: 'Chicken Biryani', topDishScore: 9.2, priceRange: 2, reviewCount: 3100 },
  { id: 'r3', name: 'Bawarchi', area: 'RTC Cross Roads', cuisines: ['Biryani', 'Mughlai'], overallScore: 9.0, topDish: 'Mutton Biryani', topDishScore: 9.0, priceRange: 2, reviewCount: 2800 },
  { id: 'r4', name: 'Ulavacharu', area: 'Banjara Hills', cuisines: ['South Indian', 'Andhra'], overallScore: 8.9, topDish: 'Masala Dosa', topDishScore: 9.1, priceRange: 2, reviewCount: 1900 },
  { id: 'r5', name: 'Punjab Grill', area: 'Jubilee Hills', cuisines: ['North Indian', 'Mughlai'], overallScore: 8.8, topDish: 'Butter Chicken', topDishScore: 8.9, priceRange: 3, reviewCount: 2200 },
  { id: 'r6', name: 'Coastal Kitchen', area: 'Gachibowli', cuisines: ['Seafood', 'Andhra'], overallScore: 8.7, topDish: 'Andhra Fish Curry', topDishScore: 9.2, priceRange: 3, reviewCount: 1500 },
  { id: 'r7', name: 'Mehfil Restaurant', area: 'Banjara Hills', cuisines: ['Biryani', 'Mughlai'], overallScore: 8.6, topDish: 'Chicken Biryani', topDishScore: 8.7, priceRange: 3, reviewCount: 2100 },
  { id: 'r8', name: 'Shadab Hotel', area: 'Old City', cuisines: ['Biryani', 'Haleem'], overallScore: 8.6, topDish: 'Haleem', topDishScore: 8.8, priceRange: 2, reviewCount: 1800 },
  { id: 'r9', name: 'Cafe Bahar', area: 'Basheerbagh', cuisines: ['Biryani', 'Mughlai'], overallScore: 8.5, topDish: 'Chicken Biryani', topDishScore: 8.6, priceRange: 2, reviewCount: 1600 },
]

const AREAS = ['All Areas', 'Banjara Hills', 'Jubilee Hills', 'Old City', 'Secunderabad', 'Gachibowli', 'Hitech City', 'Ameerpet', 'Kukatpally']

/* Trending Data */
type TrendingDish = {
  emoji: string
  name: string
  restaurant: string
  score: number
  weeklyReviews: number
  trend: 'viral' | 'rising'
}

const TRENDING_DISHES: TrendingDish[] = [
  { emoji: '🦐', name: 'Andhra Fish Curry', restaurant: 'Coastal Kitchen', score: 9.2, weeklyReviews: 156, trend: 'viral' },
  { emoji: '🍛', name: 'Hyderabadi Dum Biryani', restaurant: 'Paradise Restaurant', score: 9.4, weeklyReviews: 124, trend: 'viral' },
  { emoji: '🥞', name: 'Masala Dosa', restaurant: 'Ulavacharu', score: 9.1, weeklyReviews: 98, trend: 'rising' },
  { emoji: '🍨', name: 'Qubani Ka Meetha', restaurant: 'Nizam\'s Delight', score: 9.3, weeklyReviews: 87, trend: 'rising' },
  { emoji: '🌮', name: 'Pani Puri', restaurant: 'Jaljeera Corner', score: 9.0, weeklyReviews: 112, trend: 'viral' },
  { emoji: '🍗', name: 'Butter Chicken', restaurant: 'Punjab Grill', score: 8.9, weeklyReviews: 76, trend: 'rising' },
  { emoji: '🥤', name: 'Irani Chai', restaurant: 'Nimrah Cafe', score: 9.1, weeklyReviews: 134, trend: 'viral' },
]

/* Area Data */
type AreaData = {
  name: string
  restaurantCount: number
  knownFor: string
}

const AREA_DATA: AreaData[] = [
  { name: 'Banjara Hills', restaurantCount: 340, knownFor: 'Fine Dining, Pan-Asian' },
  { name: 'Jubilee Hills', restaurantCount: 280, knownFor: 'Cafes, Continental' },
  { name: 'Old City', restaurantCount: 420, knownFor: 'Biryani, Haleem' },
  { name: 'Secunderabad', restaurantCount: 190, knownFor: 'Biryani, Mughlai' },
  { name: 'Gachibowli', restaurantCount: 210, knownFor: 'North Indian, Chinese' },
  { name: 'Hitech City', restaurantCount: 260, knownFor: 'Multi-cuisine, Cafes' },
  { name: 'Ameerpet', restaurantCount: 180, knownFor: 'Budget Eating, Street Food' },
  { name: 'Kukatpally', restaurantCount: 150, knownFor: 'South Indian, Andhra' },
]

/* Cuisine Guide Data */
type CuisineGuide = {
  name: string
  emoji: string
  description: string
  mustTry: string[]
}

const CUISINE_GUIDE: CuisineGuide[] = [
  {
    name: 'Hyderabadi',
    emoji: '👑',
    description: 'The city\'s soul — biryani, haleem, mirchi ka salan',
    mustTry: ['Hyderabadi Dum Biryani', 'Haleem', 'Mirchi Ka Salan'],
  },
  {
    name: 'South Indian',
    emoji: '🥞',
    description: 'Dosas, idlis and filter coffee',
    mustTry: ['Masala Dosa', 'Rava Idli', 'Filter Coffee'],
  },
  {
    name: 'Street Food',
    emoji: '🌮',
    description: 'Chaat, vada pav, pani puri',
    mustTry: ['Pani Puri', 'Mirchi Bajji', 'Bhel Puri'],
  },
  {
    name: 'Mughlai',
    emoji: '🍗',
    description: 'Rich curries and kebabs',
    mustTry: ['Chicken Tikka', 'Mutton Korma', 'Nihari'],
  },
]

/* Reviews Data */
type ReviewItem = {
  id: string
  reviewerName: string
  dishName: string
  restaurantName: string
  text: string
  rating: number
  isVerified: boolean
}

const HYDERABAD_REVIEWS: ReviewItem[] = [
  { id: 'rev1', reviewerName: 'Arun K.', dishName: 'Hyderabadi Dum Biryani', restaurantName: 'Paradise Restaurant', text: 'The biryani here is simply unparalleled. Every grain of rice is perfectly cooked, the masala is well-balanced, and the chicken falls off the bone.', rating: 9.4, isVerified: true },
  { id: 'rev2', reviewerName: 'Priya S.', dishName: 'Haleem', restaurantName: 'Shah Ghouse Cafe', text: 'This Haleem is the best I have had outside of the old city. Creamy texture, perfectly spiced. A must-have during Ramadan.', rating: 9.2, isVerified: true },
  { id: 'rev3', reviewerName: 'Rahul M.', dishName: 'Masala Dosa', restaurantName: 'Ulavacharu', text: 'Crispy, golden, and loaded with perfectly spiced potato filling. The accompanying chutneys are divine — especially the coconut one.', rating: 9.1, isVerified: true },
  { id: 'rev4', reviewerName: 'Ananya R.', dishName: 'Qubani Ka Meetha', restaurantName: 'Nizam\'s Delight', text: 'An absolute masterpiece. The apricots are beautifully cooked, the cream is light, and the nuts add the perfect crunch. Royal dessert.', rating: 9.3, isVerified: false },
  { id: 'rev5', reviewerName: 'Vikram P.', dishName: 'Andhra Fish Curry', restaurantName: 'Coastal Kitchen', text: 'Fiery, tangy, and absolutely delicious. The curry is packed with flavour and the fish is incredibly fresh. Authentic Andhra taste!', rating: 9.2, isVerified: true },
  { id: 'rev6', reviewerName: 'Neha G.', dishName: 'Irani Chai', restaurantName: 'Nimrah Cafe', text: 'Nothing beats the Irani Chai at Nimrah. Thick, sweet, creamy — it is like a hug in a cup. Paired with their Osmania biscuit, perfect.', rating: 9.1, isVerified: false },
]

/* Nearby Cities */
const NEARBY_CITIES = [
  { id: 'mumbai', name: 'Mumbai', emoji: '🌆', restaurantCount: 3200, topDish: 'Vada Pav' },
  { id: 'bengaluru', name: 'Bengaluru', emoji: '🌿', restaurantCount: 2500, topDish: 'Masala Dosa' },
  { id: 'chennai', name: 'Chennai', emoji: '🐟', restaurantCount: 1800, topDish: 'Filter Coffee' },
  { id: 'pune', name: 'Pune', emoji: '🏗️', restaurantCount: 1100, topDish: 'Pav Bhaji' },
]

/* ═════════════════════════════════════
   COMPONENT
   ═════════════════════════════════════ */

export default function CityDetailPage() {
  const params = useParams()
  const id = params?.id as string || 'hyderabad'

  const city = CITIES[id as keyof typeof CITIES] || CITIES.hyderabad
  const cityName = city.name

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeArea, setActiveArea] = useState('All Areas')

  const trendingScrollRef = useRef<HTMLDivElement>(null)
  const nearbyScrollRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  /* ── Filtered data ── */
  const filteredLeaderboards = activeCategory === 'All'
    ? HYDERABAD_LEADERBOARDS
    : HYDERABAD_LEADERBOARDS.filter((lb) => lb.category === activeCategory)

  const filteredRestaurants = activeArea === 'All Areas'
    ? HYDERABAD_RESTAURANTS
    : HYDERABAD_RESTAURANTS.filter((r) => r.area === activeArea)

  /* ── Scroll handlers ── */
  const scrollLeft = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }
  const scrollRight = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  /* ── Category tab sticky scroll offset ── */
  useEffect(() => {
    const handleScroll = () => {
      if (!categoryRef.current) return
      const rect = categoryRef.current.getBoundingClientRect()
      if (rect.top <= 80 && rect.bottom > 0) {
        categoryRef.current.classList.add('shadow-md')
      } else {
        categoryRef.current.classList.remove('shadow-md')
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="overflow-hidden">
      {/* ═════════════════════════════
          1. CITY HERO
           ═════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-darker pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-saffron/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-gradient-radial from-saffron/5 via-transparent to-transparent pointer-events-none" />

        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, ${'#C8702A'} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <FadeUpSection>
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-brown-muted mb-8">
              <Link href="/" className="hover:text-saffron transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/cities" className="hover:text-saffron transition-colors">Cities</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-ink font-medium">{cityName}</span>
            </nav>
          </FadeUpSection>

          <div className="text-center">
            <FadeUpSection>
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-saffron/20 via-cream-darker to-saffron/10 border border-saffron/15 mb-6 animate-float">
                <span className="text-5xl sm:text-6xl">{city.heroEmoji}</span>
              </div>
            </FadeUpSection>

            <FadeUpSection>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-4 tracking-wide">
                <MapPin className="w-3.5 h-3.5" />
                {city.state} · India
              </div>
            </FadeUpSection>

            <FadeUpSection>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.05] tracking-tight mb-2">
                {cityName}
              </h1>
            </FadeUpSection>

            <FadeUpSection>
              <p className="text-brown-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
                {city.description}
              </p>
            </FadeUpSection>

            {/* Stats Row */}
            <FadeUpSection>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-8">
                {[
                  { value: `${(city.restaurantCount / 1000).toFixed(1)}K`, label: 'Restaurants' },
                  { value: `${(city.dishReviewCount / 1000).toFixed(0)}K`, label: 'Dish Reviews' },
                  { value: city.cuisineCount, label: 'Cuisines' },
                  { value: city.avgScore.toFixed(1), label: 'Avg City Score' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-2xl sm:text-3xl font-bold text-ink">{stat.value}</p>
                    <p className="text-xs text-brown-muted uppercase tracking-wider mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeUpSection>

            {/* Action buttons */}
            <FadeUpSection>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href={`/search?city=${encodeURIComponent(cityName)}`}>
                  <Button className="bg-saffron hover:bg-saffron-light text-cream px-6 py-5 text-sm font-semibold gap-2 shadow-lg shadow-saffron/20 rounded-xl">
                    <Search className="w-4 h-4" />
                    Explore All Dishes
                  </Button>
                </Link>
                <Link href="/review/new">
                  <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 px-6 py-5 text-sm gap-2 rounded-xl">
                    <PenSquare className="w-4 h-4" />
                    Write a Review
                  </Button>
                </Link>
              </div>
            </FadeUpSection>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FBF6EE] to-transparent pointer-events-none" />
      </section>

      {/* ═════════════════════════════
          2. CITY DISH LEADERBOARDS
           ═════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <FadeUpSection>
          <div className="mb-10">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Ranked by verified reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
              Best Dishes in {cityName}
            </h2>
          </div>
        </FadeUpSection>

        {/* Sticky Category Tabs */}
        <FadeUpSection>
          <div
            ref={categoryRef}
            className="sticky top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-[#FBF6EE]/90 backdrop-blur-md transition-shadow duration-300"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DISH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-saffron text-cream shadow-md shadow-saffron/20'
                      : 'bg-cream-dark text-brown-muted border border-brown-muted/10 hover:border-saffron/30 hover:text-saffron'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeUpSection>

        {/* Leaderboard Cards Grid (2 columns) */}
        <FadeUpSection>
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {filteredLeaderboards.map((lb) => (
              <div
                key={lb.category}
                className="group rounded-2xl bg-cream border border-brown-muted/10 p-6 hover:shadow-lg hover:border-saffron/20 transition-all duration-500"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{CATEGORY_EMOJI[lb.category] || '🍽️'}</span>
                    <h3 className="font-serif text-xl font-bold text-ink">{lb.category}</h3>
                  </div>
                  <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[10px] px-2 py-0.5">
                    Top 3
                  </Badge>
                </div>

                {/* #1 Dish */}
                <Link
                  href={`/dish/${lb.dishes[0].id}`}
                  className="block p-4 rounded-xl bg-gradient-to-r from-saffron/10 via-saffron/5 to-cream border border-saffron/15 hover:border-saffron/30 transition-all group/dish"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-saffron shrink-0" />
                      <div>
                        <p className="font-serif text-lg font-bold text-ink group-hover/dish:text-saffron transition-colors">
                          {lb.dishes[0].name}
                        </p>
                        <p className="text-xs text-brown-muted">{lb.dishes[0].restaurant}</p>
                      </div>
                    </div>
                    <div className="bg-saffron rounded-lg px-2.5 py-1 text-center min-w-[48px]">
                      <span className="block text-sm font-bold text-cream">{lb.dishes[0].score.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>

                {/* #2 Dish */}
                <Link
                  href={`/dish/${lb.dishes[1].id}`}
                  className="block mt-2 p-3 rounded-xl hover:bg-cream-dark transition-colors group/dish"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-serif text-lg font-bold text-brown-muted/50">2</span>
                      <div>
                        <p className="text-sm font-semibold text-ink group-hover/dish:text-saffron transition-colors">
                          {lb.dishes[1].name}
                        </p>
                        <p className="text-[11px] text-brown-muted">{lb.dishes[1].restaurant}</p>
                      </div>
                    </div>
                    <span className="text-saffron font-bold font-sans text-sm">{lb.dishes[1].score.toFixed(1)}</span>
                  </div>
                </Link>

                {/* #3 Dish */}
                <Link
                  href={`/dish/${lb.dishes[2].id}`}
                  className="block p-3 rounded-xl hover:bg-cream-dark transition-colors group/dish"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-serif text-lg font-bold text-brown-muted/40">3</span>
                      <div>
                        <p className="text-sm font-semibold text-ink group-hover/dish:text-saffron transition-colors">
                          {lb.dishes[2].name}
                        </p>
                        <p className="text-[11px] text-brown-muted">{lb.dishes[2].restaurant}</p>
                      </div>
                    </div>
                    <span className="text-saffron font-bold font-sans text-sm">{lb.dishes[2].score.toFixed(1)}</span>
                  </div>
                </Link>

                <Link
                  href={`/search?category=${encodeURIComponent(lb.category)}&city=${encodeURIComponent(cityName)}`}
                  className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-saffron/10 text-saffron text-sm font-semibold hover:bg-saffron hover:text-cream transition-all"
                >
                  View Full {lb.category} Leaderboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </FadeUpSection>
      </section>

      {/* ═════════════════════════════
          3. TOP RESTAURANTS IN CITY
           ═════════════════════════════ */}
      <section id="restaurants-section" className="bg-cream-dark/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUpSection>
            <div className="mb-10">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">By overall score</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                Top Rated Restaurants
              </h2>
            </div>
          </FadeUpSection>

          {/* Area Filter */}
          <FadeUpSection>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => setActiveArea(area)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeArea === area
                      ? 'bg-saffron text-cream shadow-sm shadow-saffron/20'
                      : 'bg-cream text-brown-muted border border-brown-muted/15 hover:border-saffron/30 hover:text-saffron'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </FadeUpSection>

          {/* Restaurant Cards Grid (3 columns) */}
          <FadeUpSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurant/${restaurant.id}`}
                  className="group relative rounded-2xl bg-cream border border-brown-muted/10 p-5 hover:-translate-y-1.5 hover:shadow-xl hover:border-saffron/25 transition-all duration-500"
                >
                  {/* Score Badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-saffron flex items-center justify-center shadow-lg shadow-saffron/20 z-10">
                    <span className="text-white font-bold font-sans text-sm">{restaurant.overallScore.toFixed(1)}</span>
                  </div>

                  {/* Restaurant Image Placeholder */}
                  <div className="h-32 rounded-xl bg-gradient-to-br from-saffron/15 via-cream-darker to-cream-dark flex items-center justify-center mb-4 overflow-hidden">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-500">
                      {restaurant.cuisines.includes('Biryani') ? '🍛' : '🍽️'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-ink group-hover:text-saffron transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-xs text-brown-muted mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {restaurant.area}
                  </p>

                  {/* Cuisine Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {restaurant.cuisines.map((c) => (
                      <Badge key={c} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {c}
                      </Badge>
                    ))}
                  </div>

                  {/* Top Dish */}
                  <div className="mt-4 pt-4 border-t border-brown-muted/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-brown-muted">Best Dish</span>
                      <span className="text-saffron font-bold font-sans">{restaurant.topDishScore.toFixed(1)}</span>
                    </div>
                    <p className="text-sm font-medium text-ink truncate">{restaurant.topDish}</p>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-brown-muted/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-ink">
                        {'₹'.repeat(restaurant.priceRange)}
                      </span>
                      <span className="text-[10px] text-brown-muted">·</span>
                      <span className="text-xs text-brown-muted">{restaurant.reviewCount.toLocaleString()} reviews</span>
                    </div>
                    <span className="text-xs text-saffron font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeUpSection>

          <FadeUpSection>
            <div className="text-center mt-10">
              <Link href={`/search?city=${encodeURIComponent(cityName)}`}>
                <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 gap-2 px-6 py-5 rounded-xl">
                  View All {cityName} Restaurants
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeUpSection>
        </div>
      </section>

      {/* ═════════════════════════════
          4. TRENDING THIS WEEK
           ═════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUpSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">This Week</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                Trending in {cityName} This Week
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scrollLeft(trendingScrollRef)}
                className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRight(trendingScrollRef)}
                className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div
            ref={trendingScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {TRENDING_DISHES.map((item, i) => (
              <div
                key={i}
                className="group flex-shrink-0 w-[240px] sm:w-[260px] snap-start rounded-2xl bg-cream border border-brown-muted/10 p-5 hover:border-saffron/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Trending Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className={`text-[10px] px-2 py-0.5 gap-1 ${
                      item.trend === 'viral'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    {item.trend === 'viral' ? (
                      <Flame className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {item.trend === 'viral' ? '🔥 Viral' : '📈 Rising'}
                  </Badge>
                </div>

                {/* Emoji Placeholder */}
                <div className="w-full h-24 rounded-xl bg-gradient-to-br from-saffron/10 via-cream-darker to-cream-dark flex items-center justify-center mb-4 overflow-hidden">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-500">
                    {item.emoji}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-ink group-hover:text-saffron transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-brown-muted mt-0.5">{item.restaurant}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-brown-muted/10">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
                    <span className="text-saffron font-bold font-sans text-sm">{item.score.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +{item.weeklyReviews} reviews
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeUpSection>
      </section>

      {/* ═════════════════════════════
          5. AREA EXPLORER
           ═════════════════════════════ */}
      <section className="bg-cream-dark/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUpSection>
            <div className="mb-10">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Neighbourhoods</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                Explore by Area
              </h2>
              <p className="text-brown-muted text-sm mt-1">Click an area to filter restaurants</p>
            </div>
          </FadeUpSection>

          <FadeUpSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {AREA_DATA.map((area) => (
                <button
                  key={area.name}
                  onClick={() => {
                    setActiveArea(area.name)
                    // Scroll to restaurants section
                    document.getElementById('restaurants-section')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`group text-left p-5 rounded-2xl border transition-all duration-300 ${
                    activeArea === area.name
                      ? 'bg-saffron/10 border-saffron/30 shadow-md shadow-saffron/5'
                      : 'bg-cream border-brown-muted/10 hover:border-saffron/25 hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activeArea === area.name
                        ? 'bg-saffron text-cream'
                        : 'bg-saffron/10 text-saffron group-hover:bg-saffron group-hover:text-cream transition-all'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-serif text-2xl font-bold text-ink">
                      {area.restaurantCount}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink group-hover:text-saffron transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-xs text-brown-muted mt-0.5">{area.restaurantCount} restaurants</p>
                  <div className="mt-3 pt-3 border-t border-brown-muted/10">
                    <p className="text-[11px] text-brown-muted">Known for:</p>
                    <p className="text-sm font-medium text-ink">{area.knownFor}</p>
                  </div>
                </button>
              ))}
            </div>
          </FadeUpSection>
        </div>
      </section>

      {/* ═════════════════════════════
          6. CUISINE GUIDE
           ═════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUpSection>
          <div className="mb-10">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">What to eat here</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
              {cityName} Food Guide
            </h2>
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CUISINE_GUIDE.map((cuisine) => (
              <div
                key={cuisine.name}
                className="group rounded-2xl bg-cream border border-brown-muted/10 p-6 hover:border-saffron/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron/15 to-cream-darker flex items-center justify-center mb-4">
                  <span className="text-2xl">{cuisine.emoji}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-2">{cuisine.name}</h3>
                <p className="text-sm text-brown-muted leading-relaxed mb-4">
                  {cuisine.description}
                </p>
                <div className="pt-4 border-t border-brown-muted/10">
                  <p className="text-[11px] text-brown-muted uppercase tracking-wider mb-2 font-semibold">
                    Must Try
                  </p>
                  <ul className="space-y-1.5">
                    {cuisine.mustTry.map((dish) => (
                      <li key={dish} className="text-sm text-ink flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-saffron shrink-0" />
                        {dish}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </FadeUpSection>
      </section>

      {/* ═════════════════════════════
          7. RECENT REVIEWS IN CITY
           ═════════════════════════════ */}
      <section className="bg-cream-dark/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUpSection>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Community</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                  Latest Reviews in {cityName}
                </h2>
              </div>
              <Link href="/review/new">
                <Button className="bg-saffron hover:bg-saffron-light text-cream gap-2 px-5 py-5 rounded-xl shadow-lg shadow-saffron/20">
                  <PenSquare className="w-4 h-4" />
                  Write a Review
                </Button>
              </Link>
            </div>
          </FadeUpSection>

          <FadeUpSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HYDERABAD_REVIEWS.map((review) => (
                <div
                  key={review.id}
                  className="group rounded-2xl bg-cream border border-brown-muted/10 p-6 hover:shadow-lg hover:border-saffron/15 transition-all duration-300"
                >
                  {/* Quote Mark */}
                  <div className="text-4xl font-serif text-saffron/20 leading-none mb-2">&ldquo;</div>

                  {/* Dish Pill */}
                  <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[11px] px-2.5 py-0.5 mb-3">
                    {review.dishName}
                  </Badge>

                  {/* Review Text */}
                  <p className="font-serif italic text-sm sm:text-base text-ink/80 leading-relaxed mb-4 line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-brown-muted/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-saffron/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-saffron">
                          {review.reviewerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{review.reviewerName}</p>
                        <p className="text-[10px] text-brown-muted">{review.restaurantName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-saffron font-bold font-sans text-sm">{review.rating.toFixed(1)}</span>
                      {review.isVerified && (
                        <Badge className="bg-saffron/10 text-saffron border-saffron/20 text-[8px] px-1 py-0">✓</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUpSection>

          <FadeUpSection>
            <div className="text-center mt-10">
              <Link href={`/search?city=${encodeURIComponent(cityName)}`}>
                <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 gap-2 px-6 py-5 rounded-xl">
                  Read All Reviews
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeUpSection>
        </div>
      </section>

      {/* ═════════════════════════════
          8. NEARBY CITIES
           ═════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <FadeUpSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Explore More</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">
                Explore Nearby Cities
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scrollLeft(nearbyScrollRef)}
                className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollRight(nearbyScrollRef)}
                className="w-8 h-8 rounded-full bg-cream border border-brown-muted/15 flex items-center justify-center text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </FadeUpSection>

        <FadeUpSection>
          <div
            ref={nearbyScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {NEARBY_CITIES.map((nearby) => (
              <Link
                key={nearby.id}
                href={`/cities/${nearby.id}`}
                className="group flex-shrink-0 w-[240px] sm:w-[260px] snap-start rounded-2xl bg-cream border border-brown-muted/10 p-5 hover:border-saffron/25 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Emoji */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron/15 to-cream-darker flex items-center justify-center mb-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-500">
                    {nearby.emoji}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-ink group-hover:text-saffron transition-colors">
                  {nearby.name}
                </h3>

                <div className="flex items-center gap-2 mt-2 text-xs text-brown-muted">
                  <MapPin className="w-3 h-3" />
                  <span>{nearby.restaurantCount.toLocaleString()} restaurants</span>
                </div>

                <div className="mt-4 pt-4 border-t border-brown-muted/10">
                  <p className="text-[10px] text-brown-muted uppercase tracking-wider">Top Dish</p>
                  <p className="text-sm font-semibold text-ink mt-0.5">{nearby.topDish}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-brown-muted/10">
                  <span className="text-xs text-saffron font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore {nearby.name}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeUpSection>
      </section>

      {/* ═════════════════════════════
           CTA BANNER
           ═════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <FadeUpSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron/20 via-cream-darker to-saffron/10 border border-saffron/20 p-10 sm:p-14 text-center">
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[60%] bg-gradient-radial from-saffron/15 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-gradient-radial from-saffron/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
              <span className="text-5xl mb-4 block">🕌</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
                Know {cityName}&apos;s Food Better?
              </h2>
              <p className="text-brown-muted text-sm max-w-md mx-auto mb-8">
                Share your experience and help others discover the best dishes in the city.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/review/new">
                  <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-5 text-base font-semibold gap-2 shadow-lg shadow-saffron/20 rounded-xl">
                    <PenSquare className="w-4 h-4" />
                    Write a Review
                  </Button>
                </Link>
                <Link href="/leaderboards">
                  <Button variant="outline" className="border-brown-muted/15 text-brown-muted hover:text-saffron hover:border-saffron/30 px-8 py-5 text-base gap-2 rounded-xl">
                    <Award className="w-4 h-4" />
                    View All Leaderboards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </FadeUpSection>
      </section>
    </div>
  )
}
