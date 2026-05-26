import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (for use in 'use client' components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for use in server components / API routes)
export const createServerClient = () =>
  createServerComponentClient({ cookies })

export type SupabaseClient = ReturnType<typeof createServerClient>
