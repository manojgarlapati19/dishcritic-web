import { supabase } from './supabase'
import type {
  City,
  Restaurant,
  Dish,
  Review,
  Profile,
} from '@/types'

// ─── Cities ─────────────────────────────────────────────────────────────────

export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }
  return data || []
}

// ─── Restaurants ────────────────────────────────────────────────────────────

export async function getRestaurantsByCity(cityName: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, city:cities(*)')
    .eq('city.name', cityName)
    .order('overall_score', { ascending: false })

  if (error) {
    console.error('Error fetching restaurants by city:', error)
    return []
  }
  return data || []
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, city:cities(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching restaurant:', error)
    return null
  }
  return data
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, city:cities(*)')
    .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
    .order('overall_score', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error searching restaurants:', error)
    return []
  }
  return data || []
}

// ─── Dishes ──────────────────────────────────────────────────────────────────

export async function getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(*)')
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)
    .order('score', { ascending: false })

  if (error) {
    console.error('Error fetching dishes:', error)
    return []
  }
  return data || []
}

export async function getDish(id: string): Promise<Dish | null> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(*, city:cities(*))')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching dish:', error)
    return null
  }
  return data
}

export async function getDishLeaderboard(
  dishName: string,
  cityId?: string
): Promise<(Dish & { restaurant: Restaurant })[]> {
  let query = supabase
    .from('dishes')
    .select('*, restaurant:restaurants(*, city:cities(*))')
    .ilike('name', `%${dishName}%`)
    .order('score', { ascending: false })
    .limit(20)

  // If city is filtered
  if (cityId) {
    query = query.eq('restaurant.city_id', cityId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching dish leaderboard:', error)
    return []
  }
  return data || []
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchDishes(
  query: string,
  filters?: {
    cityId?: string
    cuisine?: string[]
    isVeg?: boolean
    isHalal?: boolean
    minScore?: number
    maxPrice?: number
    minPrice?: number
    sortBy?: 'score' | 'review_count' | 'price_asc' | 'price_desc'
    limit?: number
  }
): Promise<(Dish & { restaurant: Restaurant })[]> {
  let q = supabase
    .from('dishes')
    .select('*, restaurant:restaurants!inner(*, city:cities(*))')
    .ilike('name', `%${query}%`)
    .eq('is_available', true)

  if (filters?.cityId) {
    q = q.eq('restaurant.city_id', filters.cityId)
  }

  if (filters?.isVeg !== undefined) {
    q = q.eq('is_veg', filters.isVeg)
  }

  if (filters?.isHalal !== undefined) {
    q = q.eq('is_halal', filters.isHalal)
  }

  if (filters?.minScore !== undefined) {
    q = q.gte('score', filters.minScore)
  }

  if (filters?.minPrice !== undefined) {
    q = q.gte('price', filters.minPrice)
  }

  if (filters?.maxPrice !== undefined) {
    q = q.lte('price', filters.maxPrice)
  }

  // Apply sorting
  const sortField = filters?.sortBy === 'price_asc' || filters?.sortBy === 'price_desc' ? 'price'
    : filters?.sortBy === 'review_count' ? 'review_count'
    : 'score'
  const sortOrder = filters?.sortBy === 'price_asc' ? true : false
  q = q.order(sortField, { ascending: sortOrder })

  const limit = filters?.limit || 50
  q = q.limit(limit)

  const { data, error } = await q

  if (error) {
    console.error('Error searching dishes:', error)
    return []
  }
  return data || []
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getReviewsByDish(dishId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles!user_id(*), restaurant:restaurants(*)')
    .eq('dish_id', dishId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews by dish:', error)
    return []
  }
  return data || []
}

export async function getReviewsByRestaurant(restaurantId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles!user_id(*), dish:dishes(*)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews by restaurant:', error)
    return []
  }
  return data || []
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, dish:dishes(*), restaurant:restaurants(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews by user:', error)
    return []
  }
  return data || []
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, city:cities(*)')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('Error updating profile:', error)
    return false
  }
  return true
}

// ─── Submit Review ───────────────────────────────────────────────────────────

export async function submitReview(review: {
  restaurant_id: string
  dish_id: string
  rating: number
  text?: string
  photo_url?: string
  tags?: string[]
}): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      restaurant_id: review.restaurant_id,
      dish_id: review.dish_id,
      rating: review.rating,
      text: review.text || null,
      photo_url: review.photo_url || null,
      tags: review.tags || [],
    })
    .select('*, dish:dishes(*), restaurant:restaurants(*)')
    .single()

  if (error) {
    console.error('Error submitting review:', error)
    return null
  }
  return data
}

// ─── Save Restaurant ────────────────────────────────────────────────────────

export async function saveRestaurant(restaurantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_restaurants')
    .insert({ restaurant_id: restaurantId })

  if (error) {
    console.error('Error saving restaurant:', error)
    return false
  }
  return true
}

export async function unsaveRestaurant(restaurantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_restaurants')
    .delete()
    .eq('restaurant_id', restaurantId)

  if (error) {
    console.error('Error unsaving restaurant:', error)
    return false
  }
  return true
}

export async function getSavedRestaurants(userId: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('saved_restaurants')
    .select('restaurant:restaurants(*, city:cities(*))')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching saved restaurants:', error)
    return []
  }
  return (data || []).map((d: { restaurant: Restaurant | Restaurant[] }) => Array.isArray(d.restaurant) ? d.restaurant[0] : d.restaurant)
}

// ─── Helpful Votes ──────────────────────────────────────────────────────────

export async function toggleHelpfulVote(
  reviewId: string
): Promise<{ helpful_count: number } | null> {
  // First check if user already voted
  const { data: existing } = await supabase
    .from('helpful_votes')
    .select('id')
    .eq('review_id', reviewId)
    .single()

  if (existing) {
    // Remove vote
    await supabase.from('helpful_votes').delete().eq('id', existing.id)
    await supabase.rpc('decrement_helpful', { review_id: reviewId })
  } else {
    // Add vote
    await supabase.from('helpful_votes').insert({ review_id: reviewId })
    await supabase.rpc('increment_helpful', { review_id: reviewId })
  }

  // Return updated count
  const { data: review } = await supabase
    .from('reviews')
    .select('helpful_count')
    .eq('id', reviewId)
    .single()

  return review
}

// ─── Top Rated Dishes (for homepage) ─────────────────────────────────────────

export async function getTopRatedDishes(limit = 10): Promise<(Dish & { restaurant: Restaurant })[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(*, city:cities(*))')
    .gt('review_count', 10)
    .order('score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching top dishes:', error)
    return []
  }
  return data || []
}

export async function getTrendingDishes(limit = 8): Promise<(Dish & { restaurant: Restaurant })[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurant:restaurants(*, city:cities(*))')
    .gt('review_count', 5)
    .order('review_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching trending dishes:', error)
    return []
  }
  return data || []
}

// ─── Stats (for homepage) ────────────────────────────────────────────────────

export async function getPlatformStats(): Promise<{
  dishCount: number
  cityCount: number
  restaurantCount: number
  reviewerCount: number
}> {
  const [dishes, cities, restaurants, profiles] = await Promise.all([
    supabase.from('dishes').select('id', { count: 'exact', head: true }),
    supabase.from('cities').select('id', { count: 'exact', head: true }),
    supabase.from('restaurants').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ])

  return {
    dishCount: dishes.count || 0,
    cityCount: cities.count || 0,
    restaurantCount: restaurants.count || 0,
    reviewerCount: profiles.count || 0,
  }
}
