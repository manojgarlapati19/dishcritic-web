'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Star,
  Award,
  ThumbsUp,
  Heart,
  Bookmark,
  Edit3,
  UserPlus,
  Check,
  X,
  TrendingUp,
  UtensilsCrossed,
  Clock,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TasteBadge {
  icon: string
  name: string
  description: string
  earned: boolean
  progress: number // 0-100
  current: number
  target: number
}

interface ReviewData {
  id: number
  dishName: string
  dishPhoto: string
  restaurantName: string
  restaurantCity: string
  score: number
  reviewText: string
  tags: string[]
  date: string
  helpfulVotes: number
}

interface DishReview {
  id: number
  name: string
  score: number
  restaurantName: string
  photoUrl: string
}

interface RestaurantVisit {
  id: number
  name: string
  area: string
  city: string
  cuisineType: string[]
  userRating: number
  visitDate: string
  photoUrl: string
}

interface PhotoItem {
  id: number
  dishName: string
  score: number
  url: string
}

interface SavedRestaurant {
  id: number
  name: string
  area: string
  city: string
  cuisineType: string[]
  overallScore: number
}

interface TasteProfileData {
  favouriteCuisines: { name: string; percentage: number }[]
  mostReviewedDishes: string[]
  averageRating: number
  preferredPriceRange: string
  vegRatio: number // percentage of veg dishes
  nonVegRatio: number
  citiesExplored: string[]
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_PROFILE = {
  name: 'Arjun Mehta',
  initials: 'AM',
  city: 'Hyderabad',
  joinDate: 'March 2022',
  bio: 'Food obsessive. Biryani hunter. Eaten at 200+ restaurants across India. Always on the lookout for the next great meal.',
  stats: {
    totalReviews: 142,
    restaurantsVisited: 89,
    helpfulVotes: 1204,
    followers: 340,
    following: 128,
  },
}

const SAMPLE_BADGES: TasteBadge[] = [
  {
    icon: '🍛',
    name: 'Biryani Expert',
    description: 'Reviewed 40+ biryanis',
    earned: true,
    progress: 82,
    current: 42,
    target: 50,
  },
  {
    icon: '🫓',
    name: 'South Indian Connoisseur',
    description: 'Reviewed 30+ South Indian dishes',
    earned: true,
    progress: 73,
    current: 37,
    target: 50,
  },
  {
    icon: '🍢',
    name: 'Street Food Fanatic',
    description: 'Reviewed 50+ street food items',
    earned: true,
    progress: 88,
    current: 56,
    target: 75,
  },
  {
    icon: '⭐',
    name: 'Top Reviewer',
    description: '500+ helpful votes',
    earned: true,
    progress: 100,
    current: 1204,
    target: 500,
  },
  {
    icon: '✅',
    name: 'Verified Reviewer',
    description: 'Uploaded 20+ bills',
    earned: true,
    progress: 65,
    current: 22,
    target: 50,
  },
  {
    icon: '📸',
    name: 'Photo Pro',
    description: 'Uploaded 100+ photos',
    earned: true,
    progress: 45,
    current: 78,
    target: 100,
  },
  {
    icon: '🌶️',
    name: 'Spice Master',
    description: 'Reviewed 60+ spicy dishes',
    earned: false,
    progress: 52,
    current: 31,
    target: 60,
  },
  {
    icon: '🍜',
    name: 'Noodle Expert',
    description: 'Reviewed 25+ noodle dishes',
    earned: false,
    progress: 28,
    current: 7,
    target: 25,
  },
]

const SAMPLE_REVIEWS: ReviewData[] = [
  {
    id: 1,
    dishName: 'Hyderabadi Dum Biryani',
    dishPhoto: '',
    restaurantName: 'Paradise Restaurant',
    restaurantCity: 'Hyderabad',
    score: 9.4,
    reviewText: 'The aroma hits you before it even reaches the table. Perfectly layered rice, tender meat that falls off the bone, and just the right amount of masala. This is what biryani heaven tastes like.',
    tags: ['Perfect Spice', 'Good Portion', 'Authentic', 'Freshly Made'],
    date: '2 weeks ago',
    helpfulVotes: 47,
  },
  {
    id: 2,
    dishName: 'Mutton Dum Biryani',
    dishPhoto: '',
    restaurantName: 'Shah Ghouse Cafe',
    restaurantCity: 'Hyderabad',
    score: 9.2,
    reviewText: 'Their mutton biryani is legendary for a reason. The meat is cooked to perfection and the rice grains are separate and fragrant. A must-try for any biryani lover.',
    tags: ['Perfect Spice', 'Large Portion', 'Worth It', 'Authentic'],
    date: '1 month ago',
    helpfulVotes: 34,
  },
  {
    id: 3,
    dishName: 'Chicken Dum Biryani',
    dishPhoto: '',
    restaurantName: 'Bawarchi',
    restaurantCity: 'Hyderabad',
    score: 9.0,
    reviewText: 'Bawarchi lives up to its reputation. The masala is unique - distinct from other places. Chicken was juicy and well-marinated. The raita was the perfect accompaniment.',
    tags: ['Perfect Spice', 'Good Portion', 'Great Value', 'Freshly Made'],
    date: '1 month ago',
    helpfulVotes: 28,
  },
  {
    id: 4,
    dishName: 'Kacchi Gosht Biryani',
    dishPhoto: '',
    restaurantName: 'Cafe Bahar',
    restaurantCity: 'Hyderabad',
    score: 8.9,
    reviewText: 'The kacchi style where raw meat is cooked with the rice gives it a depth of flavour you just cannot get elsewhere. Rich, aromatic, and absolutely satisfying.',
    tags: ['Perfect Spice', 'Small Portion', 'Authentic'],
    date: '2 months ago',
    helpfulVotes: 22,
  },
  {
    id: 5,
    dishName: 'Veg Dum Biryani',
    dishPhoto: '',
    restaurantName: 'Honest Restaurant',
    restaurantCity: 'Hyderabad',
    score: 8.7,
    reviewText: 'Surprisingly good for a veg biryani. The vegetables were fresh and the rice was perfectly spiced. Even my non-veg friends enjoyed it!',
    tags: ['Mild', 'Good Portion', 'Great Value', 'Freshly Made'],
    date: '2 months ago',
    helpfulVotes: 19,
  },
]

const SAMPLE_DISHES: DishReview[] = [
  { id: 1, name: 'Hyderabadi Dum Biryani', score: 9.4, restaurantName: 'Paradise Restaurant', photoUrl: '' },
  { id: 2, name: 'Mutton Dum Biryani', score: 9.2, restaurantName: 'Shah Ghouse Cafe', photoUrl: '' },
  { id: 3, name: 'Chicken Dum Biryani', score: 9.0, restaurantName: 'Bawarchi', photoUrl: '' },
  { id: 4, name: 'Kacchi Gosht Biryani', score: 8.9, restaurantName: 'Cafe Bahar', photoUrl: '' },
  { id: 5, name: 'Veg Dum Biryani', score: 8.7, restaurantName: 'Honest Restaurant', photoUrl: '' },
  { id: 6, name: 'Chicken Biryani', score: 8.6, restaurantName: 'Shadab Hotel', photoUrl: '' },
  { id: 7, name: 'Special Biryani', score: 8.5, restaurantName: 'Sarvi Restaurant', photoUrl: '' },
  { id: 8, name: 'Chicken 65', score: 8.3, restaurantName: 'Paradise Restaurant', photoUrl: '' },
  { id: 9, name: 'Mutton Seekh Kebab', score: 8.8, restaurantName: 'Paradise Restaurant', photoUrl: '' },
  { id: 10, name: 'Butter Chicken', score: 8.1, restaurantName: 'Bawarchi', photoUrl: '' },
]

const SAMPLE_RESTAURANTS: RestaurantVisit[] = [
  { id: 1, name: 'Paradise Restaurant', area: 'Paradise Circle', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'Mughlai'], userRating: 9.2, visitDate: '2 weeks ago', photoUrl: '' },
  { id: 2, name: 'Shah Ghouse Cafe', area: 'Lakdikapul', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'Biryani'], userRating: 9.0, visitDate: '1 month ago', photoUrl: '' },
  { id: 3, name: 'Bawarchi', area: 'RTC X Roads', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'Biryani'], userRating: 8.8, visitDate: '1 month ago', photoUrl: '' },
  { id: 4, name: 'Cafe Bahar', area: 'Himayatnagar', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'South Indian'], userRating: 8.7, visitDate: '2 months ago', photoUrl: '' },
  { id: 5, name: 'Honest Restaurant', area: 'Masab Tank', city: 'Hyderabad', cuisineType: ['North Indian', 'Chinese'], userRating: 8.5, visitDate: '2 months ago', photoUrl: '' },
  { id: 6, name: 'Shadab Hotel', area: 'Himayatnagar', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'Mughlai'], userRating: 8.4, visitDate: '3 months ago', photoUrl: '' },
]

