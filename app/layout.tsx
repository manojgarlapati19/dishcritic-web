import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AuthInitializer } from '@/components/shared/AuthInitializer'
import { Toaster } from 'react-hot-toast'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'DishCritic — Find India\'s Best Dishes',
  description: 'Search any dish. Find who makes it best. Dish-level reviews across 47 Indian cities.',
  keywords: ['dish reviews', 'restaurant reviews', 'Indian food', 'biryani', 'food ratings'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${cormorant.variable} font-sans bg-cream text-ink antialiased`}>
        <AuthInitializer />
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1E1208',
              color: '#FBF6EE',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}
