'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Search,
  X,
  Check,
  CheckCircle2,
  ChevronRight,
  MapPin, Star, Camera, ArrowLeft,
  ArrowRight,
  Upload,
  MessageCircle,
  Twitter,
  Instagram,
  ExternalLink,
  Plus,
  Clock,
  Loader2,
  Sparkles,
  RotateCcw,
  Store,
  ChefHat,
  ThumbsUp,
  ThumbsDown,
  Award,
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { searchRestaurants, getDishesByRestaurant, submitReview } from '@/lib/queries'
import type { Restaurant, Dish } from '@/types'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DishRating {
  dishId: string
  dishName: string
  price: number
  score: number
  tags: string[]
  reviewText: string
  orderAgain: boolean | null
  photoPreview: string | null
  photoFile: File | null
}

interface OverallRatings {
  food: number
  service: number
  ambience: number
  valueForMoney: number
}

type ReviewStep = 1 | 2 | 3 | 4
type SlideDir = 'left' | 'right' | null

const QUICK_TAGS_TASTE = ['Too Spicy', 'Perfect Spice', 'Mild']
const QUICK_TAGS_PORTION = ['Small Portion', 'Good Portion', 'Large Portion']
const QUICK_TAGS_VALUE = ['Great Value', 'Overpriced', 'Worth It']
const QUICK_TAGS_AUTHENTIC = ['Authentic', 'Not Authentic']
const QUICK_TAGS_FRESHNESS = ['Freshly Made', 'Seemed Stale']

const ALL_QUICK_TAGS = [
  ...QUICK_TAGS_TASTE,
  ...QUICK_TAGS_PORTION,
  ...QUICK_TAGS_VALUE,
  ...QUICK_TAGS_AUTHENTIC,
  ...QUICK_TAGS_FRESHNESS,
]

interface MenuDish {
  id: string
  name: string
  price: number
  is_veg: boolean
  is_halal: boolean
  description?: string | null
  category?: string | null
}

interface MenuCategory {
  name: string
  dishes: MenuDish[]
}

// ─── Group dishes into categories ────────────────────────────────────────────