const SAMPLE_PHOTOS: PhotoItem[] = [
  { id: 1, dishName: 'Hyderabadi Dum Biryani', score: 9.4, url: '' },
  { id: 2, dishName: 'Mutton Dum Biryani', score: 9.2, url: '' },
  { id: 3, dishName: 'Chicken 65', score: 8.3, url: '' },
  { id: 4, dishName: 'Kacchi Gosht Biryani', score: 8.9, url: '' },
  { id: 5, dishName: 'Butter Chicken', score: 8.1, url: '' },
  { id: 6, dishName: 'Mutton Seekh Kebab', score: 8.8, url: '' },
  { id: 7, dishName: 'Veg Dum Biryani', score: 8.7, url: '' },
  { id: 8, dishName: 'Chicken Biryani', score: 8.6, url: '' },
  { id: 9, dishName: 'Special Biryani', score: 8.5, url: '' },
  { id: 10, dishName: 'Chicken Dum Biryani', score: 9.0, url: '' },
  { id: 11, dishName: 'Paneer Tikka', score: 8.0, url: '' },
  { id: 12, dishName: 'Double Ka Meetha', score: 8.2, url: '' },
]

const SAMPLE_SAVED: SavedRestaurant[] = [
  { id: 1, name: 'Pista House', area: 'Nampally', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'Biryani'], overallScore: 8.4 },
  { id: 2, name: 'Sarvi Restaurant', area: 'Banjara Hills', city: 'Hyderabad', cuisineType: ['Hyderabadi', 'North Indian'], overallScore: 8.5 },
  { id: 3, name: 'Ulavacharu', area: 'Jubilee Hills', city: 'Hyderabad', cuisineType: ['Andhra'], overallScore: 8.2 },
  { id: 4, name: 'ABs - Absolute Barbecues', area: 'Banjara Hills', city: 'Hyderabad', cuisineType: ['Multi-Cuisine', 'BBQ'], overallScore: 7.9 },
  { id: 5, name: 'The Fishermans Wharf', area: 'Gachibowli', city: 'Hyderabad', cuisineType: ['Goan', 'Coastal'], overallScore: 8.1 },
  { id: 6, name: 'Ohri''s', area: 'Jubilee Hills', city: 'Hyderabad', cuisineType: ['North Indian', 'Mughlai'], overallScore: 7.8 },
]

