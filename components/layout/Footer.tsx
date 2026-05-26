'use client'

import Link from 'next/link'
import { Heart, Instagram, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  discover: {
    title: 'Discover',
    links: [
      { label: 'Search Dishes', href: '/search' },
      { label: 'Leaderboards', href: '/leaderboards' },
      { label: 'Cities', href: '/cities' },
      { label: 'Trending Now', href: '/trending' },
    ],
  },
  restaurants: {
    title: 'For Restaurants',
    links: [
      { label: 'Claim Your Listing', href: '/for-restaurants' },
      { label: 'Owner Dashboard', href: '/dashboard' },
      { label: 'Advertising', href: '/advertise' },
      { label: 'Analytics', href: '/analytics' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-brown-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-saffron flex items-center justify-center">
                <span className="text-cream font-bold text-base font-serif">D</span>
              </div>
              <span className="font-serif text-lg font-semibold text-ink">DishCritic</span>
            </Link>
            <p className="text-sm text-brown-muted leading-relaxed mb-4">
              India&apos;s first dish-first restaurant review platform. Find who makes your favourite dishes best.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-brown-muted hover:text-saffron hover:bg-cream-darker transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-sm text-ink mb-3">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brown-muted hover:text-saffron transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-brown-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brown-muted flex items-center gap-1">
            &copy; {new Date().getFullYear()} DishCritic. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian food lovers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-brown-muted hover:text-saffron transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-brown-muted hover:text-saffron transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
