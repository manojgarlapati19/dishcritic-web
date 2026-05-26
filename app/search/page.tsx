'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  X,
  MapPin,
  ChevronDown,
  Grid3X3,
  List,
  Star,
  Clock,
  IndianRupee,
  TrendingUp,
  MapPinned,
  UtensilsCrossed,
  ArrowUpRight,
  Filter,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import type { Dish, Restaurant, City } from '@/types'
import { searchDishes, getCities } from '@/lib/queries'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DishResult {
  id: string
  dishName: string
  restaurantName: string
  restaurantId: string
  area: string
  city: string
  score: number
  reviewCount: number
  price: number
  isVeg: boolean
  isHalal: boolean
  dietaryTags: string[]
  category: string
}

type SortOption = 'score' | 'review_count' | 'price_asc' | 'price_desc' | 'nearest'
type ViewMode = 'grid' | 'list'

const SUGGESTED_SEARCHES = [
  'Mutton Biryani',
  'Chicken Biryani',
  'Veg Biryani',
  'Biryani near me',
  'Best Biryani Hyderabad',
]

const CUISINE_TYPES = [
  'Hyderabadi',
  'North Indian',
  'South Indian',
  'Street Food',
  'Chinese',
  'Continental',
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'score', label: 'Best Rated' },
  { value: 'review_count', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
  { value: 'nearest', label: 'Nearest' },
]

// ─── Gradient Placeholder ────────────────────────────────────────────────────

const photoGradients = [
  'from-amber-900/70 via-orange-600/50 to-yellow-500/30',
  'from-orange-800/70 via-amber-600/50 to-yellow-400/30',
  'from-red-800/60 via-orange-700/50 to-amber-500/40',
  'from-yellow-900/60 via-amber-700/50 to-orange-500/30',
]

function PhotoPlaceholder({ className, seed }: { className?: string; seed: number }) {
  const gradient = photoGradients[seed % photoGradients.length]
  return (
    <div
      className={cn(
        'bg-gradient-to-br rounded-lg flex items-center justify-center overflow-hidden',
        gradient,
        className
      )}
    >
      <UtensilsCrossed className="w-8 h-8 text-white/40" />
    </div>
  )
}

// ─── Score Badge ─────────────────────────────────────────────────────────────

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color =
    score >= 9
      ? 'bg-emerald-500 text-white'
      : score >= 8.5
        ? 'bg-saffron text-cream'
        : score >= 8
          ? 'bg-saffron/80 text-cream'
          : 'bg-brown-muted/20 text-brown-muted'

  return (
    <div
      className={cn(
        'font-bold rounded-lg flex items-center justify-center leading-none',
        size === 'lg' && 'text-2xl px-3 py-2',
        size === 'md' && 'text-lg px-2.5 py-1.5',
        size === 'sm' && 'text-sm px-2 py-1',
        color
      )}
    >
      {score}
      <span className={cn('opacity-60', size === 'lg' ? 'text-base ml-0.5' : size === 'md' ? 'text-xs ml-0.5' : 'text-[10px] ml-0.5')}>/10</span>
    </div>
  )
}

// ─── Dietary Tag ─────────────────────────────────────────────────────────────

function DietaryTag({ label, isActive }: { label: string; isActive?: boolean }) {
  const colors: Record<string, string> = {
    Veg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Non-Veg': 'bg-red-50 text-red-700 border-red-200',
    Halal: 'bg-teal-50 text-teal-700 border-teal-200',
    Jain: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border',
        isActive ? 'ring-2 ring-saffron/30 ring-offset-1 ring-offset-cream' : '',
        colors[label] || 'bg-cream-dark text-brown-muted border-brown-muted/20'
      )}
    >
      {label === 'Veg' && <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />}
      {label === 'Non-Veg' && <span className="w-2 h-2 rounded-full bg-red-500 mr-1" />}
      {label}
    </span>
  )
}

// ─── Active Filters Bar ──────────────────────────────────────────────────────

