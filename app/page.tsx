import type { Metadata } from 'next'
import HomePageContent from './HomePageContent'

export const metadata: Metadata = {
  title: "Find India's Best Dishes — DishCritic",
  description: 'Search any dish and find which restaurant makes it best. Dish-level reviews across Hyderabad, Mumbai, Delhi and 44 more cities.',
}

export default function HomePage() {
  return <HomePageContent />
}
