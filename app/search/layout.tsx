import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Dishes — Find the Best Near You',
  description: 'Search any Indian dish and find which restaurant makes it best in your city.',
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
