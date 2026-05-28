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
                <div className="text-xs text-[#A08060]">{city.count}</div>
                <div className="text-xs text-[#C8702A] font-bold mt-2">{city.count}</div>
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
