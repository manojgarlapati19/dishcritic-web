'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen" style={{backgroundColor: '#FBF6EE'}}>
      
      {/* HERO */}
      <section style={{minHeight: '100vh', padding: '140px 56px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center'}}>
        <div>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FDF0E4', border: '1px solid rgba(200,112,42,0.25)', color: '#C8702A', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 14px 6px 8px', borderRadius: '999px', marginBottom: '32px'}}>
            <span style={{width: '6px', height: '6px', background: '#C8702A', borderRadius: '50%'}}></span>
            India&apos;s dish-first review platform
          </div>
          
          <h1 style={{fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(52px, 6vw, 88px)', fontWeight: '300', lineHeight: '0.96', letterSpacing: '-1.5px', color: '#1E1208', marginBottom: '28px'}}>
            <strong style={{display: 'block', fontWeight: '600'}}>Find India&apos;s</strong>
            <em style={{display: 'block', fontStyle: 'italic', color: '#C8702A', fontWeight: '400'}}>Best Dishes,</em>
            <span style={{display: 'block'}}>Not Just Restaurants</span>
          </h1>
          
          <p style={{fontSize: '16px', fontWeight: '300', lineHeight: '1.85', color: '#A08060', maxWidth: '420px', marginBottom: '44px'}}>
            Search any dish. Get ranked results by that specific dish — not the overall restaurant. 4.2 lakh reviews across 47 Indian cities.
          </p>
          
          <div style={{display: 'flex', alignItems: 'center', background: 'white', border: '1.5px solid rgba(107,66,38,0.2)', borderRadius: '5px', overflow: 'hidden', maxWidth: '540px', boxShadow: '0 8px 40px rgba(107,66,38,0.1)'}}>
            <span style={{padding: '0 16px', fontSize: '18px', color: '#A08060', flexShrink: 0}}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchQuery && router.push(`/search?q=${searchQuery}`)}
              placeholder='Try "Hyderabadi Biryani", "Masala Dosa"...'
              style={{flex: 1, border: 'none', outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '15px', fontWeight: '400', color: '#1E1208', padding: '16px 8px', background: 'transparent'}}
            />
            <button
              onClick={() => searchQuery && router.push(`/search?q=${searchQuery}`)}
              style={{background: '#C8702A', border: 'none', cursor: 'pointer', padding: '0 28px', height: '100%', minHeight: '56px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'white', flexShrink: 0, transition: 'background 0.2s'}}
              onMouseOver={e => e.currentTarget.style.background='#E08030'}
              onMouseOut={e => e.currentTarget.style.background='#C8702A'}
            >
              Search →
            </button>
          </div>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '18px'}}>
            {['🍛 Biryani','🥘 Butter Chicken','🫓 Masala Dosa','🍢 Vada Pav','🫕 Chole Bhature'].map(chip => (
              <button
                key={chip}
                onClick={() => router.push(`/search?q=${chip.split(' ').slice(1).join(' ')}`)}
                style={{fontSize: '12px', fontWeight: '400', color: '#9A6240', background: '#F0E6CE', border: '1px solid rgba(107,66,38,0.15)', padding: '7px 14px', borderRadius: '999px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif'}}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{position: 'relative', height: '580px'}}>
          {[
            {name:'Hyderabadi Dum Biryani',rest:'Paradise Restaurant',score:'9.4',emoji:'🍛',top:'30px',left:'20px',right:'auto',bottom:'auto'},
            {name:'Masala Dosa',rest:'MTR · Bengaluru',score:'9.6',emoji:'🫓',bottom:'60px',right:'0px',top:'auto',left:'auto'},
            {name:'Vada Pav',rest:"Ashok's · Mumbai",score:'9.1',emoji:'🍢',top:'0px',right:'30px',left:'auto',bottom:'auto'},
          ].map(dish => (
            <div key={dish.name} style={{position:'absolute',top:dish.top,left:dish.left,right:dish.right,bottom:dish.bottom,background:'white',border:'1px solid rgba(107,66,38,0.15)',borderRadius:'10px',boxShadow:'0 20px 60px rgba(107,66,38,0.12)',padding:'16px',width:'210px',zIndex:2}}>
              <div style={{fontSize:'40px',marginBottom:'10px'}}>{dish.emoji}</div>
              <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'16px',fontWeight:'700',color:'#1E1208',marginBottom:'4px'}}>{dish.name}</div>
              <div style={{fontSize:'11px',color:'#A08060',marginBottom:'10px'}}>{dish.rest}</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:'4px',background:'#C8702A',color:'white',fontSize:'12px',fontWeight:'700',padding:'4px 10px',borderRadius:'3px'}}>★ {dish.score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{borderTop:'1px solid rgba(107,66,38,0.12)',borderBottom:'1px solid rgba(107,66,38,0.12)',background:'#F0E6CE',padding:'14px 0',overflow:'hidden',whiteSpace:'nowrap'}}>
        <div style={{display:'inline-flex',animation:'marquee 25s linear infinite'}}>
          {[...Array(2)].map((_,i) => (
            <div key={i} style={{display:'inline-flex',alignItems:'center',gap:0,flexShrink:0}}>
              {['4.2 Lakh Dishes Reviewed','47 Indian Cities','18,000+ Restaurants','Dish-Level Search — Only on DishCritic','2.1 Lakh Verified Reviewers'].map(item => (
                <span key={item} style={{display:'inline-flex',alignItems:'center',gap:'12px',padding:'0 32px',fontSize:'12px',fontWeight:'700',letterSpacing:'0.06em',textTransform:'uppercase',color:'#A08060',fontFamily:'Plus Jakarta Sans, sans-serif'}}>
                  <span style={{width:'4px',height:'4px',background:'#C8702A',borderRadius:'50%',flexShrink:0,opacity:0.5}}></span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {num:'4.2L',label:'Dishes Reviewed',desc:'Across all cuisines'},
          {num:'47+',label:'Indian Cities',desc:'From metros to tier-2'},
          {num:'50+',label:'Restaurants',desc:'In Hyderabad alone'},
          {num:'Real',label:'Verified Reviews',desc:'By actual visitors'},
        ].map((s,i) => (
          <div key={s.label} style={{padding:'52px 48px',borderRight: i<3 ? '1px solid rgba(107,66,38,0.12)' : 'none',borderBottom:'1px solid rgba(107,66,38,0.12)',transition:'background 0.2s',cursor:'default'}}
            onMouseOver={e => e.currentTarget.style.background='#F5EDD9'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}
          >
            <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'54px',fontWeight:'700',color:'#1E1208',letterSpacing:'-2px',lineHeight:1,marginBottom:'10px'}}>{s.num}</div>
            <div style={{fontSize:'12px',fontWeight:'700',letterSpacing:'0.06em',textTransform:'uppercase',color:'#A08060',marginBottom:'6px'}}>{s.label}</div>
            <div style={{fontSize:'13px',fontWeight:'300',color:'#C4A882'}}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* LEADERBOARD */}
      <section style={{background:'#F5EDD9',padding:'100px 56px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.14em',textTransform:'uppercase',color:'#C8702A',marginBottom:'18px'}}>
            <span style={{width:'24px',height:'1.5px',background:'#C8702A'}}></span>
            This week · Hyderabad
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'48px'}}>
            <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(34px,4vw,60px)',fontWeight:'300',letterSpacing:'-1px',lineHeight:'1.0',color:'#1E1208'}}>
              Best <em style={{fontStyle:'italic',color:'#C8702A'}}>Biryani</em> in the City
            </h2>
            <Link href="/leaderboards" style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.07em',textTransform:'uppercase',color:'#9A6240',textDecoration:'none',borderBottom:'1px solid rgba(107,66,38,0.2)',paddingBottom:'3px'}}>
              Full leaderboard →
            </Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'20px',alignItems:'start'}}>
            <div style={{background:'white',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'8px',overflow:'hidden'}}>
              {[
                {rank:'01',name:'Hyderabadi Dum Biryani',rest:'Paradise Restaurant · Secunderabad',score:'9.4',reviews:'3,241'},
                {rank:'02',name:'Mutton Dum Biryani',rest:'Shah Ghouse Cafe · Old City',score:'9.2',reviews:'2,108'},
                {rank:'03',name:'Chicken Dum Biryani',rest:'Bawarchi · RTC Cross Roads',score:'9.0',reviews:'1,876'},
                {rank:'04',name:'Kacchi Gosht Biryani',rest:'Cafe Bahar · Basheerbagh',score:'8.9',reviews:'1,543'},
                {rank:'05',name:'Veg Dum Biryani',rest:'Chutneys · Banjara Hills',score:'8.7',reviews:'980'},
              ].map((item,i) => (
                <div key={item.rank} style={{display:'grid',gridTemplateColumns:'64px 72px 1fr auto',alignItems:'center',padding:'18px 24px 18px 0',borderBottom: i<4 ? '1px solid rgba(107,66,38,0.08)' : 'none',cursor:'pointer',transition:'background 0.2s'}}
                  onMouseOver={e => e.currentTarget.style.background='#FDF0E4'}
                  onMouseOut={e => e.currentTarget.style.background='transparent'}
                >
                  <span style={{textAlign:'center',fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'13px',fontWeight:'600',color:'rgba(107,66,38,0.4)',letterSpacing:'0.04em'}}>{item.rank}</span>
                  <span style={{fontSize:'36px',textAlign:'center'}}>🍛</span>
                  <div style={{padding:'0 16px'}}>
                    <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'19px',fontWeight:'600',color:'#1E1208',letterSpacing:'-0.2px',marginBottom:'3px'}}>{item.name}</div>
                    <div style={{fontSize:'12px',color:'#A08060'}}>{item.rest}</div>
                  </div>
                  <div style={{textAlign:'right',paddingRight:'4px'}}>
                    <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'28px',fontWeight:'700',color:'#C8702A',letterSpacing:'-0.5px'}}>{item.score}</div>
                    <div style={{fontSize:'11px',color:'#C4A882',marginTop:'1px'}}>{item.reviews} reviews</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:'#1E1208',borderRadius:'8px',overflow:'hidden',position:'sticky',top:'96px'}}>
              <div style={{width:'100%',height:'240px',background:'linear-gradient(140deg, #5A2408, #C05018, #7A3010)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'86px',position:'relative'}}>
                <span style={{position:'absolute',top:'16px',left:'16px',background:'#C8702A',color:'white',fontSize:'10px',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',padding:'5px 12px',borderRadius:'2px',zIndex:2}}>🏆 #1 This Week</span>
                🍛
              </div>
              <div style={{padding:'24px 28px'}}>
                <div style={{fontSize:'11px',fontWeight:'600',letterSpacing:'0.08em',textTransform:'uppercase',color:'#C8702A',marginBottom:'8px'}}>Best Biryani · Hyderabad</div>
                <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'26px',fontWeight:'700',color:'white',letterSpacing:'-0.3px',marginBottom:'6px'}}>Hyderabadi Dum Biryani</div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',marginBottom:'22px'}}>Paradise Restaurant · Secunderabad</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'18px'}}>
                  {[['9.4/10','Dish score'],['3.2K','Reviews'],['₹450','Per portion'],['4 yrs','In top 3']].map(([n,l]) => (
                    <div key={l} style={{background:'rgba(255,255,255,0.05)',borderRadius:'5px',padding:'12px 14px'}}>
                      <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'22px',fontWeight:'700',color:'#C8702A',display:'block'}}>{n}</div>
                      <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',marginTop:'2px'}}>{l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/dish/hyderabadi-dum-biryani')} style={{display:'block',width:'100%',padding:'13px',background:'#C8702A',color:'white',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',fontSize:'12px',fontWeight:'700',letterSpacing:'0.08em',textTransform:'uppercase',transition:'background 0.2s'}}
                  onMouseOver={e => e.currentTarget.style.background='#E08030'}
                  onMouseOut={e => e.currentTarget.style.background='#C8702A'}
                >
                  View Full Dish Page →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section style={{padding:'100px 56px',background:'#FBF6EE'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.14em',textTransform:'uppercase',color:'#C8702A',marginBottom:'18px'}}>
            <span style={{width:'24px',height:'1.5px',background:'#C8702A'}}></span>
            Blowing up right now
          </div>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'48px'}}>
            <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(34px,4vw,60px)',fontWeight:'300',letterSpacing:'-1px',color:'#1E1208'}}>
              Trending <em style={{fontStyle:'italic',color:'#C8702A'}}>Dishes</em> This Week
            </h2>
            <Link href="/leaderboards" style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.07em',textTransform:'uppercase',color:'#9A6240',textDecoration:'none',borderBottom:'1px solid rgba(107,66,38,0.2)',paddingBottom:'3px'}}>See all →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
            {[
              {name:'Masala Dosa',city:'MTR · Bengaluru',score:'9.6',emoji:'🫓',badge:'🔥 Viral',bg:'linear-gradient(140deg,#EDE0C4,#D4B878)',tags:['Veg','South Indian','Breakfast']},
              {name:'Dal Makhani',city:'Bukhara · Delhi',score:'9.3',emoji:'🥘',badge:'📈 Rising',bg:'linear-gradient(140deg,#F0D9C0,#C8906A)',tags:['Veg','North Indian','Dinner']},
              {name:'Irani Chai',city:'Nimrah Cafe · Hyderabad',score:'9.5',emoji:'☕',badge:'🔥 Viral',bg:'linear-gradient(140deg,#E8D5B0,#B89050)',tags:['Veg','Beverages','Breakfast']},
              {name:'Papdi Chaat',city:'Gokul Chat · Hyderabad',score:'9.3',emoji:'🍢',badge:'⭐ New',bg:'linear-gradient(140deg,#F5E8D0,#D4A060)',tags:['Veg','Street Food','Snack']},
            ].map(dish => (
              <div key={dish.name} style={{background:'white',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'8px',overflow:'hidden',cursor:'pointer',transition:'all 0.3s'}}
                onMouseOver={e => {e.currentTarget.style.transform='translateY(-7px)';e.currentTarget.style.boxShadow='0 28px 70px rgba(107,66,38,0.13)'}}
                onMouseOut={e => {e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
              >
                <div style={{width:'100%',height:'188px',background:dish.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px',position:'relative'}}>
                  <span style={{position:'absolute',top:'12px',left:'12px',fontSize:'10px',fontWeight:'700',letterSpacing:'0.05em',textTransform:'uppercase',padding:'4px 10px',borderRadius:'999px',background:'rgba(192,57,43,0.9)',color:'white',zIndex:1}}>{dish.badge}</span>
                  {dish.emoji}
                </div>
                <div style={{padding:'16px 18px 20px'}}>
                  <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'18px',fontWeight:'600',color:'#1E1208',letterSpacing:'-0.2px',marginBottom:'3px'}}>{dish.name}</div>
                  <div style={{fontSize:'11px',color:'#A08060',marginBottom:'12px'}}>{dish.city}</div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'}}>
                    {dish.tags.map(tag => (
                      <span key={tag} style={{fontSize:'10px',fontWeight:'500',color:'#9A6240',background:'#F5EDD9',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'2px',padding:'3px 8px'}}>{tag}</span>
                    ))}
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'22px',fontWeight:'700',color:'#C8702A'}}>★ {dish.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES */}
      <section style={{padding:'100px 56px',background:'#F0E6CE'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'48px'}}>
            <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(34px,4vw,60px)',fontWeight:'300',letterSpacing:'-1px',color:'#1E1208'}}>
              Pick Your <em style={{fontStyle:'italic',color:'#C8702A'}}>City</em>
            </h2>
            <Link href="/cities" style={{fontSize:'12px',fontWeight:'600',letterSpacing:'0.07em',textTransform:'uppercase',color:'#9A6240',textDecoration:'none',borderBottom:'1px solid rgba(107,66,38,0.2)',paddingBottom:'3px'}}>All 10 cities →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'14px'}}>
            {[
              {emoji:'🕌',name:'Hyderabad',count:'50+',state:'Telangana'},
              {emoji:'🌆',name:'Mumbai',count:'3,240',state:'Maharashtra'},
              {emoji:'🌿',name:'Bengaluru',count:'2,640',state:'Karnataka'},
              {emoji:'🏛️',name:'Delhi',count:'4,100',state:'Delhi'},
              {emoji:'🐟',name:'Chennai',count:'1,980',state:'Tamil Nadu'},
              {emoji:'🎨',name:'Kolkata',count:'1,720',state:'West Bengal'},
            ].map(city => (
              <Link key={city.name} href={`/cities/${city.name.toLowerCase()}`} style={{background:'white',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'8px',padding:'28px 16px 24px',textAlign:'center',cursor:'pointer',transition:'all 0.3s',textDecoration:'none',display:'block',position:'relative',overflow:'hidden'}}
                onMouseOver={e => {e.currentTarget.style.borderColor='rgba(200,112,42,0.3)';e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 16px 48px rgba(107,66,38,0.1)'}}
                onMouseOut={e => {e.currentTarget.style.borderColor='rgba(107,66,38,0.12)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
              >
                <div style={{fontSize:'30px',display:'block',marginBottom:'12px'}}>{city.emoji}</div>
                <div style={{fontSize:'13px',fontWeight:'700',letterSpacing:'0.05em',textTransform:'uppercase',color:'#1E1208',marginBottom:'4px'}}>{city.name}</div>
                <div style={{fontSize:'11px',color:'#A08060',marginBottom:'6px'}}>restaurants</div>
                <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'18px',fontWeight:'700',color:'#C8702A'}}>{city.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'100px 56px',background:'white'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.14em',textTransform:'uppercase',color:'#C8702A',marginBottom:'18px'}}>
            <span style={{width:'24px',height:'1.5px',background:'#C8702A'}}></span>
            Simple process
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(34px,4vw,60px)',fontWeight:'300',letterSpacing:'-1px',color:'#1E1208',marginBottom:'60px'}}>
            Your <em style={{fontStyle:'italic',color:'#C8702A'}}>perfect dish</em> in three steps
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'rgba(107,66,38,0.12)',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'10px',overflow:'hidden'}}>
            {[
              {num:'01',icon:'🔍',title:'Search any dish',desc:'Type the dish you are craving — get it ranked across every restaurant in your city. Biryani, Masala Dosa, Butter Chicken — we have them all.'},
              {num:'02',icon:'⭐',title:'Read dish-level reviews',desc:'Every review is for a specific dish, not just the restaurant. Compare scores, read honest notes from real visitors.'},
              {num:'03',icon:'✍️',title:'Share your review',desc:'Rate each dish, upload a photo. Done in 60 seconds. Help thousands of food lovers find their next great meal.'},
            ].map(step => (
              <div key={step.num} style={{background:'white',padding:'52px 44px',transition:'background 0.25s',cursor:'default',position:'relative'}}
                onMouseOver={e => e.currentTarget.style.background='#FBF6EE'}
                onMouseOut={e => e.currentTarget.style.background='white'}
              >
                <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'80px',fontWeight:'700',color:'#F0E6CE',lineHeight:'1',marginBottom:'20px'}}>{step.num}</div>
                <div style={{fontSize:'36px',marginBottom:'18px'}}>{step.icon}</div>
                <div style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'24px',fontWeight:'600',color:'#1E1208',letterSpacing:'-0.3px',marginBottom:'12px'}}>{step.title}</div>
                <p style={{fontSize:'14px',fontWeight:'300',lineHeight:'1.85',color:'#A08060'}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{padding:'100px 56px',background:'#F0E6CE'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.14em',textTransform:'uppercase',color:'#C8702A',marginBottom:'18px'}}>
            <span style={{width:'24px',height:'1.5px',background:'#C8702A'}}></span>
            Community voices
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(34px,4vw,60px)',fontWeight:'300',letterSpacing:'-1px',color:'#1E1208',marginBottom:'48px'}}>
            What Foodies Are <em style={{fontStyle:'italic',color:'#C8702A'}}>Saying</em>
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {[
              {q:'Arjun Mehta',badge:'🍛 Biryani Expert · 142 reviews',dish:'🍛 Hyderabadi Dum Biryani',text:'The rice is perfectly cooked — each grain separate, every one soaked in saffron. No biryani in this city even comes close. I have been coming here for 8 years.',av:'A',avBg:'rgba(200,112,42,0.12)',avColor:'#C8702A'},
              {q:'Priya Nair',badge:'🫓 South Indian Expert · 89 reviews',dish:'🫓 Masala Dosa · MTR',text:'MTR&apos;s batter has that perfect overnight fermented sourness you simply cannot replicate at home. The potato filling is never greasy. A benchmark for all dosas.',av:'P',avBg:'rgba(46,125,50,0.1)',avColor:'#2E7D32'},
              {q:'Rahul Singh',badge:'🍢 Street Food Fanatic · 201 reviews',dish:'☕ Irani Chai · Nimrah Cafe',text:'I have had this 40+ times and it never changes. The Irani chai here is perfectly strong, perfectly sweet. That consistency is the mark of a true Hyderabad legend.',av:'R',avBg:'rgba(192,57,43,0.1)',avColor:'#E57373'},
            ].map(rev => (
              <div key={rev.q} style={{background:'white',border:'1px solid rgba(107,66,38,0.12)',borderRadius:'8px',padding:'32px',cursor:'default',transition:'all 0.3s',position:'relative',overflow:'hidden'}}
                onMouseOver={e => {e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 24px 60px rgba(107,66,38,0.1)'}}
                onMouseOut={e => {e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}
              >
                <span style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'60px',fontWeight:'700',color:'#F0E6CE',lineHeight:'0.6',display:'block',marginBottom:'12px'}}>&ldquo;</span>
                <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#FDF0E4',border:'1px solid rgba(200,112,42,0.2)',color:'#C8702A',fontSize:'11px',fontWeight:'600',letterSpacing:'0.04em',padding:'5px 12px',borderRadius:'999px',marginBottom:'16px'}}>{rev.dish}</div>
                <p style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'16px',fontWeight:'400',fontStyle:'italic',lineHeight:'1.75',color:'#2E1E10',marginBottom:'26px'}}>{rev.text}</p>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{width:'38px',height:'38px',borderRadius:'50%',background:rev.avBg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'16px',fontWeight:'700',color:rev.avColor,flexShrink:0}}>{rev.av}</div>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:'600',color:'#1E1208'}}>{rev.q}</div>
                      <div style={{fontSize:'11px',color:'#A08060',marginTop:'1px'}}>{rev.badge}</div>
                    </div>
                  </div>
                  <div style={{color:'#C8702A',fontSize:'13px',letterSpacing:'2px'}}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'160px 56px',background:'#1E1208',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'relative',zIndex:2}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'10px',fontSize:'11px',fontWeight:'700',letterSpacing:'0.14em',textTransform:'uppercase',color:'#C8702A',marginBottom:'24px',justifyContent:'center'}}>
            <span style={{width:'24px',height:'1.5px',background:'#C8702A'}}></span>
            Join food lovers across India
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond, Georgia, serif',fontSize:'clamp(44px,6vw,84px)',fontWeight:'300',letterSpacing:'-2px',lineHeight:'1.0',color:'white',marginBottom:'24px'}}>
            Start Reviewing Your<br/>
            Favourite <em style={{fontStyle:'italic',color:'#C8702A'}}>Dishes Today</em>
          </h2>
          <p style={{fontSize:'17px',fontWeight:'300',color:'rgba(255,255,255,0.35)',lineHeight:'1.8',maxWidth:'460px',margin:'0 auto 56px'}}>
            Your honest review of that one dish could change someone&apos;s meal — forever. Free to join. Free forever.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center'}}>
            <Link href="/auth" style={{background:'#C8702A',color:'white',border:'none',padding:'16px 40px',borderRadius:'3px',cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',fontSize:'13px',fontWeight:'700',letterSpacing:'0.1em',textTransform:'uppercase',transition:'background 0.2s',textDecoration:'none',display:'inline-block'}}
              onMouseOver={e => e.currentTarget.style.background='#E08030'}
              onMouseOut={e => e.currentTarget.style.background='#C8702A'}
            >Create Free Account →</Link>
            <Link href="/search" style={{background:'transparent',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.15)',padding:'16px 40px',borderRadius:'3px',cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',fontSize:'13px',fontWeight:'600',letterSpacing:'0.08em',textTransform:'uppercase',transition:'all 0.2s',textDecoration:'none',display:'inline-block'}}
              onMouseOver={e => {e.currentTarget.style.color='white';e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'}}
              onMouseOut={e => {e.currentTarget.style.color='rgba(255,255,255,0.5)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}}
            >Browse as Guest</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

    </main>
  )
}
