'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCities, getTopDishes, getPlatformStats } from '@/lib/queries'
import type { City, Dish } from '@/types'

export default function HomePage() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [topDishes, setTopDishes] = useState<Dish[]>([])
  const [stats, setStats] = useState({ dishes: 0, restaurants: 0, cities: 0 })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [citiesData, dishesData, statsData] = await Promise.all([
          getCities(),
          getTopDishes(8),
          getPlatformStats(),
        ])
        setCities(citiesData || [])
        setTopDishes(dishesData || [])
        setStats(statsData)
      } catch (err) {
        console.error('Error loading homepage data:', err)
      }
    }
    loadData()
  }, [])

  const formatCount = (n: number) => {
    if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return String(n)
  }

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      
      {/* HERO */}
      <section className="min-h-screen flex items-center px-14 py-32">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FDF0E4] border border-[#C8702A]/25 text-[#C8702A] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-[#C8702A] rounded-full"></span>
              India&apos;s dish-first review platform
            </div>
            <h1 className="font-serif text-7xl font-light leading-none tracking-tight text-[#1E1208] mb-6">
              Find India&apos;s<br/>
              <em className="font-serif italic text-[#C8702A]">Best Dishes,</em><br/>
              Not Just Restaurants
            </h1>
            <p className="text-[#A08060] text-lg font-light leading-relaxed max-w-md mb-10">
              Search any dish. Get ranked results by that specific dish — not the overall restaurant. {stats.dishes.toLocaleString()} reviews across {stats.cities} Indian cities.
            </p>
            <div className="flex items-center bg-white border-2 border-[rgba(107,66,38,0.2)] rounded-lg overflow-hidden max-w-lg shadow-lg focus-within:border-[#C8702A]">
              <span className="px-4 text-[#A08060] text-lg">🔍</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
                className="flex-1 py-4 px-2 bg-transparent outline-none text-[#1E1208] placeholder-[#C4A882]"
              />
              <button 
                onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                className="bg-[#C8702A] text-white px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-[#E08030] transition-colors"
              >
                Search →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['🍛 Biryani','🥘 Butter Chicken','🫓 Masala Dosa','🍢 Vada Pav','🫕 Chole Bhature'].map(chip => {
                const searchTerm = chip.replace(/^[^\s]*\s/, '')
                return (
                  <span 
                    key={chip} 
                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchTerm)}`)}
                    className="text-xs text-[#9A6240] bg-[#F0E6CE] border border-[rgba(107,66,38,0.15)] px-3 py-2 rounded-full cursor-pointer hover:border-[#C8702A] hover:text-[#C8702A] transition-all"
                  >
                    {chip}
                  </span>
                )
              })}
            </div>
          </div>
          <div className="relative h-[500px]">
            {[
              { name: 'Hyderabadi Dum Biryani', rest: 'Paradise Restaurant', score: '9.4', emoji: '🍛', top: '40px', left: '20px' },
              { name: 'Masala Dosa', rest: 'MTR · Bengaluru', score: '9.6', emoji: '🫓', bottom: '80px', right: '0px' },
              { name: 'Vada Pav', rest: "Ashok's · Mumbai", score: '9.1', emoji: '🍢', top: '0px', right: '30px' },
            ].map((dish) => (
              <div key={dish.name} style={{ position: 'absolute', top: dish.top, left: dish.left, right: dish.right, bottom: dish.bottom }} className="bg-white border border-[rgba(107,66,38,0.15)] rounded-xl shadow-xl p-4 w-52">
                <div className="text-4xl mb-3">{dish.emoji}</div>
                <div className="text-sm font-bold text-[#1E1208] mb-1">{dish.name}</div>
                <div className="text-xs text-[#A08060] mb-2">{dish.rest}</div>
                <div className="inline-flex items-center gap-1 bg-[#C8702A] text-white text-xs font-bold px-2 py-1 rounded">
                  ★ {dish.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-t border-b border-[rgba(107,66,38,0.12)] bg-[#F0E6CE] py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-0 flex-shrink-0">
              {['4.2 Lakh Dishes Reviewed','47 Indian Cities','18,000+ Restaurants','Dish-Level Search \u2014 Only on DishCritic','2.1 Lakh Verified Reviewers'].map(item => (
                <span key={item} className="inline-flex items-center gap-3 px-8 text-xs font-bold tracking-widest uppercase text-[#A08060]">
                  <span className="w-1 h-1 bg-[#C8702A] rounded-full flex-shrink-0"></span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 border-t border-b border-[rgba(107,66,38,0.12)]">
        {[
          { num: formatCount(stats.dishes), label: 'Dishes Reviewed' },
          { num: formatCount(stats.cities), label: 'Indian Cities' },
          { num: formatCount(stats.restaurants), label: 'Restaurants' },
          { num: formatCount(stats.dishes), label: 'Verified Reviewers' },
        ].map((s, i) => (
          <div key={s.label} className={`p-12 ${i < 3 ? 'border-r border-[rgba(107,66,38,0.12)]' : ''} hover:bg-[#F5EDD9] transition-colors`}>
            <div className="font-serif text-5xl font-bold text-[#1E1208] mb-2">{s.num}</div>
            <div className="text-xs font-bold tracking-widest uppercase text-[#A08060]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* LEADERBOARD */}
      <section className="bg-[#F5EDD9] px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-[#C8702A] mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[#C8702A]"></span>
            This week · Hyderabad
          </div>
          <h2 className="font-serif text-5xl font-light text-[#1E1208] mb-12">
            Best <em className="text-[#C8702A]">Biryani</em> in the City
          </h2>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 bg-white rounded-xl border border-[rgba(107,66,38,0.12)] overflow-hidden">
              {[
                { rank: '01', name: 'Hyderabadi Dum Biryani', rest: 'Paradise Restaurant · Secunderabad', score: '9.4', reviews: '3,241' },
                { rank: '02', name: 'Mutton Dum Biryani', rest: 'Shah Ghouse Café · Old City', score: '9.2', reviews: '2,108' },
                { rank: '03', name: 'Chicken Dum Biryani', rest: 'Bawarchi · RTC Cross Roads', score: '9.0', reviews: '1,876' },
                { rank: '04', name: 'Kacchi Gosht Biryani', rest: 'Café Bahar · Basheerbagh', score: '8.9', reviews: '1,543' },
                { rank: '05', name: 'Veg Dum Biryani', rest: 'Honest Restaurant · Jubilee Hills', score: '8.7', reviews: '980' },
              ].map((item, i) => (
                <div key={item.rank} className={`grid grid-cols-[64px_80px_1fr_auto] items-center p-5 hover:bg-[#FDF0E4] cursor-pointer transition-colors ${i < 4 ? 'border-b border-[rgba(107,66,38,0.08)]' : ''}`}>
                  <span className="font-serif text-4xl font-bold text-[rgba(107,66,38,0.15)]">{item.rank}</span>
                  <span className="text-4xl text-center">🍛</span>
                  <div className="px-4">
                    <div className="font-serif text-lg font-semibold text-[#1E1208]">{item.name}</div>
                    <div className="text-xs text-[#A08060]">{item.rest}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl font-bold text-[#C8702A]">{item.score}</div>
                    <div className="text-xs text-[#A08060]">{item.reviews} reviews</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#1E1208] rounded-xl overflow-hidden">
              <div className="h-44 flex items-center justify-center text-8xl bg-gradient-to-br from-[#3D2008] to-[#6B3010]">🍛</div>
              <div className="p-6">
                <div className="text-xs font-bold tracking-widest uppercase text-[#C8702A] mb-2">🏆 Best Biryani · Hyderabad</div>
                <div className="font-serif text-2xl font-bold text-white mb-1">Hyderabadi Dum Biryani</div>
                <div className="text-sm text-white/40 mb-6">Paradise Restaurant · Secunderabad</div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[['9.4/10','Dish score'],['3.2K','Reviews'],['₹450','Per portion'],['4 yrs','In top 3']].map(([n,l]) => (
                    <div key={l} className="bg-white/5 rounded-lg p-3">
                      <div className="font-serif text-xl font-bold text-[#C8702A]">{n}</div>
                      <div className="text-xs text-white/30">{l}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-[#C8702A] text-white py-3 rounded-lg text-sm font-bold tracking-wider uppercase hover:bg-[#E08030] transition-colors">
                  View Full Dish Page →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-[#C8702A] mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[#C8702A]"></span>
            Blowing up right now
          </div>
          <h2 className="font-serif text-5xl font-light text-[#1E1208] mb-12">
            Trending Dishes <em className="text-[#C8702A]">This Week</em>
          </h2>
          <div className="grid grid-cols-4 gap-5">
            {topDishes.slice(0, 4).map((dish, idx) => {
              const gradients = [
                'linear-gradient(135deg, #EDE0C4, #D4B878)',
                'linear-gradient(135deg, #F0D9C0, #C8906A)',
                'linear-gradient(135deg, #E8D5B0, #B89050)',
                'linear-gradient(135deg, #F5E8D0, #D4A060)',
              ]
              const badges = ['🔥 Viral', '📈 Rising', '🥇 Top Rated', '⭐ New Entry']
              const restName = (dish as any).restaurants?.name || 'Restaurant'
              const restCity = (dish as any).restaurants?.cities?.name || ''
              const tags = [dish.is_veg ? 'Veg' : 'Non-Veg']
              return (
                <div key={dish.id} className="group relative bg-white border border-[rgba(107,66,38,0.12)] rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer" onClick={() => router.push(`/dish/${dish.id}`)}>
                  <div className="w-full h-44 flex items-center justify-center text-6xl relative overflow-hidden" style={{background: gradients[idx % gradients.length]}}>
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.is_veg ? '🥗' : '🍛'}</span>
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8702A] text-white">{badges[idx % badges.length]}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1E1208] group-hover:text-[#C8702A] transition-colors">{dish.name}</h3>
                      <p className="text-xs text-[#A08060] mt-0.5">{restName}{restCity ? ` · ${restCity}` : ''}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          tag === 'Veg' ? 'bg-green-100 text-green-700' :
                          tag === 'Non-Veg' ? 'bg-red-100 text-red-700' :
                          'bg-[#F5EDD9] text-[#9A6240]'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(107,66,38,0.08)]">
                      <div className="flex items-center gap-1">
                        <span className="text-[#C8702A] font-bold font-sans text-base">{dish.score.toFixed(1)}</span>
                        <span className="text-xs text-[#A08060]">/10</span>
                      </div>
                      <span className="text-xs text-[#A08060]">★ {dish.review_count >= 1000 ? (dish.review_count / 1000).toFixed(1) + 'K' : dish.review_count} reviews</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-[#C8702A] mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[#C8702A]"></span>
            Simple process
          </div>
          <h2 className="font-serif text-5xl font-light text-[#1E1208] mb-12">
            How It <em className="text-[#C8702A]">Works</em>
          </h2>
          <div className="grid grid-cols-3 gap-px bg-[rgba(107,66,38,0.08)] rounded-2xl overflow-hidden border border-[rgba(107,66,38,0.08)]">
            {[
              { number: '01', emoji: '🔍', title: 'Search any dish', desc: 'Type the dish you\'re craving — get it ranked across every restaurant in your city.' },
              { number: '02', emoji: '⭐', title: 'Read dish-level reviews', desc: 'Every review is for a specific dish, not just the restaurant. Compare scores from real visitors.' },
              { number: '03', emoji: '✍️', title: 'Share your review', desc: 'Rate each dish, upload a photo. Done in 60 seconds. Help thousands find their next great meal.' },
            ].map((step) => (
              <div key={step.number} className="relative bg-white p-10 hover:bg-[#FBF6EE] transition-colors duration-500 group">
                <div className="absolute top-0 left-0 font-serif text-8xl font-bold text-[#F0E6CE] leading-none select-none pointer-events-none">{step.number}</div>
                <div className="text-4xl mb-5 relative z-10">{step.emoji}</div>
                <h3 className="font-serif text-xl font-bold text-[#1E1208] mb-3 relative z-10">{step.title}</h3>
                <p className="text-sm text-[#A08060] leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-[#F0E6CE] px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold tracking-widest uppercase text-[#C8702A] mb-4 flex items-center gap-2">
            <span className="w-6 h-px bg-[#C8702A]"></span>
            Community voices
          </div>
          <h2 className="font-serif text-5xl font-light text-[#1E1208] mb-12">
            What Foodies <em className="text-[#C8702A]">Are Saying</em>
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: 'Arjun Mehta', title: 'Biryani Expert', initials: 'AM',
                quote: 'The rice is perfectly cooked — each grain separate, every one soaked in saffron. No biryani in this city even comes close.',
                dish: 'Hyderabadi Dum Biryani', stars: 5,
              },
              {
                name: 'Priya Nair', title: 'South Indian Expert', initials: 'PN',
                quote: 'MTR\'s batter has that perfect overnight fermented sourness you simply cannot replicate at home. A benchmark for all dosas.',
                dish: 'Masala Dosa · MTR', stars: 5,
              },
              {
                name: 'Rahul Singh', title: 'Street Food Fanatic', initials: 'RS',
                quote: 'I\'ve had this 40+ times and it never changes. The dry chutney ratio is perfect. That consistency is the mark of a true legend.',
                dish: 'Vada Pav · Ashok\'s', stars: 5,
              },
            ].map((review) => (
              <div key={review.name} className="group relative bg-white rounded-2xl border border-[rgba(107,66,38,0.12)] p-8 hover:shadow-lg transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C8702A] to-[#E08030] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="font-serif text-6xl font-bold text-[#F0E6CE] leading-none block mb-2">&ldquo;</span>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0E6CE] text-[#9A6240] mb-4">{review.dish}</span>
                <p className="font-serif italic text-base text-[#1E1208] leading-relaxed mb-6">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[rgba(107,66,38,0.08)]">
                  <div className="w-10 h-10 rounded-full bg-[#C8702A]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#C8702A]">{review.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E1208] truncate">{review.name}</p>
                    <p className="text-xs text-[#A08060]">{review.title}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.stars ? 'text-[#C8702A]' : 'text-[rgba(107,66,38,0.15)]'}`}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section className="bg-[#F0E6CE] px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-5xl font-light text-[#1E1208] mb-12">
            Pick Your <em className="text-[#C8702A]">City</em>
          </h2>
          <div className="grid grid-cols-6 gap-3">
            {cities.slice(0, 6).map(city => (
              <a key={city.name} href={`/cities/${city.name.toLowerCase()}`} className="bg-white border border-[rgba(107,66,38,0.12)] rounded-xl p-6 text-center hover:border-[#C8702A] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-3xl mb-2">{city.emoji || '🏙️'}</div>
                <div className="text-xs font-bold tracking-wider uppercase text-[#1E1208] mb-0.5">{city.name}</div>
                <div className="text-xs text-[#A08060] mb-1">restaurants</div>
                <div className="font-serif text-3xl font-bold text-[#C8702A]">{city.restaurant_count || 0}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E1208] px-14 py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-6xl font-light text-white mb-6 leading-tight">
            Start Reviewing Your<br/>
            Favourite <em className="text-[#C8702A]">Dishes Today</em>
          </h2>
          <p className="text-white/40 text-lg font-light mb-12">Free to join. Free forever.</p>
          <div className="flex gap-4 justify-center">
            <a href="/auth" className="bg-[#C8702A] text-white px-10 py-4 rounded-lg font-bold tracking-wider uppercase text-sm hover:bg-[#E08030] transition-colors">
              Create Free Account →
            </a>
            <a href="/search" className="border border-white/20 text-white/60 px-10 py-4 rounded-lg font-semibold tracking-wider uppercase text-sm hover:border-white/40 hover:text-white transition-colors">
              Browse as Guest
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
