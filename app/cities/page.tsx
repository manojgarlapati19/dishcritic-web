'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ───────────── Data ───────────── */

const ACTIVE_CITIES = [
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', emoji: '🕌', restaurantCount: 1240, topDish: 'Hyderabadi Dum Biryani' },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', emoji: '🌆', restaurantCount: 3200, topDish: 'Vada Pav' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', emoji: '🌿', restaurantCount: 2500, topDish: 'Masala Dosa' },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', emoji: '🏛️', restaurantCount: 2800, topDish: 'Butter Chicken' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', emoji: '🐟', restaurantCount: 1800, topDish: 'Filter Coffee' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', emoji: '🎨', restaurantCount: 1500, topDish: 'Kathi Roll' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', emoji: '🏗️', restaurantCount: 1100, topDish: 'Pav Bhaji' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', emoji: '🏛️', restaurantCount: 900, topDish: 'Dhokla' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', emoji: '🏯', restaurantCount: 750, topDish: 'Dal Baati Churma' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', emoji: '⛵', restaurantCount: 600, topDish: 'Meen Curry' },
]

const COMING_SOON_CITIES = [
  { emoji: '🏛️', name: 'Chandigarh', state: 'Punjab/Haryana' },
  { emoji: '🏭', name: 'Surat', state: 'Gujarat' },
  { emoji: '🍢', name: 'Lucknow', state: 'Uttar Pradesh' },
  { emoji: '🌄', name: 'Indore', state: 'Madhya Pradesh' },
  { emoji: '🌸', name: 'Bhopal', state: 'Madhya Pradesh' },
]

/* ───────────── Component ───────────── */

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCities = ACTIVE_CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-gradient-radial from-saffron/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide">
            <MapPin className="w-3.5 h-3.5" />
            {ACTIVE_CITIES.length} Cities · Growing
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-4">
            Explore Food Across India
          </h1>
          <p className="text-brown-muted text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Dish-level reviews in 10 cities and growing. Find the best dishes in every corner of the country.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all"
            />
          </div>
        </div>
      </section>

      {/* ═══════ CITIES GRID ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {searchQuery && filteredCities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-dark border border-brown-muted/10 flex items-center justify-center">
              <Search className="w-6 h-6 text-brown-muted/50" />
            </div>
            <h3 className="font-serif text-xl font-bold text-ink mb-1">No cities found</h3>
            <p className="text-sm text-brown-muted">Try a different search term</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <Link
                key={city.id}
                href={`/cities/${city.id}`}
                className="group relative rounded-2xl bg-cream border border-brown-muted/10 overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-saffron/30 transition-all duration-500"
              >
                {/* Top Gradient */}
                <div className="h-36 bg-gradient-to-br from-saffron/15 via-cream-darker to-cream-dark flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{city.emoji}</span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ink group-hover:text-saffron transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-xs text-brown-muted mt-0.5">{city.state}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-brown-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{city.restaurantCount.toLocaleString()} restaurants</span>
                  </div>

                  <div className="pt-2 border-t border-brown-muted/10">
                    <p className="text-[11px] text-brown-muted uppercase tracking-wider mb-0.5">Top Rated Dish</p>
                    <p className="text-sm font-medium text-ink">{city.topDish}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brown-muted/10">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron group-hover/btn:gap-2 transition-all">
                      Explore City
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ COMING SOON ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Expanding Soon</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Coming Soon</h2>
            <p className="text-brown-muted text-sm mt-2">We&apos;re bringing dish-level reviews to more cities</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {COMING_SOON_CITIES.map((city) => (
              <div
                key={city.name}
                className="group text-center p-6 rounded-xl bg-cream/60 border border-brown-muted/10 opacity-60 cursor-not-allowed hover:opacity-80 transition-opacity"
              >
                <span className="text-3xl block mb-3 grayscale">{city.emoji}</span>
                <h3 className="font-serif text-lg font-semibold text-ink">{city.name}</h3>
                <p className="text-xs text-brown-muted mt-0.5">{city.state}</p>
                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brown-muted/10 text-brown-muted text-[10px] font-medium">
                  <Clock className="w-3 h-3" />
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
          Don&apos;t See Your City?
        </h2>
        <p className="text-brown-muted text-sm mb-8 max-w-md mx-auto">
          We&apos;re expanding fast. Drop us a note and we&apos;ll prioritize your city.
        </p>
        <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20">
          Suggest a City
          <ArrowRight className="w-4 h-4" />
        </Button>
      </section>
    </div>
  )
}
