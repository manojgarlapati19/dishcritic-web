import { create } from 'zustand'
import { Profile, SearchFilters } from '@/types'
import { supabase } from '@/lib/supabase'

interface AppStore {
  // Auth
  user: Profile | null
  setUser: (user: Profile | null) => void
  isAuthenticated: boolean
  isLoading: boolean
  setLoading: (loading: boolean) => void
  initializeAuth: () => Promise<void>
  signOut: () => Promise<void>

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchFilters: SearchFilters
  setSearchFilters: (filters: SearchFilters) => void

  // UI
  selectedCity: string
  setSelectedCity: (city: string) => void
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  isAuthenticated: false,
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),

  initializeAuth: async () => {
    set({ isLoading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          set({ user: profile as Profile, isAuthenticated: true })
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      set({ isLoading: false })
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            set({ user: profile as Profile, isAuthenticated: true })
          }
        } else {
          set({ user: null, isAuthenticated: false })
        }
      }
    )

    // Store subscription for cleanup
    ;(window as any).__supabaseAuthSubscription = subscription
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  searchFilters: {},
  setSearchFilters: (filters) => set({ searchFilters: filters }),

  selectedCity: 'Hyderabad',
  setSelectedCity: (city) => set({ selectedCity: city }),
}))
