'use client'

import { useState } from 'react'
import { Store, BarChart3, IndianRupee, Check, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/* ───────────── Data ───────────── */

const BENEFITS = [
  {
    icon: Star,
    title: 'Dish-Level Reviews',
    description: 'Know exactly which dishes customers love and which need improvement. Get actionable feedback on every item.',
    color: 'text-saffron',
    bg: 'bg-saffron/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'See your score trends, review insights, and compare with competitors in your city. Data-driven decisions.',
    color: 'text-saffron',
    bg: 'bg-saffron/10',
  },
  {
    icon: IndianRupee,
    title: 'Free to List',
    description: 'Basic listing is completely free. Upgrade to Pro when you want advanced features and analytics.',
    color: 'text-saffron',
    bg: 'bg-saffron/10',
  },
]

const STEPS = [
  { number: '01', title: 'Claim or Add Your Restaurant', description: 'Search for your restaurant or add it to our platform. Verification takes less than 24 hours.' },
  { number: '02', title: 'Upload Your Menu', description: 'Add your dishes, prices, and photos. Highlight your specialities and must-try items.' },
  { number: '03', title: 'Start Getting Dish Reviews', description: 'Customers discover and review your dishes. Watch your scores grow with every review.' },
]

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Basic restaurant listing',
      'See all dish reviews',
      'Respond to reviews',
      'Basic profile',
      '1 owner account',
    ],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₹2,999',
    period: '/month',
    description: 'For restaurants serious about growth',
    features: [
      'Everything in Free',
      'Advanced analytics dashboard',
      'Featured placement in search',
      'Priority owner replies',
      'Competitor benchmarking',
      'Export reports',
      'Up to 5 owner accounts',
      'Monthly insights report',
    ],
    cta: 'Start Pro Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For chains and large groups',
    features: [
      'Everything in Pro',
      'Multi-location management',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'White-label reports',
      'Unlimited owner accounts',
      'Priority support',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
]

/* ───────────── Component ───────────── */

