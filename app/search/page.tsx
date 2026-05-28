'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, X, MapPin, ChevronDown, Grid3X3, List, Star, IndianRupee,
  TrendingUp, MapPinned, Filter, RotateCcw, UtensilsCrossed, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

type SortOption = 'score' | 'review_count' | 'price_asc' | 'price_desc'
type ViewMode = 'grid' | 'list'

interface DishResult {
  id: string
  dishName: string
  restaurantName: string
  area: string
  city: string
  score: number
  reviewCount: number
  price: number
  isVeg: boolean
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_RESULTS: DishResult[] = [
  { id: '1', dishName: 'Hyderabadi Dum Biryani', restaurantName: 'Paradise Restaurant', area: 'Banjara Hills', city: 'Hyderabad', score: 9.4, reviewCount: 4200, price: 450, isVeg: false },
  { id: '2', dishName: 'Chicken Biryani', restaurantName: 'Bawarchi', area: 'RTC X Roads', city: 'Hyderabad', score: 8.9, reviewCount: 3100, price: 380, isVeg: false },
  { id: '3', dishName: 'Mutton Biryani', restaurantName: 'Shadab Restaurant', area: 'Madina', city: 'Hyderabad', score: 8.7, reviewCount: 2800, price: 520, isVeg: false },
  { id: '4', dishName: 'Veg Biryani', restaurantName: 'Pista House', area: 'Hitech City', city: 'Hyderabad', score: 8.4, reviewCount: 1950, price: 320, isVeg: true },
  { id: '5', dishName: 'Chicken Dum Biryani', restaurantName: 'Cafe Bahar', area: 'Himayath Nagar', city: 'Hyderabad', score: 8.2, reviewCount: 1700, price: 400, isVeg: false },
  { id: '6', dishName: 'Chicken 65 Biryani', restaurantName: 'Rayalaseema Ruchulu', area: 'Kukatpally', city: 'Hyderabad', score: 8.0, reviewCount: 1200, price: 350, isVeg: false },
  { id: '7', dishName: 'Egg Biryani', restaurantName: 'Meridian Restaurant', area: 'Ameerpet', city: 'Hyderabad', score: 7.8, reviewCount: 950, price: 290, isVeg: false },
  { id: '8', dishName: 'Paneer Biryani', restaurantName: 'Kritunga', area: 'Miyapur', city: 'Hyderabad', score: 7.6, reviewCount: 820, price: 310, isVeg: true },
]

const CUISINE_TYPES = ['Hyderabadi', 'North Indian', 'South Indian', 'Street Food', 'Chinese', 'Continental']
const CITIES = ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi', 'Chennai', 'Kolkata']

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'score', label: 'Best Rated' },
  { value: 'review_count', label: 'Most Reviewed' },
  { value: 'price_asc', label: 'Lowest Price' },
  { value: 'price_desc', label: 'Highest Price' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const photoGradients = [
  'from-amber-900/70 via-orange-600/50 to-yellow-500/30',
  'from-orange-800/70 via-amber-600/50 to-yellow-400/30',
  'from-red-800/60 via-orange-700/50 to-amber-500/40',
  'from-yellow-900/60 via-amber-700/50 to-orange-500/30',
]

function PhotoPlaceholder({ seed }: { seed: number }) {
  return (
    <div className={`w-full h-full bg-gradient-to-br ${photoGradients[seed % photoGradients.length]} flex items-center justify-center`}>
      <UtensilsCrossed className="w-8 h-8 text-white/40" />
    </div>
  )
}

function ScoreBadge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const color =
    score >= 9 ? 'bg-emerald-500 text-white' :
    score >= 8.5 ? 'bg-[#C8702A] text-[#FBF6EE]' :
    score >= 8 ? 'bg-[#C8702A]/80 text-[#FBF6EE]' :
    'bg-[#A08060]/20 text-[#A08060]'

  return (
    <div className={`font-bold rounded-lg flex items-center justify-center leading-none ${size === 'lg' ? 'text-2xl px-3 py-2' : size === 'md' ? 'text-lg px-2.5 py-1.5' : 'text-sm px-2 py-1'} ${color}`}>
      {score}
      <span className="opacity-60 text-xs ml-0.5">/10</span>
    </div>
  )
}

// ─── Filter Sidebar ──────────────────────────────────────────────────────────

