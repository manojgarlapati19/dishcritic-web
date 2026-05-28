'use client'

import Link from 'next/link'
import { ArrowRight, Search, Star, ChefHat, Sparkles, MapPin, MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATS = [
  { value: '4.2L', label: 'Reviews' },
  { value: '47', label: 'Cities' },
  { value: '18K', label: 'Restaurants' },
  { value: '2.1L', label: 'Reviewers' },
]

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Search Any Dish',
    desc: 'Type in any dish — Biryani, Masala Dosa, Butter Chicken — and instantly see every restaurant serving it, ranked by dish score.',
  },
  {
    number: '02',
    icon: Star,
    title: 'Compare Scores',
    desc: 'See how each restaurant scores for that specific dish. No more guessing based on overall restaurant ratings.',
  },
  {
    number: '03',
    icon: ChefHat,
    title: 'Review & Share',
    desc: 'Had an amazing plate? Rate it. Help your city discover where the best dishes are hiding.',
  },
]

const TEAM = [
  { name: 'Arjun Mehta', role: 'Co-Founder & CEO', initials: 'AM' },
  { name: 'Priya Sharma', role: 'Co-Founder & CTO', initials: 'PS' },
  { name: 'Rahul Verma', role: 'Head of Community', initials: 'RV' },
]

export default function AboutPage() {
  return (
    <div className="bg-cream text-ink overflow-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-[5%] left-[-8%] w-[30%] h-[40%] rounded-full bg-gradient-radial from-saffron/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            About Us
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
            India&apos;s Dish-First<br />
            <span className="text-saffron">Review Platform</span>
          </h1>
          <p className="text-brown-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We&apos;re on a mission to answer the only question that matters —
            who makes the best dish in your city?
          </p>
        </div>
      </section>

      {/* ═══════ OUR STORY ═══════ */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Our Story</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink text-center mb-8">How DishCritic Was Born</h2>
          <div className="max-w-3xl mx-auto space-y-5 text-brown-muted leading-relaxed text-base sm:text-lg">
            <p>
              DishCritic was born from one frustration — every review site told you about
              the restaurant, not the dish. You could walk into a highly-rated restaurant and
              still end up with an average meal, because the restaurant&apos;s overall score
              didn&apos;t tell you what to order.
            </p>
            <p>
              We built the platform that answers the only question that matters:{' '}
              <strong className="text-ink">who makes the best Biryani in your city?</strong>
            </p>
            <p>
              By shifting the focus from restaurants to individual dishes, we&apos;ve created
              a space where food lovers can find exactly what they&apos;re craving — ranked,
              reviewed, and verified by people who actually ate the dish.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ MISSION ═══════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-darker via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-gradient-radial from-saffron/6 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Our Mission</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-4 mb-8 leading-tight">
            To help every Indian find the<br />
            <span className="text-saffron">perfect dish, every time.</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Star, title: 'Dish-Level Focus', desc: 'Every dish stands on its own merit. No more guessing based on restaurant ratings.' },
              { icon: MapPin, title: 'Every City', desc: 'From Hyderabad to Patna, we\'re covering every Indian city one dish at a time.' },
              { icon: Users, title: 'Community Powered', desc: 'Real reviews from real food lovers. Your taste buds do the ranking.' },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-cream border border-brown-muted/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-saffron" />
                </div>
                <h3 className="font-serif text-lg font-bold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-brown-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="bg-cream-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Simple Process</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-brown-muted/10 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            {STEPS.map((step, i) => (
              <div key={i} className="relative bg-cream p-8 sm:p-10 hover:bg-cream-dark transition-colors duration-500 group">
                <span className="absolute top-4 right-6 font-serif text-7xl sm:text-8xl font-bold text-ink/[0.04] select-none pointer-events-none">
                  {step.number}
                </span>
                <div className="w-14 h-14 rounded-xl bg-saffron/10 flex items-center justify-center mb-5 group-hover:bg-saffron/20 transition-colors">
                  <step.icon className="w-6 h-6 text-saffron" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3 relative z-10">{step.title}</h3>
                <p className="text-sm text-brown-muted leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">By the Numbers</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">DishCritic in Numbers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative group text-center py-6 px-4">
              {i > 0 && <div className="hidden md:block absolute left-0 top-1/4 bottom-1/4 w-px bg-brown-muted/10" />}
              <h3 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-1">{stat.value}</h3>
              <p className="text-xs text-brown-muted uppercase tracking-widest font-medium">{stat.label}</p>
              <div className="absolute bottom-0 left-[20%] right-[20%] h-0.5 bg-saffron scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TEAM ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Our Team</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1 mb-4">Meet the Team</h2>
          <p className="text-brown-muted text-base max-w-xl mx-auto mb-12">
            We&apos;re a passionate group of food lovers, engineers, and designers on a mission
            to change how India discovers great food.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM.map((member) => (
              <div key={member.name} className="group p-6 rounded-xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-md transition-all">
                <div className="w-20 h-20 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-saffron/20 transition-colors">
                  <span className="font-serif text-2xl font-bold text-saffron">{member.initials}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-ink">{member.name}</h3>
                <p className="text-sm text-brown-muted">{member.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/contact">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="relative bg-ink py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream leading-tight mb-4">
            Join the DishCritic Community
          </h2>
          <p className="text-brown-muted text-lg mb-10">
            Start reviewing dishes and help others discover the best food in your city.
          </p>
          <Link href="/auth">
            <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
