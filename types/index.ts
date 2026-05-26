export type City = {
  id: string
  name: string
  state: string
  emoji: string
  restaurant_count: number
  created_at: string
}

export type Profile = {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  city_id?: string
  city?: City
  bio?: string
  review_count: number
  created_at: string
}

export type Restaurant = {
  id: string
  name: string
  description?: string
  city_id: string
  city?: City
  address: string
  lat?: number
  lng?: number
  cuisine_type: string[]
  price_range: 1 | 2 | 3 | 4
  phone?: string
  hours?: Record<string, string>
  overall_score: number
  review_count: number
  is_verified: boolean
  is_claimed: boolean
  owner_id?: string
  photo_urls: string[]
  created_at: string
}

export type Dish = {
  id: string
  restaurant_id: string
  restaurant?: Restaurant
  name: string
  description?: string
  price?: number
  is_veg: boolean
  is_jain: boolean
  is_halal: boolean
  score: number
  review_count: number
  category?: string
  photo_url?: string
  is_available: boolean
  created_at: string
}

export type Review = {
  id: string
  user_id: string
  user?: Profile
  restaurant_id: string
  restaurant?: Restaurant
  dish_id: string
  dish?: Dish
  rating: number
  text?: string
  photo_url?: string
  tags: string[]
  is_verified: boolean
  helpful_count: number
  is_flagged: boolean
  created_at: string
}

export type SearchFilters = {
  city?: string
  cuisine?: string
  price_range?: number[]
  is_veg?: boolean
  is_halal?: boolean
  min_score?: number
  sort_by?: 'score' | 'review_count' | 'price_asc' | 'price_desc'
}
