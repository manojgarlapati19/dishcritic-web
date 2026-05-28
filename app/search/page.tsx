'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, X, MapPin, ChevronDown, Grid3X3, List, Star, IndianRupee,
  TrendingUp, UtensilsCrossed, RotateCcw, ArrowUpRight, SlidersHorizontal, Leaf, Beef
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = 'score' | 'review_count' | 'price_asc' | 'price_desc'
type ViewMode = 'grid' | 'list'
type DietaryFilter = 'veg' | 'nonveg' | 'halal' | 'jain'

interface DishResult {
  id: string
  dishName: string
  restaurantName: string
  area: string
  city: string
  score: number
  reviewCount: number
  price: number
  tags: string[]
  isVeg: boolean
  snippet: string
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_RESULTS: DishResult[] = [
  { id: '1', dishName: 'Hyderabadi Dum Biryani', restaurantName: 'Paradise Restaurant', area: 'Banjara Hills', city: 'Hyderabad', score: 9.4, reviewCount: 4200, price: 450, tags: ['Non-Veg', 'Spicy'], isVeg: false, snippet: 'The gold standard of Hyderabadi biryani. Perfectly layered fragrant rice with tender marinated meat, cooked to perfection in a sealed handi.' },
  { id: '2', dishName: 'Mutton Biryani', restaurantName: 'Shah Ghouse', area: 'Tolichowki', city: 'Hyderabad', score: 9.2, reviewCount: 3100, price: 420, tags: ['Non-Veg', 'Popular'], isVeg: false, snippet: 'Rich, aromatic mutton biryani with perfectly spiced meat that falls off the bone. A Hyderabad institution.' },
  { id: '3', dishName: 'Chicken Biryani', restaurantName: 'Bawarchi', area: 'RTC X Roads', city: 'Hyderabad', score: 9.0, reviewCount: 2800, price: 380, tags: ['Non-Veg'], isVeg: false, snippet: 'The iconic chicken biryani that put Bawarchi on the map. Consistently delicious, always satisfying.' },
  { id: '4', dishName: 'Kacchi Biryani', restaurantName: 'Cafe Bahar', area: 'Himayath Nagar', city: 'Hyderabad', score: 8.9, reviewCount: 1950, price: 480, tags: ['Non-Veg', 'Premium'], isVeg: false, snippet: 'Authentic kacchi (raw) biryani prepared with aged basmati and premium mutton. A true delicacy.' },
  { id: '5', dishName: 'Veg Biryani', restaurantName: 'Honest Restaurant', area: 'Hitech City', city: 'Hyderabad', score: 8.7, reviewCount: 1700, price: 320, tags: ['Veg'], isVeg: true, snippet: 'The best veg biryani in town. Fragrant rice loaded with fresh vegetables and aromatic spices.' },
  { id: '6', dishName: 'Chicken Dum Biryani', restaurantName: 'Paradise Restaurant', area: 'Secunderabad', city: 'Hyderabad', score: 8.5, reviewCount: 1500, price: 410, tags: ['Non-Veg'], isVeg: false, snippet: 'Classic chicken dum biryani with the signature Paradise touch. A must-try for biryani lovers.' },
  { id: '7', dishName: 'Egg Biryani', restaurantName: 'Meridian Restaurant', area: 'Ameerpet', city: 'Hyderabad', score: 8.2, reviewCount: 950, price: 290, tags: ['Non-Veg', 'Budget'], isVeg: false, snippet: 'Creative egg biryani with perfectly spiced boiled eggs layered with aromatic biryani rice.' },
  { id: '8', dishName: 'Mushroom Biryani', restaurantName: 'Kritunga', area: 'Miyapur', city: 'Hyderabad', score: 7.9, reviewCount: 720, price: 310, tags: ['Veg'], isVeg: true, snippet: 'Flavorful mushroom biryani that even non-vegetarians enjoy. Generous portions.' },
]

const CUISINE_TYPES = ['Hyderabadi', 'South Indian', 'North Indian', 'Street Food']
const CITIES = ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Kolkata']
const DIETARY_OPTIONS: { key: DietaryFilter; label: string; icon: typeof Leaf }[] = [
  { key: 'veg', label: 'Veg Only', icon: Leaf },
  { key: 'nonveg', label: 'Non-Veg', icon: Beef },
  { key: 'halal', label: 'Halal', icon: Leaf },
  { key: 'jain', label: 'Jain', icon: Leaf },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'score', label: 'Best Rated' },
  { value: 'review_count', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Price Low-High' },
  { value: 'price_desc', label: 'Price High-Low' },
]

const MIN_SCORE_OPTIONS = [7, 8, 9]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const photoGradients = [
  'from-amber-900/70 via-orange-600/50 to-yellow-500/30',
  'from-orange-800/70 via-amber-600/50 to-yellow-400/30',
  'from-red-800/60 via-orange-700/50 to-amber-500/40',
  'from-yellow-900/60 via-amber-700/50 to-orange-500/30',
]

function PhotoPlaceholder({ seed, className, children }: { seed: number; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn(`bg-gradient-to-br ${photoGradients[seed % photoGradients.length]} flex items-center justify-center relative overflow-hidden`, className)}>
      <UtensilsCrossed className="w-8 h-8 text-white/40" />
      {children}
    </div>
  )
}

