import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Food Reviews by City — 47 Indian Cities',
  description: 'Explore the best dishes in Hyderabad, Mumbai, Bengaluru, Delhi, Chennai and 42 more Indian cities.',
}

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