function FilterSidebar({
  selectedCity, setSelectedCity, selectedCuisines, setSelectedCuisines,
  priceRange, setPriceRange, minScore, setMinScore
}: {
  selectedCity: string; setSelectedCity: (v: string) => void
  selectedCuisines: string[]; setSelectedCuisines: (v: string[]) => void
  priceRange: [number, number]; setPriceRange: (v: [number, number]) => void
  minScore: number | null; setMinScore: (v: number | null) => void
}) {
  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(
      selectedCuisines.includes(cuisine)
        ? selectedCuisines.filter((c) => c !== cuisine)
        : [...selectedCuisines, cuisine]
    )
  }

  const hasChanges = selectedCuisines.length > 0 || priceRange[0] > 0 || priceRange[1] < 2000 || minScore !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1E1208] text-lg font-serif">Filter Results</h3>
        {hasChanges && (
          <button onClick={() => { setSelectedCuisines([]); setPriceRange([0, 2000]); setMinScore(null) }}
            className="text-xs text-[#A08060] hover:text-[#1E1208] flex items-center gap-1 transition-colors">
            <RotateCcw className="w-3 h-3" /> Clear All
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <h4 className="text-xs font-semibold text-[#A08060] uppercase tracking-wider mb-2.5">City</h4>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08060]" />
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-[#FBF6EE] border border-[#A08060]/20 rounded-lg text-sm text-[#1E1208] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8702A]/30 focus:border-[#C8702A]/50 transition-all">
            {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08060] pointer-events-none" />
        </div>
      </div>

      {/* Cuisine */}
      <div>
        <h4 className="text-xs font-semibold text-[#A08060] uppercase tracking-wider mb-2.5">Cuisine Type</h4>
        <div className="space-y-1.5">
          {CUISINE_TYPES.map((cuisine) => (
            <label key={cuisine} className="flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#F5EDD9] transition-colors group">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedCuisines.includes(cuisine) ? 'bg-[#C8702A] border-[#C8702A]' : 'border-[#A08060]/30 group-hover:border-[#C8702A]/50'}`}>
                {selectedCuisines.includes(cuisine) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-[#1E1208]">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-[#A08060] uppercase tracking-wider mb-2.5">Price Range</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#A08060]">₹{priceRange[0]}</span>
            <span className="text-[#A08060]">₹{priceRange[1]}</span>
          </div>
          <input type="range" min={0} max={2000} step={50} value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1.5 bg-[#A08060]/20 rounded-full appearance-none cursor-pointer accent-[#C8702A]" />
        </div>
      </div>

      {/* Min Score */}
      <div>
        <h4 className="text-xs font-semibold text-[#A08060] uppercase tracking-wider mb-2.5">Minimum Score</h4>
        <div className="flex gap-2">
          {[7, 8, 9].map((score) => (
            <button key={score} onClick={() => setMinScore(minScore === score ? null : score)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${minScore === score ? 'bg-[#C8702A] text-[#FBF6EE] border-[#C8702A] shadow-sm' : 'bg-[#FBF6EE] text-[#A08060] border-[#A08060]/20 hover:border-[#C8702A]/50 hover:text-[#1E1208]'}`}>
              {score}+
            </button>
          ))}
        </div>
      </div>

      <button className="w-full py-3 bg-[#C8702A] text-[#FBF6EE] rounded-lg font-semibold hover:bg-[#E08030] transition-all active:scale-[0.98] shadow-sm">
        Apply Filters
      </button>
    </div>
  )
}

// ─── Result Cards ────────────────────────────────────────────────────────────

