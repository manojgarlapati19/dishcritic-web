'use client'

export default function HomePage() {
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
              <em className="text-[#C8702A]">Best Dishes,</em><br/>
              Not Just Restaurants
            </h1>
            <p className="text-[#A08060] text-lg font-light leading-relaxed max-w-md mb-10">
              Search any dish. Get ranked results by that specific dish — not the overall restaurant. 4.2 lakh reviews across 47 Indian cities.
            </p>
            <div className="flex items-center bg-white border-2 border-[rgba(107,66,38,0.2)] rounded-lg overflow-hidden max-w-lg shadow-lg focus-within:border-[#C8702A]">
              <span className="px-4 text-[#A08060] text-lg">🔍</span>
              <input 
                type="text"
                placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
                className="flex-1 py-4 px-2 bg-transparent outline-none text-[#1E1208] placeholder-[#C4A882]"
              />
              <button className="bg-[#C8702A] text-white px-8 py-4 font-bold text-sm tracking-wider uppercase hover:bg-[#E08030] transition-colors">
                Search →
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['🍛 Biryani','🥘 Butter Chicken','🫓 Masala Dosa','🍢 Vada Pav','🫕 Chole Bhature'].map(chip => (
                <span key={chip} className="text-xs text-[#9A6240] bg-[#F0E6CE] border border-[rgba(107,66,38,0.15)] px-3 py-2 rounded-full cursor-pointer hover:border-[#C8702A] hover:text-[#C8702A] transition-all">
                  {chip}
                </span>
              ))}
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

      {/* STATS */}
      <div className="grid grid-cols-4 border-t border-b border-[rgba(107,66,38,0.12)]">
        {[
          { num: '4.2L', label: 'Dishes Reviewed' },
          { num: '47+', label: 'Indian Cities' },
          { num: '18K', label: 'Restaurants' },
          { num: '2.1L', label: 'Verified Reviewers' },
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
            {[
              { emoji: '🫓', name: 'Masala Dosa', rest: 'MTR · Bengaluru', score: '9.6', badge: '🔥 Viral', tags: ['Veg','South Indian'] },
              { emoji: '🥘', name: 'Dal Makhani', rest: 'Bukhara · Delhi', score: '9.3', badge: '📈 Rising', tags: ['Veg','North Indian'] },
              { emoji: '🥣', name: 'Misal Pav', rest: 'Mamledar · Thane', score: '9.4', badge: '🔥 Viral', tags: ['Veg','Spicy'] },
              { emoji: '🍢', name: 'Vada Pav', rest: 'Ashok · Mumbai', score: '9.1', badge: '⭐ New Entry', tags: ['Veg','Street Food'] },
            ].map((dish) => (
              <div key={dish.name} className="group relative bg-white border border-[rgba(107,66,38,0.12)] rounded-xl overflow-hidden hover:-translate-y-2 hover:shadow-xl transition-all duration-500 cursor-pointer">
                <div className="h-36 bg-gradient-to-br from-[#C8702A]/20 via-[#F5EDD9] to-[#F0E6CE] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#C8702A]/5"></div>
                  <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-[#C8702A]/8"></div>
                  <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-500">{dish.emoji}</span>
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C8702A] text-white">{dish.badge}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1E1208] group-hover:text-[#C8702A] transition-colors">{dish.name}</h3>
                    <p className="text-xs text-[#A08060] mt-0.5">{dish.rest}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {dish.tags.map((tag) => (
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
                      <span className="text-[#C8702A] font-bold font-sans text-base">{dish.score}</span>
                      <span className="text-xs text-[#A08060]">/10</span>
                    </div>
                    <span className="text-xs text-[#A08060]">★ 4.8K reviews</span>
                  </div>
                </div>
              </div>
            ))}
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
                <span className="absolute top-4 right-6 font-serif text-7xl font-bold text-[rgba(107,66,38,0.04)] select-none pointer-events-none">{step.number}</span>
                <div className="text-4xl mb-5">{step.emoji}</div>
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
              <div key={review.name} className="group relative bg-white rounded-2xl border border-[rgba(107,66,38,0.12)] p-8 hover:shadow-lg transition-all duration-500">
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-[#C8702A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
                <div className="font-serif text-6xl text-[#C8702A]/20 leading-none mb-2">&ldquo;</div>
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
            {[
              { emoji: '🕌', name: 'Hyderabad', count: '2,810' },
              { emoji: '🌆', name: 'Mumbai', count: '3,240' },
              { emoji: '🌿', name: 'Bengaluru', count: '2,640' },
              { emoji: '🏛️', name: 'Delhi', count: '4,100' },
              { emoji: '🐟', name: 'Chennai', count: '1,980' },
              { emoji: '🎨', name: 'Kolkata', count: '1,720' },
            ].map(city => (
              <a key={city.name} href={`/cities/${city.name.toLowerCase()}`} className="bg-white border border-[rgba(107,66,38,0.12)] rounded-xl p-6 text-center hover:border-[#C8702A] hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <div className="text-3xl mb-3">{city.emoji}</div>
                <div className="text-xs font-bold tracking-wider uppercase text-[#1E1208] mb-1">{city.name}</div>
                <div className="text-xs text-[#A08060]">{city.count} restaurants</div>
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