interface ActiveFiltersBarProps {
  selectedCuisines: string[]
  dietaryFilters: string[]
  priceRange: [number, number]
  minScore: number | null
  openNow: boolean
  verifiedOnly: boolean
  setSelectedCuisines: (v: string[]) => void
  setDietaryFilters: (v: string[]) => void
  setPriceRange: (v: [number, number]) => void
  setMinScore: (v: number | null) => void
  setOpenNow: (v: boolean) => void
  setVerifiedOnly: (v: boolean) => void
}

function ActiveFiltersBar({
  selectedCuisines,
  dietaryFilters,
  priceRange,
  minScore,
  openNow,
  verifiedOnly,
  setSelectedCuisines,
  setDietaryFilters,
  setPriceRange,
  setMinScore,
  setOpenNow,
  setVerifiedOnly,
}: ActiveFiltersBarProps) {
  const filters: { label: string; onRemove: () => void }[] = []

  selectedCuisines.forEach((c) =>
    filters.push({
      label: c,
      onRemove: () => setSelectedCuisines(selectedCuisines.filter((x) => x !== c)),
    })
  )

  dietaryFilters.forEach((d) =>
    filters.push({
      label: d,
      onRemove: () => setDietaryFilters(dietaryFilters.filter((x) => x !== d)),
    })
  )

  if (priceRange[0] > 0 || priceRange[1] < 2000) {
    filters.push({
      label: `₹${priceRange[0]}–₹${priceRange[1]}`,
      onRemove: () => setPriceRange([0, 2000]),
    })
  }

  if (minScore) {
    filters.push({
      label: `${minScore}+ Score`,
      onRemove: () => setMinScore(null),
    })
  }

  if (openNow) {
    filters.push({
      label: 'Open Now',
      onRemove: () => setOpenNow(false),
    })
  }

  if (verifiedOnly) {
    filters.push({
      label: 'Verified Only',
      onRemove: () => setVerifiedOnly(false),
    })
  }

  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 sm:px-0">
      <span className="text-xs font-medium text-brown-muted whitespace-nowrap">
        {filters.length} filter{filters.length !== 1 ? 's' : ''} active
      </span>
      {filters.map((f, i) => (
        <button
          key={i}
          onClick={f.onRemove}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium border border-saffron/20 hover:bg-saffron/20 transition-colors group"
        >
          {f.label}
          <X className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
      <button
        onClick={() => {
          setSelectedCuisines([])
          setDietaryFilters([])
          setPriceRange([0, 2000])
          setMinScore(null)
          setOpenNow(false)
          setVerifiedOnly(false)
        }}
        className="text-xs text-brown-muted hover:text-ink underline-offset-2 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}

// ─── Filter Sidebar ─────────────────────────────────────────────────────────

interface FilterSidebarProps {
  selectedCity: string
  setSelectedCity: (v: string) => void
  selectedCuisines: string[]
  setSelectedCuisines: (v: string[]) => void
  dietaryFilters: string[]
  setDietaryFilters: (v: string[]) => void
  priceRange: [number, number]
  setPriceRange: (v: [number, number]) => void
  minScore: number | null
  setMinScore: (v: number | null) => void
  openNow: boolean
  setOpenNow: (v: boolean) => void
  verifiedOnly: boolean
  setVerifiedOnly: (v: boolean) => void
  cities: City[]
}

function FilterSidebar({
  selectedCity,
  setSelectedCity,
  selectedCuisines,
  setSelectedCuisines,
  dietaryFilters,
  setDietaryFilters,
  priceRange,
  setPriceRange,
  minScore,
  setMinScore,
  openNow,
  setOpenNow,
  verifiedOnly,
  setVerifiedOnly,
  cities,
}: FilterSidebarProps) {
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(
      selectedCuisines.includes(cuisine)
        ? selectedCuisines.filter((c) => c !== cuisine)
        : [...selectedCuisines, cuisine]
    )
  }

  const toggleDietary = (diet: string) => {
    setDietaryFilters(
      dietaryFilters.includes(diet)
        ? dietaryFilters.filter((d) => d !== diet)
        : [...dietaryFilters, diet]
    )
  }

  const hasChanges =
    selectedCuisines.length > 0 ||
    dietaryFilters.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 2000 ||
    minScore !== null ||
    openNow ||
    verifiedOnly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink text-lg font-serif">Filter Results</h3>
        {hasChanges && (
          <button
            onClick={() => {
              setSelectedCuisines([])
              setDietaryFilters([])
              setPriceRange([0, 2000])
              setMinScore(null)
              setOpenNow(false)
              setVerifiedOnly(false)
            }}
            className="text-xs text-brown-muted hover:text-ink flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">
          City
        </h4>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-cream border border-brown-muted/20 rounded-lg text-sm text-ink appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
          >
            {cities.length > 0
              ? cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))
              : <option>Hyderabad</option>
            }
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted pointer-events-none" />
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">
          Cuisine Type
        </h4>
        <div className="space-y-1.5">
          {CUISINE_TYPES.map((cuisine) => (
            <label
              key={cuisine}
              className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-cream-dark transition-colors group"
            >
              <div
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                  selectedCuisines.includes(cuisine)
                    ? 'bg-saffron border-saffron'
                    : 'border-brown-muted/30 group-hover:border-saffron/50'
                )}
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

      {/* Dietary */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">
          Dietary
        </h4>
        <div className="space-y-2.5">
          {[
            { id: 'Veg Only', key: 'Veg Only' },
            { id: 'Non-Veg', key: 'Non-Veg' },
            { id: 'Halal', key: 'Halal' },
            { id: 'Jain', key: 'Jain' },
          ].map((diet) => (
            <div key={diet.key} className="flex items-center justify-between">
              <span className="text-sm text-ink">{diet.id}</span>
              <button
                onClick={() => toggleDietary(diet.key)}
                className={cn(
                  'w-10 h-5 rounded-full transition-all duration-200 relative',
                  dietaryFilters.includes(diet.key)
                    ? 'bg-saffron'
                    : 'bg-brown-muted/20'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200',
                    dietaryFilters.includes(diet.key) ? 'left-5' : 'left-0.5'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brown-muted">₹{priceRange[0]}</span>
            <span className="text-brown-muted">₹{priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1.5 bg-brown-muted/20 rounded-full appearance-none cursor-pointer accent-saffron [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-saffron [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brown-muted" />
              <input
                type="number"
                min={0}
                max={2000}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value) || 0, priceRange[1]), priceRange[1]])}
                className="w-full pl-7 pr-2 py-1.5 bg-cream border border-brown-muted/20 rounded-md text-sm text-ink focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Min"
              />
            </div>
            <span className="text-brown-muted self-center">—</span>
            <div className="relative flex-1">
              <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brown-muted" />
              <input
                type="number"
                min={0}
                max={2000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value) || 0, priceRange[0])])}
                className="w-full pl-7 pr-2 py-1.5 bg-cream border border-brown-muted/20 rounded-md text-sm text-ink focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Min Score */}
      <div>
        <h4 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-2.5">
          Minimum Score
        </h4>
        <div className="flex gap-2">
          {[7, 8, 9].map((score) => (
            <button
              key={score}
              onClick={() => setMinScore(minScore === score ? null : score)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-semibold border transition-all',
                minScore === score
                  ? 'bg-saffron text-cream border-saffron shadow-sm'
                  : 'bg-cream text-brown-muted border-brown-muted/20 hover:border-saffron/50 hover:text-ink'
              )}
            >
              {score}+
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-1">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brown-muted" />
            <span className="text-sm text-ink">Open Now</span>
          </div>
          <button
            onClick={() => setOpenNow(!openNow)}
            className={cn(
              'w-10 h-5 rounded-full transition-all duration-200 relative',
              openNow ? 'bg-saffron' : 'bg-brown-muted/20'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200',
                openNow ? 'left-5' : 'left-0.5'
              )}
            />
          </button>
        </label>
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-brown-muted" />
            <span className="text-sm text-ink">Verified Only</span>
          </div>
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              'w-10 h-5 rounded-full transition-all duration-200 relative',
              verifiedOnly ? 'bg-saffron' : 'bg-brown-muted/20'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200',
                verifiedOnly ? 'left-5' : 'left-0.5'
              )}
            />
          </button>
        </label>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => {
          /* filters auto-apply, but this closes mobile sheet */
        }}
        className="w-full py-3 bg-saffron text-cream rounded-lg font-semibold hover:bg-saffron-light transition-all active:scale-[0.98] shadow-sm"
      >
        Apply Filters
      </button>
    </div>
  )
}

// ─── Result Card ─────────────────────────────────────────────────────────────

function TopResultCard({ dish, viewMode }: { dish: DishResult; viewMode: ViewMode }) {
  return (
    <div
      className={cn(
        'relative bg-cream border-2 border-saffron/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-saffron/5 hover:border-saffron/50 group',
        viewMode === 'grid' ? '' : ''
      )}
    >
      {/* Best Match Banner */}
      <div className="absolute top-0 left-0 z-10">
        <div className="bg-saffron text-cream text-xs font-bold px-4 py-1.5 rounded-br-lg shadow-sm flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-current" />
          Best Match
        </div>
      </div>

      <div className={cn(viewMode === 'grid' ? '' : 'flex')}>
        {/* Photo */}
        <div className={cn(viewMode === 'grid' ? 'h-48' : 'w-48 min-h-full shrink-0', 'relative')}>
          <PhotoPlaceholder seed={parseInt(dish.id, 10) || 0} className="!rounded-none w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Score on photo for mobile overlap */}
          <div className={cn('absolute bottom-3 left-3', viewMode === 'list' && 'hidden')}>
            <ScoreBadge score={dish.score} size="lg" />
          </div>
        </div>

        {/* Info */}
        <div className={cn('p-5 flex-1', viewMode === 'list' && 'flex flex-col justify-center')}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-serif font-bold text-ink leading-tight">
                {dish.dishName}
              </h3>
              <p className="text-sm text-brown-muted mt-0.5 flex items-center gap-1">
                <MapPinned className="w-3.5 h-3.5 shrink-0" />
                {dish.restaurantName}, {dish.area}
              </p>
            </div>
            {/* Score for list view */}
            {viewMode === 'list' && (
              <div className="shrink-0">
                <ScoreBadge score={dish.score} size="lg" />
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-sm text-ink font-semibold">
              <IndianRupee className="w-3.5 h-3.5 text-brown-muted" />
              {dish.price}
            </div>
            <div className="flex items-center gap-1 text-sm text-brown-muted">
              <Star className="w-3.5 h-3.5 fill-saffron/30 text-saffron" />
              {dish.reviewCount.toLocaleString()} reviews
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {dish.dietaryTags.map((tag) => (
              <DietaryTag key={tag} label={tag} />
            ))}
          </div>



          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron text-cream text-sm font-semibold rounded-lg hover:bg-saffron-light transition-all active:scale-[0.97] shadow-sm">
              View Dish
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-saffron/30 text-saffron text-sm font-semibold rounded-lg hover:bg-saffron/5 hover:border-saffron/50 transition-all active:scale-[0.97]">
              View Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RegularResultCard({ dish, viewMode }: { dish: DishResult; viewMode: ViewMode }) {
  return (
    <div
      className={cn(
        'bg-cream border border-brown-muted/10 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group',
        'hover:shadow-lg hover:shadow-saffron/5 hover:border-saffron/30 hover:-translate-y-0.5',
        viewMode === 'list' && 'flex'
      )}
    >
      {/* Photo */}
      <div className={cn(viewMode === 'grid' ? 'h-40' : 'w-28 h-28 shrink-0', 'relative')}>
        <PhotoPlaceholder seed={parseInt(dish.id, 10) || 0} className="!rounded-none w-full h-full" />
        {viewMode === 'grid' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        )}
      </div>

      {/* Info */}
      <div className={cn('p-3.5 flex-1 min-w-0', viewMode === 'list' && 'flex items-center gap-3 p-3')}>
        {viewMode === 'grid' ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-serif font-bold text-ink leading-tight truncate">
                  {dish.dishName}
                </h4>
                <p className="text-xs text-brown-muted truncate mt-0.5">
                  {dish.restaurantName}, {dish.area}
                </p>
              </div>
              <ScoreBadge score={dish.score} size="sm" />
            </div>
            <div className="flex items-center gap-2.5 mt-2">
              <div className="flex items-center gap-1 text-xs text-ink font-medium">
                <IndianRupee className="w-3 h-3 text-brown-muted" />
                {dish.price}
              </div>
              <div className="flex items-center gap-1 text-xs text-brown-muted">
                <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
                {dish.reviewCount >= 1000
                  ? (dish.reviewCount / 1000).toFixed(1) + 'k'
                  : dish.reviewCount}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {dish.dietaryTags.map((tag) => (
                <DietaryTag key={tag} label={tag} />
              ))}
            </div>
          </>
        ) : (
          <>
            <ScoreBadge score={dish.score} size="md" />
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-serif font-bold text-ink leading-tight truncate">
                {dish.dishName}
              </h4>
              <p className="text-xs text-brown-muted truncate">
                {dish.restaurantName}, {dish.area}
              </p>
              <div className="flex items-center gap-2.5 mt-1">
                <div className="flex items-center gap-1 text-xs text-ink font-medium">
                  <IndianRupee className="w-3 h-3 text-brown-muted" />
                  {dish.price}
                </div>
                <div className="flex items-center gap-1 text-xs text-brown-muted">
                  <Star className="w-3 h-3 fill-saffron/30 text-saffron" />
                  {dish.reviewCount >= 1000
                    ? (dish.reviewCount / 1000).toFixed(1) + 'k'
                    : dish.reviewCount}
                </div>
                <div className="flex flex-wrap gap-1">
                  {dish.dietaryTags.map((tag) => (
                    <DietaryTag key={tag} label={tag} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ query, city }: { query: string; city: string }) {
  const popularDishes = ['Masala Dosa', 'Butter Chicken', 'Pav Bhaji', 'Pani Puri']

  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-cream-dark border border-brown-muted/10 flex items-center justify-center">
        <Search className="w-8 h-8 text-brown-muted/50" />
      </div>
      <h3 className="text-xl font-serif font-bold text-ink mb-2">
        No dishes found for &ldquo;{query}&rdquo;
      </h3>
      <p className="text-brown-muted text-sm mb-1">
        We couldn&apos;t find any results for {query} in {city}.
      </p>
      <p className="text-brown-muted text-xs mb-6">
        Try a different dish name, adjust your filters, or explore popular dishes below.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <span className="text-xs text-brown-muted self-center mr-1">Suggestions:</span>
        <button className="px-3 py-1.5 bg-cream-dark text-ink text-xs font-medium rounded-full border border-brown-muted/10 hover:border-saffron/30 hover:bg-saffron/5 transition-all">
          Try a different dish
        </button>
        <button className="px-3 py-1.5 bg-cream-dark text-ink text-xs font-medium rounded-full border border-brown-muted/10 hover:border-saffron/30 hover:bg-saffron/5 transition-all">
          Try a different city
        </button>
      </div>
      <div className="border-t border-brown-muted/10 pt-6 max-w-md mx-auto">
        <p className="text-xs font-medium text-brown-muted uppercase tracking-wider mb-3">
          Popular dishes in {city}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularDishes.map((dish) => (
            <button
              key={dish}
              className="px-3 py-1.5 bg-cream text-ink text-xs font-medium rounded-full border border-brown-muted/10 hover:border-saffron/30 hover:bg-saffron/5 transition-all"
            >
              {dish}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Search Suggestions ───────────────────────────────────────────────────────

function SearchSuggestions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-brown-muted whitespace-nowrap">
        People also searched:
      </span>
      {SUGGESTED_SEARCHES.map((s, i) => (
        <button
          key={i}
          className="px-3 py-1.5 bg-cream-dark text-ink text-xs font-medium rounded-full border border-brown-muted/10 hover:border-saffron/30 hover:bg-saffron/5 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

// ─── Main Search Page Content ────────────────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''
  const [query] = useState(queryParam || 'Biryani')

  // Data state
  const [results, setResults] = useState<DishResult[]>([])
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<City[]>([])
  const [error, setError] = useState<string | null>(null)

  // View & Sort
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // City
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(undefined)

  // Filters
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [dietaryFilters, setDietaryFilters] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [minScore, setMinScore] = useState<number | null>(null)
  const [openNow, setOpenNow] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Mobile
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Load cities on mount
  useEffect(() => {
    getCities().then(setCities)
  }, [])

  // Fetch results from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await searchDishes(query, {
          cityId: selectedCityId,
          isVeg: dietaryFilters.includes('Veg Only') ? true : undefined,
          isHalal: dietaryFilters.includes('Halal') ? true : undefined,
          minScore: minScore ?? undefined,
          maxPrice: priceRange[1] < 2000 ? priceRange[1] : undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          sortBy: sortBy === 'price_asc' ? 'price_asc' as const :
                  sortBy === 'price_desc' ? 'price_desc' as const :
                  sortBy === 'review_count' ? 'review_count' as const :
                  'score' as const,
          limit: 50,
        })

        const mapped: DishResult[] = data.map((d) => ({
          id: d.id,
          dishName: d.name,
          restaurantName: d.restaurant?.name || '',
          restaurantId: d.restaurant_id,
          area: d.restaurant?.address || '',
          city: d.restaurant?.city?.name || '',
          score: d.score,
          reviewCount: d.review_count,
          price: Number(d.price) || 0,
          isVeg: d.is_veg,
          isHalal: d.is_halal,
          dietaryTags: [
            d.is_veg ? 'Veg' : 'Non-Veg',
            ...(d.is_halal ? ['Halal'] : []),
          ],
          category: d.category || '',
        }))

        // Apply client-side filters (cuisine, non-veg toggle)
        let filtered = mapped
        if (dietaryFilters.includes('Non-Veg')) {
          filtered = filtered.filter((d) => !d.isVeg)
        }
        if (dietaryFilters.includes('Jain')) {
          filtered = filtered.filter((d) => d.isHalal) // Jain sim
        }
        if (selectedCuisines.length > 0) {
          filtered = filtered.filter((d) =>
            selectedCuisines.some((c) =>
              d.category.toLowerCase().includes(c.toLowerCase())
            )
          )
        }

        setResults(filtered)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to load results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, selectedCityId, dietaryFilters, priceRange, minScore, sortBy, selectedCuisines])

  // Map city name to ID
  useEffect(() => {
    const city = cities.find((c) => c.name === selectedCity)
    setSelectedCityId(city?.id)
  }, [selectedCity, cities])

  const topResult = results[0]
  const otherResults = results.slice(1)

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Best Rated'

  const hasActiveFilters =
    selectedCuisines.length > 0 ||
    dietaryFilters.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 2000 ||
    minScore !== null ||
    openNow ||
    verifiedOnly

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* ─── Sticky Search Header ───────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-brown-muted/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Search Bar Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
              <input
                type="text"
                defaultValue={query}
                placeholder="Search any dish..."
                className="w-full pl-10 pr-4 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm text-ink placeholder:text-brown-muted/50 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
              />
            </div>
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm text-ink hover:bg-cream-darker transition-all"
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-saffron" />
              )}
            </button>
            {/* City Selector (desktop) */}
            <div className="hidden sm:flex relative">
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-cream-dark border border-brown-muted/10 rounded-xl text-sm text-ink">
                <MapPin className="w-4 h-4 text-saffron" />                    <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none text-sm text-ink appearance-none cursor-pointer pr-5 focus:outline-none"
                >
                  {cities.length > 0
                    ? cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))
                    : <option>Hyderabad</option>
                  }
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-brown-muted absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Meta + Sort + View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-ink">
                Results for {query}
              </h1>
              <span className="text-sm text-brown-muted hidden sm:inline">
                {results.length} restaurant{results.length !== 1 ? 's' : ''} serving {query} in {selectedCity}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-dark border border-brown-muted/10 rounded-lg text-xs font-medium text-ink hover:bg-cream-darker transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-brown-muted" />
                  {sortLabel}
                  <ChevronDown className={cn('w-3 h-3 text-brown-muted transition-transform', showSortDropdown && 'rotate-180')} />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-cream border border-brown-muted/10 rounded-xl shadow-lg overflow-hidden">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setShowSortDropdown(false)
                          }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-sm transition-colors',
                            sortBy === option.value
                              ? 'bg-saffron/10 text-saffron font-medium'
                              : 'text-ink hover:bg-cream-dark'
                          )}
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
                  className={cn(
                    'p-1.5 transition-all',
                    viewMode === 'grid'
                      ? 'bg-saffron text-cream'
                      : 'text-brown-muted hover:text-ink'
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 transition-all',
                    viewMode === 'list'
                      ? 'bg-saffron text-cream'
                      : 'text-brown-muted hover:text-ink'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile result count */}
          <p className="text-xs text-brown-muted mt-1 sm:hidden">
            {results.length} restaurant{results.length !== 1 ? 's' : ''} serving {query} in {selectedCity}
          </p>
        </div>
      </div>

      {/* ─── Main Content Area ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Suggestions */}
        <div className="mb-4">
          <SearchSuggestions />
        </div>

        {/* Active Filters */}
        <div className="mb-4">
          <ActiveFiltersBar
            selectedCuisines={selectedCuisines}
            dietaryFilters={dietaryFilters}
            priceRange={priceRange}
            minScore={minScore}
            openNow={openNow}
            verifiedOnly={verifiedOnly}
            setSelectedCuisines={setSelectedCuisines}
            setDietaryFilters={setDietaryFilters}
            setPriceRange={setPriceRange}
            setMinScore={setMinScore}
            setOpenNow={setOpenNow}
            setVerifiedOnly={setVerifiedOnly}
          />
        </div>

        <div className="flex gap-8">
          {/* ─── Sidebar (Desktop) ───────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-48 bg-cream border border-brown-muted/10 rounded-xl p-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
              <FilterSidebar
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                selectedCuisines={selectedCuisines}
                setSelectedCuisines={setSelectedCuisines}
                dietaryFilters={dietaryFilters}
                setDietaryFilters={setDietaryFilters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minScore={minScore}
                setMinScore={setMinScore}
                openNow={openNow}
                setOpenNow={setOpenNow}
                verifiedOnly={verifiedOnly}
                setVerifiedOnly={setVerifiedOnly}
                cities={cities}
              />
            </div>
          </aside>

          {/* ─── Results Area ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-4">
                <div className="h-48 bg-cream-dark rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 bg-cream-dark rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <EmptyState query={query} city={selectedCity} />
            ) : (
              <div className="space-y-5">
                {/* Top Result */}
                {topResult && (
                  <div>
                    <TopResultCard dish={topResult} viewMode={viewMode} />
                  </div>
                )}

                {/* Divider */}
                {otherResults.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-brown-muted/10" />
                    <span className="text-xs font-medium text-brown-muted uppercase tracking-wider">
                      More results
                    </span>
                    <div className="flex-1 h-px bg-brown-muted/10" />
                  </div>
                )}

                {/* Regular Results */}
                {otherResults.length > 0 && (
                  <div
                    className={cn(
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                        : 'space-y-3'
                    )}
                  >
                    {otherResults.map((dish) => (
                      <RegularResultCard key={dish.id} dish={dish} viewMode={viewMode} />
                    ))}
                  </div>
                )}

                {/* Load More */}
                <div className="text-center pt-2 pb-8">
                  <button className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-saffron/30 text-saffron font-semibold rounded-xl hover:bg-saffron/5 hover:border-saffron/50 transition-all text-sm active:scale-[0.97]">
                    Load More Results
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Sheet ─────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
            <div className="bg-[#FBF6EE] rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-brown-muted/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3 border-b border-brown-muted/10">
                <h3 className="font-semibold text-ink font-serif text-lg">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors"
                >
                  <X className="w-5 h-5 text-brown-muted" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4">
                <FilterSidebar
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  selectedCuisines={selectedCuisines}
                  setSelectedCuisines={setSelectedCuisines}
                  dietaryFilters={dietaryFilters}
                  setDietaryFilters={setDietaryFilters}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minScore={minScore}
                  setMinScore={setMinScore}
                  openNow={openNow}
                  setOpenNow={setOpenNow}
                  verifiedOnly={verifiedOnly}
                  setVerifiedOnly={setVerifiedOnly}
                  cities={cities}
                />
              </div>

              {/* Bottom Apply */}
              <div className="sticky bottom-0 bg-[#FBF6EE] border-t border-brown-muted/10 px-5 py-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-saffron text-cream rounded-xl font-semibold hover:bg-saffron-light transition-all active:scale-[0.98] shadow-sm"
                >
                  Show {results.length} Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  )
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