function ResultCard({ dish, viewMode, isTop }: { dish: DishResult; viewMode: ViewMode; isTop?: boolean }) {
  return (
    <div className={`bg-[#FBF6EE] border ${isTop ? 'border-2 border-[#C8702A]/30' : 'border border-[#A08060]/10'} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#C8702A]/5 hover:border-[#C8702A]/30 hover:-translate-y-0.5 group ${viewMode === 'list' ? 'flex' : ''}`}>
      {isTop && (
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-[#C8702A] text-[#FBF6EE] text-xs font-bold px-4 py-1.5 rounded-br-lg shadow-sm flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-current" /> Best Match
          </div>
        </div>
      )}
      <div className={`${viewMode === 'grid' ? '' : 'flex'} relative`}>
        <div className={`${viewMode === 'grid' ? 'h-40' : 'w-28 h-28 shrink-0'} relative`}>
          <PhotoPlaceholder seed={parseInt(dish.id)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="p-3.5 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-serif font-bold text-[#1E1208] leading-tight truncate">{dish.dishName}</h3>
              <p className="text-xs text-[#A08060] truncate mt-0.5 flex items-center gap-1">
                <MapPinned className="w-3 h-3 shrink-0" />
                {dish.restaurantName}, {dish.area}
              </p>
            </div>
            <ScoreBadge score={dish.score} size="sm" />
          </div>
          <div className="flex items-center gap-2.5 mt-2">
            <div className="flex items-center gap-1 text-xs text-[#1E1208] font-medium">
              <IndianRupee className="w-3 h-3 text-[#A08060]" /> {dish.price}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#A08060]">
              <Star className="w-3 h-3 fill-[#C8702A]/30 text-[#C8702A]" />
              {dish.reviewCount >= 1000 ? (dish.reviewCount / 1000).toFixed(1) + 'k' : dish.reviewCount}
            </div>
            <Badge className={`text-[10px] px-1.5 py-0 ${dish.isVeg ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {dish.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8702A] text-[#FBF6EE] text-xs font-semibold rounded-lg hover:bg-[#E08030] transition-all active:scale-[0.97] shadow-sm">
              View Dish <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Search Page ────────────────────────────────────────────────────────

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || 'Biryani'

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Hyderabad')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [minScore, setMinScore] = useState<number | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || 'Best Rated'

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* ─── Sticky Search Header ───────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-[#A08060]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08060]" />
              <input type="text" defaultValue={query} placeholder="Search any dish..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5EDD9] border border-[#A08060]/10 rounded-xl text-sm text-[#1E1208] placeholder:text-[#A08060]/50 focus:outline-none focus:ring-2 focus:ring-[#C8702A]/30 focus:border-[#C8702A]/50 transition-all" />
            </div>
            <button onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#F5EDD9] border border-[#A08060]/10 rounded-xl text-sm text-[#1E1208] hover:bg-[#F0E6CE] transition-all">
              <Filter className="w-4 h-4" />
            </button>
            <div className="hidden sm:flex relative">
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#F5EDD9] border border-[#A08060]/10 rounded-xl text-sm text-[#1E1208]">
                <MapPin className="w-4 h-4 text-[#C8702A]" />
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent border-none text-sm text-[#1E1208] appearance-none cursor-pointer pr-5 focus:outline-none">
                  {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#A08060] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-serif font-bold text-[#1E1208]">Results for {query}</h1>
              <span className="text-sm text-[#A08060] hidden sm:inline">in {selectedCity}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5EDD9] border border-[#A08060]/10 rounded-lg text-xs font-medium text-[#1E1208] hover:bg-[#F0E6CE] transition-all">
                  <TrendingUp className="w-3.5 h-3.5 text-[#A08060]" /> {sortLabel}
                  <ChevronDown className={`w-3 h-3 text-[#A08060] transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-[#FBF6EE] border border-[#A08060]/10 rounded-xl shadow-lg overflow-hidden">
                      {SORT_OPTIONS.map((option) => (
                        <button key={option.value} onClick={() => { setSortBy(option.value); setShowSortDropdown(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === option.value ? 'bg-[#C8702A]/10 text-[#C8702A] font-medium' : 'text-[#1E1208] hover:bg-[#F5EDD9]'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-[#F5EDD9] border border-[#A08060]/10 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all ${viewMode === 'grid' ? 'bg-[#C8702A] text-[#FBF6EE]' : 'text-[#A08060] hover:text-[#1E1208]'}`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all ${viewMode === 'list' ? 'bg-[#C8702A] text-[#FBF6EE]' : 'text-[#A08060] hover:text-[#1E1208]'}`}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-48 bg-[#FBF6EE] border border-[#A08060]/10 rounded-xl p-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
              <FilterSidebar
                selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                selectedCuisines={selectedCuisines} setSelectedCuisines={setSelectedCuisines}
                priceRange={priceRange} setPriceRange={setPriceRange}
                minScore={minScore} setMinScore={setMinScore}
              />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              {/* Top Result */}
              <ResultCard dish={SAMPLE_RESULTS[0]} viewMode={viewMode} isTop />

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#A08060]/10" />
                <span className="text-xs font-medium text-[#A08060] uppercase tracking-wider">More results</span>
                <div className="flex-1 h-px bg-[#A08060]/10" />
              </div>

              {/* Regular Results */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
                {SAMPLE_RESULTS.slice(1).map((dish) => (
                  <ResultCard key={dish.id} dish={dish} viewMode={viewMode} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center pt-2 pb-8">
                <button className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#C8702A]/30 text-[#C8702A] font-semibold rounded-xl hover:bg-[#C8702A]/5 hover:border-[#C8702A]/50 transition-all text-sm active:scale-[0.97]">
                  Load More Results <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Filter Sheet ────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="bg-[#FBF6EE] rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-[#A08060]/20" /></div>
              <div className="flex items-center justify-between px-5 pb-3 border-b border-[#A08060]/10">
                <h3 className="font-semibold text-[#1E1208] font-serif text-lg">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-lg hover:bg-[#F5EDD9] transition-colors">
                  <X className="w-5 h-5 text-[#A08060]" />
                </button>
              </div>
              <div className="px-5 py-4">
                <FilterSidebar
                  selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                  selectedCuisines={selectedCuisines} setSelectedCuisines={setSelectedCuisines}
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  minScore={minScore} setMinScore={setMinScore}
                />
              </div>
              <div className="sticky bottom-0 bg-[#FBF6EE] border-t border-[#A08060]/10 px-5 py-4">
                <button onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-[#C8702A] text-[#FBF6EE] rounded-xl font-semibold hover:bg-[#E08030] transition-all active:scale-[0.98] shadow-sm">
                  Show {SAMPLE_RESULTS.length} Results
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function SearchPage() {
  return (
    <Suspense fallback={
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
    }>
      <SearchPageContent />
    </Suspense>
  )
}
