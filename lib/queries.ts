'use client'
import { supabase } from './supabase'
import type { City, Restaurant, Dish, Review, Profile } from '@/types'

// ─── Cities ─────────────────────────────────────────────────────────────────

export async function getCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('restaurant_count', { ascending: false })
  if (error) throw error
  return data || []
}

// ─── Restaurants ────────────────────────────────────────────────────────────

export async function getRestaurantsByCity(cityName: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, cities!inner(*)')
    .eq('cities.name', cityName)
    .order('overall_score', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, cities(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, cities(*)')
    .or(`name.ilike.%${query}%,address.ilike.%${query}%`)
    .order('overall_score', { ascending: false })
    .limit(10)
  if (error) throw error
  return data || []
}

export async function getTopRestaurantsByCity(
  cityName: string,
  limit = 6
): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, cities!inner(name)')
    .eq('cities.name', cityName)
    .order('overall_score', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ─── Dishes ──────────────────────────────────────────────────────────────────

export async function getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('score', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getDish(id: string): Promise<Dish | null> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurants(*, cities(*))')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getDishLeaderboard(
  dishName: string,
  cityId?: string
): Promise<Dish[]> {
  let query = supabase
    .from('dishes')
    .select('*, restaurants(*, cities(*))')
    .ilike('name', `%${dishName}%`)
    .order('score', { ascending: false })
    .limit(20)

  if (cityId) {
    query = query.eq('restaurants.city_id', cityId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getTopDishes(limit = 10): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurants(name, address, cities(name))')
    .order('score', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getTopDishesByCategory(
  category: string,
  cityName?: string,
  limit = 8
): Promise<Dish[]> {
  let query = supabase
    .from('dishes')
    .select('*, restaurants(name, address, city_id, cities(name))')
    .ilike('category', `%${category}%`)
    .order('score', { ascending: false })
    .limit(limit)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getTrendingDishes(limit = 8): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('dishes')
    .select('*, restaurants(name, address, cities(name))')
    .gt('review_count', 5)
    .order('review_count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchDishes(
  query: string,
  cityName?: string,
  filters?: {
    is_veg?: boolean
    is_halal?: boolean
    min_score?: number
    max_price?: number
  }
): Promise<Dish[]> {
  let dbQuery = supabase
    .from('dishes')
    .select('*, restaurants(name, address, cities(name))')
    .ilike('name', `%${query}%`)
    .order('score', { ascending: false })

  if (filters?.is_veg) dbQuery = dbQuery.eq('is_veg', true)
  if (filters?.is_halal) dbQuery = dbQuery.eq('is_halal', true)
  if (filters?.min_score) dbQuery = dbQuery.gte('score', filters.min_score)
  if (filters?.max_price) dbQuery = dbQuery.lte('price', filters.max_price)

  const { data, error } = await dbQuery
  if (error) throw error
  return data || []
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function getReviewsByRestaurant(restaurantId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(*), dish:dishes(*)')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data || []
}

export async function getReviewsByDish(dishId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(*), restaurant:restaurants(*)')
    .eq('dish_id', dishId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data || []
}

export async function getReviewsByUser(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, dish:dishes(*), restaurant:restaurants(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// ─── Submit Review ───────────────────────────────────────────────────────────

export async function submitReview(review: {
  restaurant_id: string
  dish_id: string
  rating: number
  text?: string
  tags?: string[]
}): Promise<Review> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to review')

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...review,
      user_id: user.id,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
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
  if (error) throw error
  return true
}

export async function getCurrentUser(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return getProfile(user.id)
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getPlatformStats(): Promise<{
  dishes: number
  restaurants: number
  cities: number
}> {
  const [dishes, restaurants, cities] = await Promise.all([
    supabase.from('dishes').select('id', { count: 'exact', head: true }),
    supabase.from('restaurants').select('id', { count: 'exact', head: true }),
    supabase.from('cities').select('id', { count: 'exact', head: true }),
  ])
  return {
    dishes: dishes.count || 0,
    restaurants: restaurants.count || 0,
    cities: cities.count || 0,
  }
}

// ─── Saved Restaurants ──────────────────────────────────────────────────────

export async function saveRestaurant(restaurantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_restaurants')
    .insert({ restaurant_id: restaurantId })
  if (error) throw error
  return true
}

export async function unsaveRestaurant(restaurantId: string): Promise<boolean> {
  const { error } = await supabase
    .from('saved_restaurants')
    .delete()
    .eq('restaurant_id', restaurantId)
  if (error) throw error
  return true
}

export async function getSavedRestaurants(userId: string): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from('saved_restaurants')
    .select('restaurant:restaurants(*, city:cities(*))')
    .eq('user_id', userId)
  if (error) throw error
  return (data || []).map((d) => Array.isArray(d.restaurant) ? d.restaurant[0] : d.restaurant)
}