function groupDishesByCategory(dishes: Dish[]): MenuCategory[] {
  const grouped: Record<string, MenuDish[]> = {}
  for (const d of dishes) {
    const cat = d.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push({
      id: d.id,
      name: d.name,
      price: d.price || 0,
      is_veg: d.is_veg,
      is_halal: d.is_halal,
      description: d.description,
      category: d.category,
    })
  }
  return Object.entries(grouped).map(([name, dishes]) => ({ name, dishes }))
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: ReviewStep }) {
  const steps = [
    { num: 1, label: 'Find Restaurant' },
    { num: 2, label: 'Select Dishes' },
    { num: 3, label: 'Rate Dishes' },
    { num: 4, label: 'Submit' },
  ]

  return (
    <div className="px-4 sm:px-0">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, i) => {
          const isCompleted = currentStep > step.num
          const isCurrent = currentStep === step.num
          const isFuture = currentStep < step.num

          return (
            <div key={step.num} className="flex items-center flex-1">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    isCompleted && 'bg-saffron text-cream shadow-sm shadow-saffron/30',
                    isCurrent && 'bg-saffron text-cream ring-2 ring-saffron/30 ring-offset-2 ring-offset-cream shadow-sm',
                    isFuture && 'bg-cream-dark text-brown-muted/60 border-2 border-brown-muted/15'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <span className="text-xs sm:text-sm">{step.num}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap hidden sm:block transition-colors',
                    isCurrent && 'text-saffron',
                    isCompleted && 'text-saffron',
                    isFuture && 'text-brown-muted/50'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-2 sm:mx-3 mt-[-1.5rem] sm:mt-[-1.75rem]">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      currentStep > step.num ? 'bg-saffron h-0.5' : 'bg-brown-muted/15 h-px'
                    )}
                    style={{
                      width: isCurrent || isCompleted ? '100%' : '100%',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {/* Mobile labels */}
      <div className="flex justify-center mt-2 sm:hidden">
        <span className="text-xs font-medium text-saffron">
          {steps.find((s) => s.num === currentStep)?.label}
        </span>
      </div>
    </div>
  )
}

// ─── Step 1: Find Restaurant ────────────────────────────────────────────────

function Step1FindRestaurant({
  selectedRestaurant,
  onSelectRestaurant,
  onNext,
}: {
  selectedRestaurant: Restaurant | null
  onSelectRestaurant: (r: Restaurant) => void
  onNext: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchResults, setSearchResults] = useState<Restaurant[]>([])
  const [searching, setSearching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Search restaurants from Supabase
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const results = await searchRestaurants(searchQuery)
      setSearchResults(results)
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          Which restaurant did you visit?
        </h2>
        <p className="text-sm text-brown-muted mt-1">
          Search for the restaurant where you ate
        </p>
      </div>

      {/* Search */}
      <div ref={dropdownRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search restaurant name or area..."
            className="w-full pl-10 pr-10 py-3.5 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-ink placeholder:text-brown-muted/50 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                setShowDropdown(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-muted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {showDropdown && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-cream border border-brown-muted/15 rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
            {searching ? (
              <div className="p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-brown-muted/40 mx-auto" />
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRestaurant(r)
                    setSearchQuery('')
                    setShowDropdown(false)
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-cream-dark transition-colors flex items-center gap-3 border-b border-brown-muted/5 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-amber-500/20 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-saffron" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{r.name}</p>
                    <p className="text-xs text-brown-muted truncate">{r.address}, {r.city?.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-brown-muted bg-cream-dark px-1.5 py-0.5 rounded">
                        {r.cuisine_type.slice(0, 2).join(', ')}
                      </span>
                      <span className="text-[10px] text-saffron flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-saffron/40" />
                        {r.overall_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brown-muted shrink-0" />
                </button>
              ))
            ) : (
              <div className="p-6 text-center">
                <Store className="w-8 h-8 text-brown-muted/30 mx-auto mb-2" />
                <p className="text-sm text-brown-muted">No restaurants found for &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-brown-muted/60 mt-0.5">Try a different name or area</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recently Reviewed - top restaurants from DB */}
      {!selectedRestaurant && searchResults.length > 0 && searchQuery.length >= 2 && (
        <div>
          <h3 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Top Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {searchResults.slice(0, 3).map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRestaurant(r)}
                className="text-left p-4 bg-cream border border-brown-muted/10 rounded-xl hover:border-saffron/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Store className="w-5 h-5 text-saffron" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{r.name}</p>
                    <p className="text-xs text-brown-muted truncate">{r.address}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-saffron flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-saffron/40" />
                        {r.overall_score.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-brown-muted">• {r.review_count.toLocaleString()} reviews</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Restaurant Confirmation */}
      {selectedRestaurant && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 animate-slide-in-left">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-ink">{selectedRestaurant.name}</h3>
                {selectedRestaurant.is_verified && (
                  <span className="text-[10px] bg-saffron/10 text-saffron px-1.5 py-0.5 rounded font-medium">Verified</span>
                )}
              </div>
              <p className="text-sm text-brown-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {selectedRestaurant.address}, {selectedRestaurant.city?.name}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {selectedRestaurant.cuisine_type.map((c) => (
                  <span key={c} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onSelectRestaurant(null as unknown as Restaurant)}
              className="p-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!selectedRestaurant || !selectedRestaurant.id}
        className={cn(
          'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]',
          selectedRestaurant && selectedRestaurant.id
            ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
            : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
        )}
      >
        Next Step
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Step 2: Select Dishes ─────────────────────────────────────────────────

function Step2SelectDishes({
  restaurantId,
  selectedDishes,
  onToggleDish,
  categories,
  loadingDishes,
  onNext,
  onBack,
}: {
  restaurantId: string
  selectedDishes: string[]
  onToggleDish: (id: string) => void
  categories: MenuCategory[]
  loadingDishes: boolean
  onNext: () => void
  onBack: () => void
}) {
  const [customDish, setCustomDish] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleAddCustom = () => {
    if (customDish.trim()) {
      // Custom dishes get a special prefix
      onToggleDish(`custom::${customDish.trim()}`)
      setCustomDish('')
      setShowCustomInput(false)
    }
  }

  const getDishName = (id: string): string => {
    if (id.startsWith('custom::')) return id.replace('custom::', '') + ' (custom)'
    for (const cat of categories) {
      const d = cat.dishes.find((dd) => dd.id === id)
      if (d) return d.name
    }
    return 'Unknown'
  }

  if (loadingDishes) {
    return (
      <div className="space-y-6 animate-slide-in-right">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-cream-dark rounded w-48" />
          <div className="h-4 bg-cream-dark rounded w-64" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-cream-dark rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          What did you order?
        </h2>
        <p className="text-sm text-brown-muted mt-1">
          Select all the dishes you tried
        </p>
      </div>

      {/* Selected Dishes Pills */}
      {selectedDishes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-saffron/5 border border-saffron/15 rounded-xl">
          <span className="text-xs font-medium text-saffron">
            {selectedDishes.length} selected:
          </span>
          {selectedDishes.map((id) => (
            <button
              key={id}
              onClick={() => onToggleDish(id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-saffron text-cream text-xs font-medium rounded-full hover:bg-saffron-light transition-colors"
            >
              {getDishName(id)}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      {/* Menu by Category */}
      {categories.length === 0 ? (
        <div className="text-center py-8 bg-cream-dark rounded-xl">
          <ChefHat className="w-10 h-10 text-brown-muted/30 mx-auto mb-2" />
          <p className="text-sm text-brown-muted">No menu items found for this restaurant</p>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-semibold text-brown-muted uppercase tracking-wider mb-3">
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.dishes.map((dish) => {
                const isSelected = selectedDishes.includes(dish.id)
                return (
                  <button
                    key={dish.id}
                    onClick={() => onToggleDish(dish.id)}
                    className={cn(
                      'w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3',
                      isSelected
                        ? 'border-saffron bg-saffron/5'
                        : 'border-brown-muted/10 bg-cream hover:border-brown-muted/20 hover:bg-cream-dark'
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                        isSelected
                          ? 'bg-saffron border-saffron'
                          : 'border-brown-muted/30'
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{dish.name}</span>
                        {dish.is_veg ? (
                          <span className="w-3.5 h-3.5 rounded-sm border border-green-600 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-green-600" />
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-sm border border-red-600 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-red-600" />
                          </span>
                        )}
                      </div>
                      {dish.description && (
                        <p className="text-xs text-brown-muted/70 mt-0.5 line-clamp-1">{dish.description}</p>
                      )}
                    </div>

                    {/* Price */}
                    <span className="text-sm font-semibold text-ink shrink-0">
                      ₹{dish.price}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))
      )}

      {/* Custom Dish */}
      <div className="border-t border-brown-muted/10 pt-4">
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brown-muted/20 rounded-xl text-sm text-brown-muted hover:text-saffron hover:border-saffron/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            I ordered something not on the menu
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customDish}
              onChange={(e) => setCustomDish(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="Type dish name..."
              className="flex-1 px-3 py-2.5 bg-cream-dark border border-brown-muted/15 rounded-xl text-sm text-ink placeholder:text-brown-muted/50 focus:outline-none focus:ring-2 focus:ring-saffron/30"
              autoFocus
            />
            <button
              onClick={handleAddCustom}
              disabled={!customDish.trim()}
              className={cn(
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                customDish.trim()
                  ? 'bg-saffron text-cream hover:bg-saffron-light'
                  : 'bg-cream-dark text-brown-muted/50'
              )}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false)
                setCustomDish('')
              }}
              className="p-2.5 rounded-xl text-brown-muted hover:bg-cream-dark transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-brown-muted hover:text-ink hover:bg-cream-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedDishes.length === 0}
          className={cn(
            'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97]',
            selectedDishes.length > 0
              ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
              : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
          )}
        >
          Next Step
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Rate Dishes ───────────────────────────────────────────────────

function Step3RateDishes({
  selectedDishIds,
  dishRatings,
  onUpdateDishRating,
  overallRatings,
  onUpdateOverall,
  categories,
  onNext,
  onBack,
}: {
  selectedDishIds: string[]
  dishRatings: Record<string, DishRating>
  onUpdateDishRating: (id: string, data: Partial<DishRating>) => void
  overallRatings: OverallRatings
  onUpdateOverall: (data: Partial<OverallRatings>) => void
  categories: MenuCategory[]
  onNext: () => void
  onBack: () => void
}) {
  // Helper to get dish name
  const getDishName = (id: string): string => {
    if (id.startsWith('custom::')) return id.replace('custom::', '')
    for (const cat of categories) {
      const d = cat.dishes.find((dd) => dd.id === id)
      if (d) return d.name
    }
    return 'Unknown Dish'
  }

  const getDishPrice = (id: string): number => {
    if (id.startsWith('custom::')) return 0
    for (const cat of categories) {
      const d = cat.dishes.find((dd) => dd.id === id)
      if (d) return d.price
    }
    return 0
  }

  const allRated = selectedDishIds.every((id) => {
    const rating = dishRatings[id]
    return rating && rating.score > 0
  })

  const photoInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          How was each dish?
        </h2>
        <p className="text-sm text-brown-muted mt-1">
          Rate each dish you ordered
        </p>
      </div>

      {/* Per-Dish Rating Cards */}
      {selectedDishIds.map((dishId, idx) => {
        const rating = dishRatings[dishId] || {
          dishId,
          dishName: getDishName(dishId),
          price: getDishPrice(dishId),
          score: 0,
          tags: [],
          reviewText: '',
          orderAgain: null,
          photoPreview: null,
          photoFile: null,
        }
        const tagGroups = [
          { label: 'Taste', tags: QUICK_TAGS_TASTE },
          { label: 'Portion', tags: QUICK_TAGS_PORTION },
          { label: 'Value', tags: QUICK_TAGS_VALUE },
          { label: 'Authenticity', tags: QUICK_TAGS_AUTHENTIC },
          { label: 'Freshness', tags: QUICK_TAGS_FRESHNESS },
        ]

        return (
          <div
            key={dishId}
            className="bg-cream border border-brown-muted/10 rounded-xl overflow-hidden"
          >
            {/* Dish Header */}
            <div className="flex items-center gap-3 p-4 bg-cream-dark border-b border-brown-muted/10">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-amber-500/20 flex items-center justify-center shrink-0">
                <ChefHat className="w-5 h-5 text-saffron" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-ink">
                  {idx + 1}. {rating.dishName}
                </h3>
                <p className="text-xs text-brown-muted">₹{rating.price}</p>
              </div>
              {rating.score > 0 && (
                <div className="text-base font-bold text-saffron">
                  {rating.score}/10
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Star Rating 1-10 */}
              <div>
                <label className="text-xs font-medium text-brown-muted mb-2 block">
                  Your rating
                </label>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      onClick={() => onUpdateDishRating(dishId, { score: star })}
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md transition-all text-sm font-bold',
                        star <= (rating.score || 0)
                          ? 'bg-saffron text-cream'
                          : 'bg-cream-dark text-brown-muted/30 hover:bg-saffron/10 hover:text-saffron/50'
                      )}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tags */}
              {tagGroups.map((group) => (
                <div key={group.label}>
                  <label className="text-[10px] font-medium text-brown-muted uppercase tracking-wider mb-1.5 block">
                    {group.label}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tags.map((tag) => {
                      const isActive = rating.tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          onClick={() =>
                            onUpdateDishRating(dishId, {
                              tags: isActive
                                ? rating.tags.filter((t) => t !== tag)
                                : [...rating.tags, tag],
                            })
                          }
                          className={cn(
                            'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            isActive
                              ? 'bg-saffron text-cream border-saffron'
                              : 'bg-cream text-brown-muted border-brown-muted/15 hover:border-saffron/40 hover:text-ink'
                          )}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Review Text */}
              <div>
                <label className="text-xs font-medium text-brown-muted mb-1.5 block">
                  Your thoughts (optional)
                </label>
                <textarea
                  value={rating.reviewText}
                  onChange={(e) => onUpdateDishRating(dishId, { reviewText: e.target.value })}
                  placeholder="How was the taste, portion, freshness?"
                  rows={2}
                  className="w-full px-3 py-2 bg-cream-dark border border-brown-muted/15 rounded-lg text-sm text-ink placeholder:text-brown-muted/40 focus:outline-none focus:ring-2 focus:ring-saffron/30 resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="text-xs font-medium text-brown-muted mb-1.5 block">
                  Add photo (optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brown-muted/15 bg-cream-dark hover:bg-cream-darker text-xs text-brown-muted transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      {rating.photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </div>
                    <input
                      ref={(el) => { photoInputRefs.current[dishId] = el }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            onUpdateDishRating(dishId, {
                              photoFile: file,
                              photoPreview: reader.result as string,
                            })
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {rating.photoPreview && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                      <Image src={rating.photoPreview} alt="Preview" className="w-full h-full object-cover" width={48} height={48} unoptimized />
                      <button
                        onClick={() => {
                          onUpdateDishRating(dishId, { photoFile: null, photoPreview: null })
                          if (photoInputRefs.current[dishId]) {
                            photoInputRefs.current[dishId]!.value = ''
                          }
                        }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-ink/60 text-cream text-[8px] flex items-center justify-center"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Again */}
              <div>
                <label className="text-xs font-medium text-brown-muted mb-1.5 block">
                  Would you order this again?
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdateDishRating(dishId, { orderAgain: true })}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                      rating.orderAgain === true
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-cream-dark text-brown-muted border-brown-muted/15 hover:border-green-200'
                    )}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Yes
                  </button>
                  <button
                    onClick={() => onUpdateDishRating(dishId, { orderAgain: false })}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                      rating.orderAgain === false
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-cream-dark text-brown-muted border-brown-muted/15 hover:border-red-200'
                    )}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Overall Ratings */}
      <div className="bg-cream border border-brown-muted/10 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron" />
          Overall Visit Rating
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'food', label: 'Food Overall', value: overallRatings.food },
            { key: 'service', label: 'Service', value: overallRatings.service },
            { key: 'ambience', label: 'Ambience', value: overallRatings.ambience },
            { key: 'valueForMoney', label: 'Value for Money', value: overallRatings.valueForMoney },
          ].map((item) => (
            <div key={item.key} className="text-center">
              <label className="text-[10px] font-medium text-brown-muted uppercase tracking-wider block mb-1.5">
                {item.label}
              </label>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      onUpdateOverall({
                        [item.key]: star,
                      })
                    }
                    className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded text-xs font-bold transition-all',
                      star <= item.value
                        ? 'bg-saffron text-cream'
                        : 'bg-cream-dark text-brown-muted/20 hover:text-brown-muted/40'
                    )}
                  >
                    {star}
                  </button>
                ))}
              </div>
              {item.value > 0 && (
                <span className="text-xs font-bold text-saffron mt-1 block">{item.value}/10</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-brown-muted hover:text-ink hover:bg-cream-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allRated}
          className={cn(
            'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97]',
            allRated
              ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
              : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
          )}
        >
          Next Step
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Submit ────────────────────────────────────────────────────────

function Step4Submit({
  restaurant,
  selectedDishIds,
  dishRatings,
  overallRatings,
  categories,
  onBack,
  onSubmit,
  submitting,
}: {
  restaurant: Restaurant
  selectedDishIds: string[]
  dishRatings: Record<string, DishRating>
  overallRatings: OverallRatings
  categories: MenuCategory[]
  onBack: () => void
  onSubmit: (billFile: File | null) => void
  submitting: boolean
}) {
  const [billFile, setBillFile] = useState<File | null>(null)
  const [billPreview, setBillPreview] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getDishName = (id: string): string => {
    if (id.startsWith('custom::')) return id.replace('custom::', '')
    for (const cat of categories) {
      const d = cat.dishes.find((dd) => dd.id === id)
      if (d) return d.name
    }
    return 'Unknown Dish'
  }

  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBillFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setBillPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const totalItems = selectedDishIds.length
  const avgScore =
    selectedDishIds.reduce((sum, id) => sum + (dishRatings[id]?.score || 0), 0) / totalItems

  const reviewTexts = selectedDishIds
    .map((id) => dishRatings[id]?.reviewText)
    .filter(Boolean)

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          Review your submission
        </h2>
        <p className="text-sm text-brown-muted mt-1">
          Double-check everything before posting
        </p>
      </div>

      {/* Restaurant Summary */}
      <div className="bg-cream border border-brown-muted/10 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron/20 to-amber-500/20 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">{restaurant.name}</h3>
              <p className="text-xs text-brown-muted">{restaurant.area}, {restaurant.city}</p>
            </div>
          </div>
          <button onClick={onBack} className="text-xs text-saffron hover:underline font-medium">
            Edit
          </button>
        </div>
      </div>

      {/* Dishes Summary */}
      <div className="bg-cream border border-brown-muted/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Dishes Reviewed ({totalItems})</h3>
          <button onClick={onBack} className="text-xs text-saffron hover:underline font-medium">
            Edit
          </button>
        </div>
        <div className="space-y-2">
          {selectedDishIds.map((id) => {
            const r = dishRatings[id]
            return (
              <div key={id} className="flex items-center justify-between py-1.5 border-b border-brown-muted/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">{getDishName(id)}</p>
                  {r?.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {r.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] bg-cream-dark text-brown-muted px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-saffron shrink-0 ml-2">{r?.score || '?'}/10</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Overall Ratings Summary */}
      <div className="bg-cream border border-brown-muted/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Overall Ratings</h3>
          <button onClick={onBack} className="text-xs text-saffron hover:underline font-medium">
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {[
            { label: 'Food', value: overallRatings.food },
            { label: 'Service', value: overallRatings.service },
            { label: 'Ambience', value: overallRatings.ambience },
            { label: 'Value', value: overallRatings.valueForMoney },
          ].map((item) => (
            <div key={item.label} className="bg-cream-dark rounded-lg p-2">
              <p className="text-[10px] text-brown-muted">{item.label}</p>
              <p className="text-sm font-bold text-saffron">{item.value > 0 ? `${item.value}/10` : '-'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Review Text Snippets */}
      {reviewTexts.length > 0 && (
        <div className="bg-cream border border-brown-muted/10 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">Your Reviews</h3>
          <div className="space-y-1.5">
            {reviewTexts.map((text, i) => (
              <p key={i} className="text-sm text-ink/80 italic border-l-2 border-saffron/30 pl-3">
                &ldquo;{text}&rdquo;
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Bill Upload */}
      <div className="bg-cream border border-brown-muted/10 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-ink mb-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-saffron" />
          Upload your bill for a Verified Visit badge
        </h3>
        <p className="text-xs text-brown-muted mb-3">
          Helps us verify your visit and earns you a Verified badge on your review
        </p>

        {!billPreview ? (
          <label className="cursor-pointer block">
            <div className="border-2 border-dashed border-brown-muted/20 rounded-xl p-6 sm:p-8 text-center hover:border-saffron/30 hover:bg-saffron/5 transition-all">
              <Upload className="w-8 h-8 text-brown-muted/40 mx-auto mb-2" />
              <p className="text-sm text-brown-muted font-medium">Drop your bill here or click to upload</p>
              <p className="text-xs text-brown-muted/50 mt-1">PNG, JPG, PDF (max 5MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleBillUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">Bill uploaded successfully!</p>
                <p className="text-xs text-green-600">{billFile?.name}</p>
              </div>
              <button
                onClick={() => {
                  setBillFile(null)
                  setBillPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="text-xs text-green-700 hover:underline"
              >
                Remove
              </button>
            </div>
            {/* Verified badge preview */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              You&apos;ll get a Verified Visit badge
            </div>
          </div>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => setAgreed(!agreed)}
          className={cn(
            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
            agreed
              ? 'bg-saffron border-saffron'
              : 'border-brown-muted/30 group-hover:border-saffron/50'
          )}
        >
          {agreed && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className="text-sm text-ink/80 leading-relaxed">
          My review is honest and based on my real visit. I understand that fake reviews violate our terms of service.
        </span>
      </label>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-brown-muted hover:text-ink hover:bg-cream-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onSubmit(billFile)}
          disabled={!agreed || submitting}
          className={cn(
            'flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97]',
            agreed && !submitting
              ? 'bg-saffron text-cream hover:bg-saffron-light shadow-sm'
              : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Review
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Success Screen ─────────────────────────────────────────────────────────

function SuccessScreen({
  avgScore,
  totalItems,
  onReviewAnother,
}: {
  avgScore: number
  totalItems: number
  onReviewAnother: () => void
}) {
  const confettiColors = ['#C8702A', '#F5EDD9', '#2E7D32', '#D4A853', '#E08030', '#A08060']
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    color: confettiColors[i % confettiColors.length],
    size: Math.random() > 0.5 ? 'w-2 h-2' : 'w-1.5 h-3',
  }))

  return (
    <div className="relative overflow-hidden min-h-[60vh] flex items-center justify-center px-4">
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={cn(
            'absolute top-0 animate-confetti-fall',
            piece.size
          )}
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            backgroundColor: piece.color,
            borderRadius: '2px',
          }}
        />
      ))}

      <div className="text-center max-w-sm relative z-10">
        {/* Checkmark */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center animate-scale-check">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-2">
          Your review is live!
        </h2>
        <p className="text-sm text-brown-muted mb-2">
          You reviewed {totalItems} dish{totalItems !== 1 ? 'es' : ''}
        </p>

        {/* Score Display */}
        <div className="bg-cream-dark rounded-xl p-4 mb-6 inline-block">
          <p className="text-xs text-brown-muted mb-1">Average dish score</p>
          <div className="text-3xl font-bold text-saffron">{avgScore.toFixed(1)} <span className="text-lg text-brown-muted">/10</span></div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3 mb-6">
          <p className="text-xs font-medium text-brown-muted uppercase tracking-wider">Share your review</p>
          <div className="flex items-center justify-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all active:scale-95">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-medium hover:bg-pink-600 transition-all active:scale-95">
              <Instagram className="w-4 h-4" />
              Instagram
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-all active:scale-95">
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron text-cream rounded-xl text-sm font-bold hover:bg-saffron-light transition-all active:scale-[0.97] shadow-sm">
            <ExternalLink className="w-4 h-4" />
            View your review
          </button>
          <button
            onClick={onReviewAnother}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-saffron/30 text-saffron rounded-xl text-sm font-bold hover:bg-saffron/5 transition-all active:scale-[0.97]"
          >
            <RotateCcw className="w-4 h-4" />
            Review another restaurant
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── TrendingUp Icon for popular section ─────────────────────────────────────

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

// ─── Main Review Page Content ────────────────────────────────────────────────

function ReviewPageContent() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useStore()

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, isAuthenticated, router])

  // Multi-step state
  const [step, setStep] = useState<ReviewStep>(1)
  const [slideDir, setSlideDir] = useState<SlideDir>(null)

  // Step 1: Restaurant
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  // Step 2: Dishes
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [loadingDishes, setLoadingDishes] = useState(false)

  // Fetch dishes when restaurant is selected
  useEffect(() => {
    if (selectedRestaurant) {
      setLoadingDishes(true)
      getDishesByRestaurant(selectedRestaurant.id).then((dishes) => {
        setMenuCategories(groupDishesByCategory(dishes))
        setLoadingDishes(false)
      })
    }
  }, [selectedRestaurant])

  // Step 3: Ratings
  const [dishRatings, setDishRatings] = useState<Record<string, DishRating>>({})
  const [overallRatings, setOverallRatings] = useState<OverallRatings>({
    food: 0,
    service: 0,
    ambience: 0,
    valueForMoney: 0,
  })

  // Step 4: Submit state
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const goToStep = (newStep: ReviewStep) => {
    setSlideDir(newStep > step ? 'right' : 'left')
    setStep(newStep)
  }

  const handleSelectRestaurant = (r: Restaurant) => {
    setSelectedRestaurant(r)
    // Reset dish selections when restaurant changes
    setSelectedDishIds([])
    setMenuCategories([])
    setDishRatings({})
    setOverallRatings({ food: 0, service: 0, ambience: 0, valueForMoney: 0 })
  }

  const handleToggleDish = (id: string) => {
    setSelectedDishIds((prev) => {
      if (prev.includes(id)) {
        // Remove its ratings too
        const newRatings = { ...dishRatings }
        delete newRatings[id]
        setDishRatings(newRatings)
        return prev.filter((d) => d !== id)
      }
      return [...prev, id]
    })
  }

  const handleUpdateDishRating = (id: string, data: Partial<DishRating>) => {
    setDishRatings((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...data } as DishRating,
    }))
  }

  const handleUpdateOverall = (data: Partial<OverallRatings>) => {
    setOverallRatings((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async (billFile: File | null) => {
    if (!selectedRestaurant || !user) return
    setSubmitting(true)

    try {
      // Submit all dish ratings in parallel
      const reviewPromises = selectedDishIds
        .filter((dishId) => !dishId.startsWith('custom::'))
        .map((dishId) => {
          const rating = dishRatings[dishId]
          if (rating && rating.score > 0) {
            return submitReview({
              restaurant_id: selectedRestaurant.id,
              dish_id: dishId,
              rating: rating.score,
              text: rating.reviewText || undefined,
              tags: rating.tags,
            })
          }
          return Promise.resolve(null)
        })
        .filter(Boolean)

      await Promise.all(reviewPromises)

      // Also submit overall ratings as a separate review
      if (overallRatings.food > 0 && selectedDishIds.length > 0) {
        const firstDishId = selectedDishIds[0]
        if (!firstDishId.startsWith('custom::')) {
          await submitReview({
            restaurant_id: selectedRestaurant.id,
            dish_id: firstDishId,
            rating: Math.round((overallRatings.food + overallRatings.service + overallRatings.ambience + overallRatings.valueForMoney) / 4),
            text: `Overall: Food ${overallRatings.food}/10, Service ${overallRatings.service}/10, Ambience ${overallRatings.ambience}/10, Value ${overallRatings.valueForMoney}/10`,
            tags: ['Overall'],
          })
        }
      }

      setIsSuccess(true)
    } catch (err) {
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate average score for success screen
  const avgScore =
    selectedDishIds.length > 0
      ? selectedDishIds.reduce((sum, id) => sum + (dishRatings[id]?.score || 0), 0) /
        selectedDishIds.length
      : 0

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-saffron animate-spin" />
      </div>
    )
  }

  // Don't render form if not authenticated (redirecting)
  if (!isAuthenticated) {
    return null
  }

  if (isSuccess && selectedRestaurant) {
    return (
      <div className="min-h-screen bg-[#FBF6EE] py-8">
        <div className="max-w-lg mx-auto">
          <SuccessScreen
            avgScore={avgScore}
            totalItems={selectedDishIds.length}
            onReviewAnother={() => {
              setIsSuccess(false)
              setStep(1)
              setSelectedRestaurant(null)
              setSelectedDishIds([])
              setMenuCategories([])
              setDishRatings({})
              setOverallRatings({ food: 0, service: 0, ambience: 0, valueForMoney: 0 })
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back Button */}
        {step === 1 && (
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-sm text-brown-muted hover:text-saffron mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        )}

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-ink mb-1">Write a Review</h1>
        <p className="text-sm text-brown-muted mb-6">Share your dining experience</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>

        {/* Step Content */}
        <div
          key={step}
          className={cn(
            slideDir === 'right' && 'animate-slide-in-right',
            slideDir === 'left' && 'animate-slide-in-left'
          )}
        >
          {step === 1 && (
            <Step1FindRestaurant
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={handleSelectRestaurant}
              onNext={() => selectedRestaurant && goToStep(2)}
            />
          )}

          {step === 2 && selectedRestaurant && (
            <Step2SelectDishes
              restaurantId={selectedRestaurant.id}
              selectedDishes={selectedDishIds}
              onToggleDish={handleToggleDish}
              categories={menuCategories}
              loadingDishes={loadingDishes}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {step === 3 && selectedRestaurant && (
            <Step3RateDishes
              selectedDishIds={selectedDishIds}
              dishRatings={dishRatings}
              onUpdateDishRating={handleUpdateDishRating}
              overallRatings={overallRatings}
              onUpdateOverall={handleUpdateOverall}
              categories={menuCategories}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {step === 4 && selectedRestaurant && (
            <Step4Submit
              restaurant={selectedRestaurant}
              selectedDishIds={selectedDishIds}
              dishRatings={dishRatings}
              overallRatings={overallRatings}
              categories={menuCategories}
              onBack={() => goToStep(3)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function NewReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-lg px-4">
            <div className="h-8 bg-[#F5EDD9] rounded-lg w-48" />
            <div className="h-6 bg-[#F5EDD9] rounded-lg w-64" />
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#F5EDD9] rounded-full" />
                  <div className="h-3 w-20 bg-[#F5EDD9] rounded" />
                </div>
              ))}
            </div>
            <div className="h-12 bg-[#F5EDD9] rounded-xl" />
            <div className="h-64 bg-[#F5EDD9] rounded-xl" />
          </div>
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  )
}