const SAMPLE_TASTE_PROFILE: TasteProfileData = {
  favouriteCuisines: [
    { name: 'Hyderabadi', percentage: 42 },
    { name: 'South Indian', percentage: 18 },
    { name: 'North Indian', percentage: 15 },
    { name: 'Mughlai', percentage: 12 },
    { name: 'Street Food', percentage: 8 },
    { name: 'Chinese', percentage: 5 },
  ],
  mostReviewedDishes: [
    'Chicken Biryani', 'Mutton Biryani', 'Chicken 65',
    'Mutton Seekh Kebab', 'Butter Chicken', 'Paneer Tikka',
    'Double Ka Meetha', 'Haleem',
  ],
  averageRating: 8.2,
  preferredPriceRange: '₹₹',
  vegRatio: 18,
  nonVegRatio: 82,
  citiesExplored: ['Hyderabad', 'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata'],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toLocaleString()
}

// ─── Photo Placeholder ───────────────────────────────────────────────────────

function PhotoPlaceholder({ className, dishName }: { className?: string; dishName?: string }) {
  const gradients = [
    'from-saffron/20 via-amber-500/15 to-saffron/10',
    'from-amber-500/20 via-saffron/15 to-orange-500/10',
    'from-saffron/15 via-orange-500/15 to-amber-500/20',
    'from-orange-500/20 via-saffron/10 to-amber-500/15',
  ]
  const gradient = gradients[Math.floor(Math.random() * gradients.length)]

  return (
    <div
      className={cn(
        'bg-gradient-to-br flex items-center justify-center',
        gradient,
        className
      )}
    >
      <UtensilsCrossed className="w-1/3 h-1/3 text-saffron/30" />
    </div>
  )
}

