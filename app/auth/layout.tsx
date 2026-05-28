import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — DishCritic',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
