import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "India's Best Dish Leaderboards",
  description: 'See which restaurants make the best Biryani, Dosa, Butter Chicken and more. Updated weekly from verified reviews.',
}

export default function LeaderboardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