// ─── Stats Row ───────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: typeof SAMPLE_PROFILE.stats }) {
  const items = [
    { label: 'Reviews', value: formatNumber(stats.totalReviews) },
    { label: 'Restaurants', value: formatNumber(stats.restaurantsVisited) },
    { label: 'Helpful Votes', value: formatNumber(stats.helpfulVotes) },
    { label: 'Followers', value: formatNumber(stats.followers) },
    { label: 'Following', value: formatNumber(stats.following) },
  ]

  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2 bg-cream-dark border border-brown-muted/10 rounded-xl p-3 sm:p-4">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-sm sm:text-lg font-bold text-ink">{item.value}</p>
          <p className="text-[9px] sm:text-xs text-brown-muted mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Badge Card ──────────────────────────────────────────────────────────────

function BadgeCard({ badge, index }: { badge: TasteBadge; index: number }) {
  return (
    <div
      className={cn(
        'bg-cream border rounded-xl p-3.5 sm:p-4 transition-all hover:shadow-sm animate-fade-in-up',
        badge.earned
          ? 'border-brown-muted/10'
          : 'border-brown-muted/5 opacity-60'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0',
          badge.earned ? 'bg-saffron/10' : 'bg-cream-dark'
        )}>
          {badge.earned ? badge.icon : <LockIcon />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={cn(
              'text-sm font-semibold truncate',
              badge.earned ? 'text-ink' : 'text-brown-muted'
            )}>
              {badge.name}
            </p>
            {!badge.earned && (
              <span className="text-[9px] text-brown-muted/50 bg-cream-dark px-1.5 py-0.5 rounded font-medium shrink-0">Locked</span>
            )}
          </div>
          <p className="text-xs text-brown-muted mt-0.5">{badge.description}</p>

          {/* Progress */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-brown-muted/70">
                {badge.current} / {badge.target}
              </span>
              <span className="text-[10px] font-medium text-saffron">{badge.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-cream-darker rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-1000',
                  badge.earned ? 'bg-saffron' : 'bg-brown-muted/30'
                )}
                style={{
                  width: `${badge.progress}%`,
                  animation: 'grow-width 0.8s ease-out forwards',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A08060"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

// ─── Review Card ─────────────────────────────────────────────────────────────

function ProfileReviewCard({ review }: { review: ReviewData }) {
  return (
    <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden hover:shadow-sm transition-all group">
      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0">
          <PhotoPlaceholder className="w-full h-full" dishName={review.dishName} />
        </div>

        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-ink">{review.dishName}</h3>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-saffron text-cream text-xs font-bold">
                  {review.score}
                </span>
              </div>
              <p className="text-xs text-brown-muted mt-0.5">
                {review.restaurantName} &middot; {review.restaurantCity}
              </p>
            </div>
          </div>

          <p className="text-sm text-ink/70 italic font-serif mt-2 line-clamp-2 leading-relaxed">
            &ldquo;{review.reviewText}&rdquo;
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {review.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-cream-dark text-brown-muted px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-brown-muted/5">
            <div className="flex items-center gap-2 text-xs text-brown-muted">
              <Clock className="w-3 h-3" />
              <span>{review.date}</span>
              <span className="text-brown-muted/40">&middot;</span>
              <ThumbsUp className="w-3 h-3" />
              <span>{review.helpfulVotes}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-md text-brown-muted hover:text-saffron hover:bg-saffron/5 transition-all">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-md text-brown-muted hover:text-red-500 hover:bg-red-50 transition-all">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dish Card (Grid) ────────────────────────────────────────────────────────

function DishGridCard({ dish }: { dish: DishReview }) {
  return (
    <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden hover:shadow-sm hover:border-saffron/20 transition-all group cursor-pointer">
      <div className="aspect-[4/3]">
        <PhotoPlaceholder className="w-full h-full" dishName={dish.name} />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink truncate">{dish.name}</h3>
          <span className="shrink-0 text-xs font-bold text-saffron bg-saffron/5 px-1.5 py-0.5 rounded">
            {dish.score}
          </span>
        </div>
        <p className="text-xs text-brown-muted mt-0.5 truncate">{dish.restaurantName}</p>
      </div>
    </div>
  )
}

// ─── Restaurant Card (Grid) ──────────────────────────────────────────────────

function RestaurantGridCard({ restaurant }: { restaurant: RestaurantVisit }) {
  return (
    <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden hover:shadow-sm hover:border-saffron/20 transition-all group cursor-pointer">
      <div className="aspect-[16/9]">
        <PhotoPlaceholder className="w-full h-full" dishName={restaurant.name} />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-ink truncate">{restaurant.name}</h3>
        <p className="text-xs text-brown-muted mt-0.5 truncate">{restaurant.area}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
            <span className="text-xs font-bold text-saffron">{restaurant.userRating}</span>
          </div>
          <span className="text-[10px] text-brown-muted">{restaurant.visitDate}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Photo Grid Item ─────────────────────────────────────────────────────────

function PhotoGridItem({ photo }: { photo: PhotoItem }) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square bg-cream border border-brown-muted/10">
      <PhotoPlaceholder className="w-full h-full" dishName={photo.dishName} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs font-medium text-cream truncate">{photo.dishName}</p>
          <span className="text-xs font-bold text-saffron">{photo.score}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Saved Restaurant Card ───────────────────────────────────────────────────

function SavedRestaurantCard({ restaurant }: { restaurant: SavedRestaurant }) {
  return (
    <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden hover:shadow-sm hover:border-saffron/20 transition-all group relative">
      <div className="aspect-[16/9]">
        <PhotoPlaceholder className="w-full h-full" dishName={restaurant.name} />
      </div>
      <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-ink/50 text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
        <Heart className="w-3.5 h-3.5 fill-current" />
      </button>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-ink truncate">{restaurant.name}</h3>
        <p className="text-xs text-brown-muted truncate">{restaurant.area}, {restaurant.city}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] bg-cream-dark text-brown-muted px-1.5 py-0.5 rounded">
            {restaurant.cuisineType[0]}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
            <span className="text-xs font-bold text-saffron">{restaurant.overallScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ vegRatio, nonVegRatio }: { vegRatio: number; nonVegRatio: number }) {
  const circumference = 2 * Math.PI * 40
  const vegOffset = circumference * (1 - vegRatio / 100)
  const nonVegOffset = circumference * (1 - (vegRatio + nonVegRatio) / 100)

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#F0E6CE"
            strokeWidth="12"
          />
          {/* Veg segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#16a34a"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={vegOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              animation: 'grow-width 1s ease-out forwards',
            }}
          />
          {/* Non-veg segment */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#dc2626"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={nonVegOffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              animation: 'grow-width 1s ease-out 0.3s forwards',
              opacity: 0.85,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-ink">{vegRatio + nonVegRatio}%</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0" />
          <span className="text-xs text-brown-muted">Veg: {vegRatio}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" />
          <span className="text-xs text-brown-muted">Non-Veg: {nonVegRatio}%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Tab Button ──────────────────────────────────────────────────────────────

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'text-saffron'
          : 'text-brown-muted hover:text-ink'
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
            active ? 'bg-saffron/10 text-saffron' : 'bg-cream-dark text-brown-muted'
          )}
        >
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-saffron rounded-full" />
      )}
    </button>
  )
}

// ─── Profile Page Content ────────────────────────────────────────────────────

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id as string

  // Simulate: if the id matches "me" or a specific id, it's own profile
  const isOwnProfile = profileId === 'me' || profileId === 'current-user-id'

  // Profile data state
  const profile = SAMPLE_PROFILE
  const badges = SAMPLE_BADGES
  const reviews = SAMPLE_REVIEWS
  const dishes = SAMPLE_DISHES
  const restaurants = SAMPLE_RESTAURANTS
  const photos = SAMPLE_PHOTOS
  const savedRestaurants = SAMPLE_SAVED
  const tasteProfile = SAMPLE_TASTE_PROFILE

  // Tab state
  type ReviewTab = 'all' | 'dishes' | 'restaurants' | 'photos'
  const [activeTab, setActiveTab] = useState<ReviewTab>('all')
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-sm text-brown-muted hover:text-saffron mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        {/* ─── 1. PROFILE HEADER ──────────────────────────────────────────── */}
        <div className="bg-cream border border-brown-muted/10 rounded-2xl p-5 sm:p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0 shadow-sm">
              {getInitials(profile.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
                    {profile.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-brown-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {profile.joinDate}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isOwnProfile ? (
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron text-cream rounded-xl text-sm font-medium hover:bg-saffron-light transition-all active:scale-[0.97] shadow-sm">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.97]',
                        isFollowing
                          ? 'bg-cream-dark border border-brown-muted/15 text-ink'
                          : 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
                      )}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-ink/70 mt-3 leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5">
            <StatsRow stats={profile.stats} />
          </div>
        </div>

        {/* ─── 2. TASTE BADGES ────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-ink">Taste Badges</h2>
              <p className="text-xs text-brown-muted mt-0.5">Earned from review history</p>
            </div>
            <Award className="w-5 h-5 text-saffron" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {badges.map((badge, i) => (
              <BadgeCard key={badge.name} badge={badge} index={i} />
            ))}
          </div>
        </div>

        {/* ─── 3. REVIEW HISTORY TABS ─────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-ink mb-4">Review History</h2>

          {/* Tab Bar */}
          <div className="flex items-center border-b border-brown-muted/10 overflow-x-auto scrollbar-none">
            <TabButton
              label="All Reviews"
              count={reviews.length}
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <TabButton
              label="Dishes"
              count={dishes.length}
              active={activeTab === 'dishes'}
              onClick={() => setActiveTab('dishes')}
            />
            <TabButton
              label="Restaurants"
              count={restaurants.length}
              active={activeTab === 'restaurants'}
              onClick={() => setActiveTab('restaurants')}
            />
            <TabButton
              label="Photos"
              count={photos.length}
              active={activeTab === 'photos'}
              onClick={() => setActiveTab('photos')}
            />
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {/* All Reviews */}
            {activeTab === 'all' && (
              <div className="space-y-3 animate-fade-in-up">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-brown-muted/20 rounded-xl">
                    <p className="text-brown-muted">No reviews yet</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ProfileReviewCard key={review.id} review={review} />
                  ))
                )}
              </div>
            )}

            {/* Dishes */}
            {activeTab === 'dishes' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in-up">
                {dishes.map((dish) => (
                  <DishGridCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}

            {/* Restaurants */}
            {activeTab === 'restaurants' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in-up">
                {restaurants.map((restaurant) => (
                  <RestaurantGridCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {/* Photos */}
            {activeTab === 'photos' && (
              <div className="columns-2 sm:columns-3 gap-2.5 space-y-2.5 animate-fade-in-up">
                {photos.map((photo) => (
                  <PhotoGridItem key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── 4. SAVED RESTAURANTS (own profile only) ──────────────────── */}
        {isOwnProfile && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-ink">Saved Places</h2>
                <p className="text-xs text-brown-muted mt-0.5">Restaurants you want to try</p>
              </div>
              <Bookmark className="w-5 h-5 text-saffron" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {savedRestaurants.map((restaurant) => (
                <SavedRestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          </div>
        )}

        {/* ─── 5. TASTE PROFILE (own profile only) ─────────────────────────── */}
        {isOwnProfile && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-ink">Your Taste Profile</h2>
                <p className="text-xs text-brown-muted mt-0.5">Your dining personality, visualized</p>
              </div>
              <TrendingUp className="w-5 h-5 text-saffron" />
            </div>

            <div className="bg-cream border border-brown-muted/10 rounded-2xl p-4 sm:p-5 space-y-5">
              {/* Favourite Cuisines - Horizontal Bar Chart */}
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Favourite Cuisines</h3>
                <div className="space-y-2">
                  {tasteProfile.favouriteCuisines.map((cuisine) => (
                    <div key={cuisine.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-ink">{cuisine.name}</span>
                        <span className="text-xs font-medium text-saffron">{cuisine.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-cream-darker rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-saffron to-saffron-light animate-grow-width"
                          style={{ width: `${cuisine.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Reviewed Dishes */}
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Most Reviewed Dishes</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tasteProfile.mostReviewedDishes.map((dish) => (
                    <span
                      key={dish}
                      className="px-2.5 py-1 bg-cream-dark border border-brown-muted/10 rounded-full text-xs text-ink"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Average Rating */}
                <div className="bg-cream-dark rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-brown-muted uppercase tracking-wider mb-1">Avg Rating</p>
                  <p className="text-xl font-bold text-saffron">{tasteProfile.averageRating.toFixed(1)}<span className="text-xs text-brown-muted">/10</span></p>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-2.5 h-2.5 fill-saffron/40 text-saffron" />
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-cream-dark rounded-xl p-3.5 text-center">
                  <p className="text-[10px] text-brown-muted uppercase tracking-wider mb-1">Price Range</p>
                  <p className="text-xl font-bold text-ink">{tasteProfile.preferredPriceRange}</p>
                  <p className="text-[10px] text-brown-muted mt-1">Mid-range</p>
                </div>

                {/* Veg/Non-Veg Ratio */}
                <div className="bg-cream-dark rounded-xl p-3.5 sm:col-span-2">
                  <p className="text-[10px] text-brown-muted uppercase tracking-wider mb-2">Veg / Non-Veg Split</p>
                  <DonutChart vegRatio={tasteProfile.vegRatio} nonVegRatio={tasteProfile.nonVegRatio} />
                </div>
              </div>

              {/* Cities Explored */}
              <div>
                <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Cities Explored
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tasteProfile.citiesExplored.map((city) => (
                    <span
                      key={city}
                      className="px-2.5 py-1 bg-saffron/5 border border-saffron/15 rounded-full text-xs text-saffron font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-12" />
      </div>
    </div>
  )
}
