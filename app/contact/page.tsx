'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin, MessageSquare, Send, Loader2, CheckCircle2, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-cream text-ink min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-ink mb-2">Message Sent!</h2>
          <p className="text-brown-muted mb-8">
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}>
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream text-ink">
      {/* ═══════ HEADER ═══════ */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-gradient-radial from-saffron/8 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-xs font-medium mb-6 tracking-wide">
            <MessageSquare className="w-3.5 h-3.5" />
            Get in Touch
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-brown-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, suggestion, or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ═══════ FORM + INFO ═══════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-cream border border-brown-muted/10 p-8 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-ink mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Arjun Mehta"
                      className="w-full h-11 px-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="arjun@example.com"
                      className="w-full h-11 px-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-ink mb-1.5">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Partnership Inquiry"
                    className="w-full h-11 px-4 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl border border-brown-muted/20 bg-cream text-ink placeholder:text-brown-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-saffron hover:bg-saffron-light text-cream px-8 h-12 gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-cream-dark border border-brown-muted/10 p-6">
              <h3 className="font-serif text-lg font-bold text-ink mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Email</p>
                    <a href="mailto:hello@dishcritic.in" className="text-sm text-saffron hover:underline">
                      hello@dishcritic.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-saffron" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Location</p>
                    <p className="text-sm text-brown-muted">
                      Hyderabad, Telangana<br />India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Restaurants Section */}
            <div className="rounded-2xl bg-gradient-to-br from-saffron/5 to-cream-dark border border-saffron/10 p-6">
              <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mb-4">
                <Store className="w-5 h-5 text-saffron" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink mb-2">Own a Restaurant?</h3>
              <p className="text-sm text-brown-muted mb-4">
                Claim your restaurant listing, manage reviews, and get valuable insights about your dishes.
              </p>
              <Link href="/for-restaurants">
                <Button variant="outline" className="w-full gap-2 border-saffron/30 text-saffron hover:bg-saffron/5">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl bg-cream border border-brown-muted/10 p-6 text-center">
              <p className="text-sm text-brown-muted">
                Response time: <strong className="text-ink">Within 24 hours</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