function ScoreBadgeSmall({ score }: { score: number }) {
  const color =
    score >= 9 ? 'bg-emerald-500 text-white' :
    score >= 8.5 ? 'bg-saffron text-cream' :
    score >= 8 ? 'bg-saffron/80 text-cream' :
    'bg-brown-muted/20 text-brown-muted'

  return (
    <div className={cn('font-bold rounded-lg flex items-center justify-center leading-none text-sm px-2 py-1', color)}>
      {score.toFixed(1)}
    </div>
  )
}

function ScoreBadgeLarge({ score }: { score: number }) {
  const color =
    score >= 9 ? 'bg-emerald-500 text-white' :
    score >= 8.5 ? 'bg-saffron text-cream' :
    score >= 8 ? 'bg-saffron/80 text-cream' :
    'bg-brown-muted/20 text-brown-muted'

  return (
    <div className={cn('font-bold rounded-xl flex items-center justify-center leading-none text-2xl px-4 py-2.5', color)}>
      {score.toFixed(1)}
      <span className="opacity-60 text-xs ml-1">/10</span>
    </div>
  )
}

// ─── Filter Sidebar ──────────────────────────────────────────────────────────

function FilterSidebar({
  selectedCity, setSelectedCity,
  selectedCuisines, setSelectedCuisines,
  dietaryFilters, setDietaryFilters,
  minScore, setMinScore,
  onApply,
}: {
  selectedCity: string; setSelectedCity: (v: string) => void
  selectedCuisines: string[]; setSelectedCuisines: (v: string[]) => void
  dietaryFilters: DietaryFilter[]; setDietaryFilters: (v: DietaryFilter[]) => void
  minScore: number | null; setMinScore: (v: number | null) => void
  onApply?: () => void
}) {
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(
      selectedCuisines.includes(cuisine)
        ? selectedCuisines.filter((c) => c !== cuisine)
        : [...selectedCuisines, cuisine]
    )
  }

  const toggleDietary = (key: DietaryFilter) => {
    setDietaryFilters(
      dietaryFilters.includes(key)
        ? dietaryFilters.filter((d) => d !== key)
        : [...dietaryFilters, key]
    )
  }

  const hasChanges = selectedCuisines.length > 0 || dietaryFilters.length > 0 || minScore !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink text-lg font-serif">Filters</h3>
        {hasChanges && (
          <button
            onClick={() => { setSelectedCuisines([]); setDietaryFilters([]); setMinScore(null) }}
            className="text-xs text-brown-muted hover:text-ink flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">City</h4>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted pointer-events-none" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-cream border border-brown-muted/20 rounded-lg text-sm text-ink appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted pointer-events-none" />
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">Cuisine</h4>
        <div className="space-y-1.5">
          {CUISINE_TYPES.map((cuisine) => (
            <label
              key={cuisine}
              className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-cream-dark transition-colors group"
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedCuisines.includes(cuisine)
                    ? 'bg-saffron border-saffron'
                    : 'border-brown-muted/30 group-hover:border-saffron/50'
                }`}
              >
                {selectedCuisines.includes(cuisine) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-ink">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary Toggles */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">Dietary</h4>
        <div className="grid grid-cols-2 gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => toggleDietary(option.key)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                dietaryFilters.includes(option.key)
                  ? 'bg-saffron text-cream border-saffron'
                  : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/50 hover:text-ink'
              }`}
            >
              <option.icon className="w-3 h-3" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min Score */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">Min Score</h4>
        <div className="flex gap-2">
          {MIN_SCORE_OPTIONS.map((score) => (
            <button
              key={score}
              onClick={() => setMinScore(minScore === score ? null : score)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                minScore === score
                  ? 'bg-saffron text-cream border-saffron shadow-sm'
                  : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/50 hover:text-ink'
              }`}
            >
              {score}+
            </button>
          ))}
        </div>
      </div>

      {/* Apply */}
      <button
        onClick={onApply}
        className="w-full py-3 bg-saffron text-cream rounded-lg font-semibold hover:bg-saffron-light transition-all active:scale-[0.98] shadow-sm"
      >
        Apply Filters
      </button>
    </div>
  )
}

// ─── Result Cards ────────────────────────────────────────────────────────────

function TopResultCard({ dish }: { dish: DishResult }) {
  return (
    <div className="relative bg-cream border-2 border-saffron/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-saffron/5">
      {/* Best Match Banner */}
      <div className="bg-saffron text-cream text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
        <Star className="w-3 h-3 fill-current" /> Best Match
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Photo */}
        <PhotoPlaceholder seed={parseInt(dish.id)} className="w-full sm:w-44 h-36 shrink-0" />

        <div className="p-5 sm:p-6 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-xl font-bold text-ink">{dish.dishName}</h2>
              <p className="text-sm text-brown-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {dish.restaurantName}, {dish.area}
              </p>
            </div>
            <ScoreBadgeLarge score={dish.score} />
          </div>

          {/* Review Snippet */}
          <p className="text-sm text-ink/70 mt-3 leading-relaxed italic border-l-2 border-saffron/30 pl-3">
            &ldquo;{dish.snippet}&rdquo;
          </p>

          {/* Bottom Row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-brown-muted/10">
            <div className="flex items-center gap-3">
              <span className="text-sm text-brown-muted flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" /> {dish.price}
              </span>
              <span className="text-sm text-brown-muted flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-saffron/30 text-saffron" />
                {dish.reviewCount >= 1000 ? (dish.reviewCount / 1000).toFixed(1) + 'K' : dish.reviewCount}
              </span>
              <Badge variant={dish.isVeg ? 'veg' : 'nonveg'} className="text-[10px] px-1.5 py-0">
                {dish.isVeg ? 'Veg' : 'Non-Veg'}
              </Badge>
            </div>
            <Button size="sm" className="bg-saffron hover:bg-saffron-light text-cream gap-1">
              View Dish <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegularResultCard({ dish, viewMode }: { dish: DishResult; viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-saffron/5 hover:border-saffron/30 hover:-translate-y-0.5 group flex">
        <PhotoPlaceholder seed={parseInt(dish.id)} className="w-24 h-24 shrink-0" />
        <div className="p-3.5 flex-1 min-w-0 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-ink truncate group-hover:text-saffron transition-colors">{dish.dishName}</h3>
            <p className="text-xs text-brown-muted truncate">{dish.restaurantName}, {dish.area}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-brown-muted flex items-center gap-0.5">
                <IndianRupee className="w-3 h-3" />{dish.price}
              </span>
              <Badge variant={dish.isVeg ? 'veg' : 'nonveg'} className="text-[9px] px-1 py-0">
                {dish.isVeg ? 'Veg' : 'NV'}
              </Badge>
            </div>
          </div>
          <div className="text-right shrink-0 flex items-center gap-3">
            <div>
              <div className="text-saffron font-bold font-sans text-sm">{dish.score.toFixed(1)}</div>
              <div className="text-[10px] text-brown-muted">{dish.reviewCount >= 1000 ? (dish.reviewCount / 1000).toFixed(1) + 'K' : dish.reviewCount}</div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-brown-muted/0 group-hover:text-saffron transition-all" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-saffron/5 hover:border-saffron/30 hover:-translate-y-1 group">
      {/* Photo */}
      <PhotoPlaceholder seed={parseInt(dish.id)} className="h-36 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-2 right-2">
          <ScoreBadgeSmall score={dish.score} />
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1">
          {dish.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm ${
              tag === 'Veg' ? 'bg-green-600/80 text-white' :
              tag === 'Non-Veg' ? 'bg-red-600/80 text-white' :
              'bg-cream/80 text-ink'
            }`}>
              {tag}
            </span>
          ))}
        </div>
      </PhotoPlaceholder>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="font-serif font-bold text-ink group-hover:text-saffron transition-colors truncate">{dish.dishName}</h3>
          <p className="text-xs text-brown-muted truncate">{dish.restaurantName}</p>
          <p className="text-[10px] text-brown-muted/70">{dish.area}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-brown-muted/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-brown-muted" />{dish.price}
            </span>
            <Badge variant={dish.isVeg ? 'veg' : 'nonveg'} className="text-[9px] px-1 py-0">
              {dish.isVeg ? 'Veg' : 'NV'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-brown-muted">
            <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
            {dish.reviewCount >= 1000 ? (dish.reviewCount / 1000).toFixed(1) + 'K' : dish.reviewCount}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Search Content ─────────────────────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || 'Biryani'

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>([])
  const [minScore, setMinScore] = useState<number | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchText, setSearchText] = useState(query)

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Best Rated'
  const resultCount = SAMPLE_RESULTS.length

  return (
    <div className="min-h-screen bg-cream">
      {/* ═══════ 1. STICKY SEARCH HEADER ═══════ */}
      <div className="sticky top-16 z-40 bg-cream/95 backdrop-blur-md border-b border-brown-muted/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Top Row: Search Input + City Selector */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search any dish..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm text-ink placeholder:text-brown-muted/50 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm text-ink hover:bg-cream-darker transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* City Selector (desktop) */}
            <div className="hidden sm:block">
              <div className="relative">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm">
                  <MapPin className="w-4 h-4 text-saffron shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent border-none text-sm text-ink appearance-none cursor-pointer pr-5 focus:outline-none"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-brown-muted pointer-events-none absolute right-2" />
                </div>
              </div>
            </div>

            <Button size="sm" className="hidden sm:inline-flex bg-saffron hover:bg-saffron-light text-cream gap-1">
              Search <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Bottom Row: Result count + Sort */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-ink">
                {query}
                <span className="text-sm font-sans text-brown-muted font-normal ml-2">in {selectedCity}</span>
              </h1>
              <span className="text-xs text-brown-muted bg-cream-dark px-2 py-0.5 rounded-full">
                {resultCount} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-dark border border-brown-muted/10 rounded-lg text-xs font-medium text-ink hover:bg-cream-darker transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-brown-muted" />
                  {sortLabel}
                  <ChevronDown className={`w-3 h-3 text-brown-muted transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-cream border border-brown-muted/10 rounded-xl shadow-lg overflow-hidden">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value); setShowSortDropdown(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            sortBy === option.value
                              ? 'bg-saffron/10 text-saffron font-medium'
                              : 'text-ink hover:bg-cream-dark'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-cream-dark border border-brown-muted/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-1.5 transition-all', viewMode === 'grid' ? 'bg-saffron text-cream' : 'text-brown-muted hover:text-ink')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-1.5 transition-all', viewMode === 'list' ? 'bg-saffron text-cream' : 'text-brown-muted hover:text-ink')}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ 2. MAIN CONTENT ═══════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Filter Sidebar (Desktop, Left 25%) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-48 bg-cream border border-brown-muted/10 rounded-xl p-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
              <FilterSidebar
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCuisines={selectedCuisines}
                setSelectedCuisines={setSelectedCuisines}
                dietaryFilters={dietaryFilters}
                setDietaryFilters={setDietaryFilters}
                minScore={minScore}
                setMinScore={setMinScore}
              />
            </div>
          </aside>

          {/* Results Area (Right 75%) */}
          <div className="flex-1 min-w-0">
            <div className="space-y-5">
              {/* Top Result - Special #1 Treatment */}
              <TopResultCard dish={SAMPLE_RESULTS[0]} />

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-brown-muted/10" />
                <span className="text-xs font-medium text-brown-muted uppercase tracking-wider">More results</span>
                <div className="flex-1 h-px bg-brown-muted/10" />
              </div>

              {/* Regular Results (2-col grid) */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
                {SAMPLE_RESULTS.slice(1).map((dish) => (
                  <RegularResultCard key={dish.id} dish={dish} viewMode={viewMode} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center pt-2 pb-8">
                <button className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-saffron/30 text-saffron font-semibold rounded-xl hover:bg-saffron/5 hover:border-saffron/50 transition-all text-sm active:scale-[0.97]">
                  Load More Results
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ 3. MOBILE FILTER SHEET ═══════ */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="bg-cream rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-brown-muted/20" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brown-muted/10">
                <h3 className="font-semibold text-ink font-serif text-lg">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors">
                  <X className="w-5 h-5 text-brown-muted" />
                </button>
              </div>
              {/* Filter content */}
              <div className="px-5 py-4">
                <FilterSidebar
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedCuisines={selectedCuisines}
                  setSelectedCuisines={setSelectedCuisines}
                  dietaryFilters={dietaryFilters}
                  setDietaryFilters={setDietaryFilters}
                  minScore={minScore}
                  setMinScore={setMinScore}
                  onApply={() => setMobileFiltersOpen(false)}
                />
              </div>
              {/* Bottom CTA */}
              <div className="sticky bottom-0 bg-cream border-t border-brown-muted/10 px-5 py-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-saffron text-cream rounded-xl font-semibold hover:bg-saffron-light transition-all active:scale-[0.98] shadow-sm"
                >
                  Show {resultCount} Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Export with Suspense ────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-10 bg-cream-dark rounded-xl" />
          <div className="h-6 bg-cream-dark rounded-lg w-64" />
          <div className="h-48 bg-cream-dark rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 bg-cream-dark rounded-xl" />
            <div className="h-40 bg-cream-dark rounded-xl" />
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
