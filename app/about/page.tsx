import Link from 'next/link'
import { ArrowRight, Star, Search, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="bg-[#FBF6EE]">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="text-xs font-semibold text-[#C8702A] uppercase tracking-[0.2em]">About Us</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1208] mt-4 mb-6">
          India&apos;s First Dish-First<br />Review Platform
        </h1>
        <p className="text-lg text-[#A08060] max-w-2xl mx-auto leading-relaxed">
          We believe great food is about the dish, not just the restaurant. DishCritic lets you search, rate, and discover the best dishes across India — ranked by dish score, not restaurant reputation.
        </p>
      </section>

      {/* Our Story */}
      <section className="bg-[#F5EDD9] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-[#1E1208] mb-6">Our Story</h2>
          <div className="space-y-4 text-[#A08060] leading-relaxed">
            <p>
              DishCritic was born from a simple observation: restaurant ratings tell you where to eat, but they don&apos;t tell you what to order. A 4-star restaurant might have an average biryani, while a 3-star joint might serve the best butter chicken in town.
            </p>
            <p>
              We founded DishCritic to change that. By focusing on dish-level reviews and scores, we help food lovers find exactly what they&apos;re craving — not just which restaurant to visit.
            </p>
            <p>
              Today, DishCritic spans 47+ cities, helping millions of users discover the best dishes India has to offer. From street food stalls to fine dining, every dish gets its own spotlight.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-serif text-3xl font-bold text-[#1E1208] text-center mb-12">Our Mission</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: 'Find Every Dish', desc: 'Make every dish in India searchable, rateable, and discoverable — from biryani to bhaji.' },
            { icon: Star, title: 'Unbiased Rankings', desc: 'Score dishes on their own merit. No influencer bias, no paid placements.' },
            { icon: Users, title: 'Community Driven', desc: 'Built by food lovers, for food lovers. Every review makes the rankings better.' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-[#C8702A]/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-[#C8702A]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E1208] mb-2">{item.title}</h3>
              <p className="text-sm text-[#A08060]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F0E6CE] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1E1208] mb-4">Meet the Team</h2>
          <p className="text-[#A08060] mb-4">
            We&apos;re a passionate team of food lovers, engineers, and designers on a mission to change how India discovers food.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#1E1208] mb-4">Join the DishCritic Community</h2>
        <p className="text-[#A08060] mb-8">Start reviewing dishes and help others discover the best food in your city.</p>
        <Link href="/auth">
          <Button className="bg-[#C8702A] hover:bg-[#E08030] text-[#FBF6EE] px-8 py-6 text-base font-semibold gap-2">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