export default function ForRestaurantsPage() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    phone: '',
    city: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.restaurantName && formData.ownerName && formData.phone && formData.city) {
      setFormSubmitted(true)
    }
  }

  const isFormValid = formData.restaurantName && formData.ownerName && formData.phone && formData.city

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* ═══════ HERO (Dark Background) ═══════ */}
      <section className="relative bg-ink overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-gradient-radial from-saffron/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 text-saffron text-xs font-medium mb-6 tracking-wide">
              <Store className="w-3.5 h-3.5" />
              For Restaurant Owners
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-[1.1] tracking-tight mb-6">
              Get Your Restaurant on{' '}
              <span className="text-saffron">DishCritic</span>
            </h1>

            <p className="text-brown-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Join 18,000+ restaurants already listed. Let customers find your best dishes and grow your business.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="bg-saffron hover:bg-saffron-light text-cream px-8 py-6 text-base font-semibold gap-2 shadow-lg shadow-saffron/20 min-w-[200px]">
                Claim Your Listing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-cream/30 text-cream hover:bg-cream/10 hover:border-cream/50 px-8 py-6 text-base min-w-[200px]">
                List New Restaurant
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {[
                { value: '18K+', label: 'Restaurants' },
                { value: '4.2L', label: 'Reviews' },
                { value: '96%', label: 'Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-cream">{stat.value}</p>
                  <p className="text-xs text-brown-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BENEFITS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Why DishCritic</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Everything You Need to Grow</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="group p-6 sm:p-8 rounded-2xl bg-cream border border-brown-muted/10 hover:border-saffron/20 hover:shadow-lg transition-all duration-500"
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', benefit.bg)}>
                <benefit.icon className={cn('w-6 h-6', benefit.color)} />
              </div>
              <h3 className="font-serif text-xl font-bold text-ink mb-2 group-hover:text-saffron transition-colors">{benefit.title}</h3>
              <p className="text-sm text-brown-muted leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Simple Process</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">How It Works</h2>
            <p className="text-brown-muted text-sm mt-2">Get listed in under 24 hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center p-8">
                <div className="w-14 h-14 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-5">
                  <span className="font-serif text-2xl font-bold text-saffron">{step.number}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-brown-muted leading-relaxed">{step.description}</p>

                {/* Connector line */}
                {step.number !== '03' && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[40%] h-px border-t border-dashed border-brown-muted/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Pricing</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Plans for Every Restaurant</h2>
          <p className="text-brown-muted text-sm mt-2">Start free, upgrade when you need more</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl p-6 sm:p-8 transition-all duration-500',
                tier.featured
                  ? 'bg-ink border-2 border-saffron shadow-xl shadow-saffron/10 scale-105'
                  : 'bg-cream border border-brown-muted/10 hover:border-saffron/30 hover:shadow-lg'
              )}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-saffron text-cream px-4 py-1 text-xs font-semibold whitespace-nowrap">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className={cn('mb-6', tier.featured && 'mt-2')}>
                <h3 className={cn('font-serif text-xl font-bold mb-1', tier.featured ? 'text-cream' : 'text-ink')}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={cn('font-serif text-4xl font-bold', tier.featured ? 'text-cream' : 'text-ink')}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={cn('text-sm', tier.featured ? 'text-brown-muted' : 'text-brown-muted')}>{tier.period}</span>
                  )}
                </div>
                <p className={cn('text-sm', tier.featured ? 'text-brown-muted/80' : 'text-brown-muted')}>{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className={cn('w-4 h-4 mt-0.5 shrink-0', tier.featured ? 'text-saffron' : 'text-green-500')} />
                    <span className={cn('text-sm', tier.featured ? 'text-cream/80' : 'text-brown-muted')}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  'w-full text-sm font-semibold py-6',
                  tier.featured
                    ? 'bg-saffron hover:bg-saffron-light text-cream shadow-lg shadow-saffron/20'
                    : tier.name === 'Enterprise'
                      ? 'border-2 border-saffron text-saffron hover:bg-saffron/5'
                      : 'border-2 border-brown-muted/20 text-ink hover:border-saffron/30 hover:text-saffron'
                )}
                variant={tier.name === 'Enterprise' ? 'outline' : tier.featured ? 'default' : 'outline'}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA FORM ═══════ */}
      <section className="bg-cream-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-saffron uppercase tracking-[0.2em]">Get Started</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mt-1">Claim Your Restaurant</h2>
              <p className="text-brown-muted text-sm mt-2">Fill in the details and we&apos;ll get back to you within 24 hours</p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-ink mb-2">Thank You!</h3>
                <p className="text-brown-muted text-sm">
                  We&apos;ve received your details. Our team will reach out to you within 24 hours to get your restaurant listed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Restaurant Name</label>
                    <Input
                      type="text"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      placeholder="Paradise Restaurant"
                      required
                      className="bg-cream border-brown-muted/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Owner Name</label>
                    <Input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Arjun Mehta"
                      required
                      className="bg-cream border-brown-muted/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Phone Number</label>
                    <div className="flex">
                      <div className="inline-flex items-center px-3 bg-cream-dark border border-brown-muted/20 border-r-0 rounded-l-lg text-sm font-medium text-ink shrink-0">
                        +91
                      </div>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="98765 43210"
                        required
                        className="rounded-l-none bg-cream border-brown-muted/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">City</label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Hyderabad"
                      required
                      className="bg-cream border-brown-muted/20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className={cn(
                    'w-full py-6 text-base font-semibold gap-2',
                    isFormValid
                      ? 'bg-saffron hover:bg-saffron-light text-cream shadow-lg shadow-saffron/20'
                      : 'bg-cream-dark text-brown-muted/50 cursor-not-allowed'
                  )}
                >
                  Submit Request
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <p className="text-xs text-brown-muted/60 text-center">
                  By submitting, you agree to our{' '}
                  <a href="#" className="text-saffron hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-saffron hover:underline">Privacy Policy</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIAL ═══════ */}
      <section className="relative bg-ink py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBF6EE 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <Star className="w-8 h-8 text-saffron mx-auto mb-4 fill-saffron/30" />
          <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-cream leading-relaxed font-medium italic">
            &ldquo;DishCritic helped us understand exactly what our customers love. Our biryani score went from 8.2 to 9.1 in three months.&rdquo;
          </blockquote>
          <div className="mt-6">
            <p className="text-sm font-semibold text-cream">— Vikram Reddy</p>
            <p className="text-xs text-brown-muted">Owner, Paradise Restaurant, Hyderabad</p>
          </div>
        </div>
      </section>
    </div>
  )
}
