import api from '@/services/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Single in-flight applySession — stops TOKEN_REFRESHED / multi-tab from stacking /auth/me calls. */
let isProcessingLogout = false

/** Use a global symbol to ensure shared state across all chunks/bundles */
const FLIGHT_KEY = typeof globalThis !== 'undefined' 
  ? (globalThis.__authApplySessionFlight ??= Symbol.for('authApplySessionFlight'))
  : Symbol.for('authApplySessionFlight')

const getFlightState = () => {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis[FLIGHT_KEY]) globalThis[FLIGHT_KEY] = { promise: null }
    return globalThis[FLIGHT_KEY]
  }
  return { promise: null }
}

const setFlightState = (promise) => {
  if (typeof globalThis !== 'undefined') {
    if (!globalThis[FLIGHT_KEY]) globalThis[FLIGHT_KEY] = { promise: null }
    globalThis[FLIGHT_KEY].promise = promise
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken = null) =>
        set({
          user,
          token,
          refreshToken: refreshToken ?? get().refreshToken,
          isAuthenticated: !!user && !!token,
        }),

      setUser: (user) => set({ user }),

      logout: () => {
        // Prevent infinite loop - don't call supabase.auth.signOut() which triggers auth state change
        if (isProcessingLogout) return
        isProcessingLogout = true
        
        setFlightState(null)
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false })
        
        // Reset flag after a tick
        setTimeout(() => { isProcessingLogout = false }, 50)
      },

      applySession: async (session) => {
        console.log('[authStore] applySession called', session ? 'with session' : 'no session')
        
        if (!session?.access_token) {
          console.log('[authStore] No access token - skip (prevents loop)')
          return null
        }

        const flight = getFlightState()
        if (flight.promise) {
          console.log('[authStore] Session in flight, return existing')
          return flight.promise
        }

        const promise = (async () => {
          try {
            const { user: currentUser } = get()
            const sessionUser = session.user

            const basicUser = {
              ...(currentUser || {}),
              uid: sessionUser.id,
              email: sessionUser.email,
              name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
              role: currentUser?.role || null,
              subscription: currentUser?.subscription || 'free',
            }

            set({
              token: session.access_token,
              refreshToken: session.refresh_token,
              user: basicUser,
              isAuthenticated: true,
            })
            console.log('[authStore] Auth state set, fetching backend profile')

            try {
              const res = await api.get('/auth/me')
              const backendUser = res.data?.user
              if (backendUser) {
                console.log('[authStore] Backend profile fetched')
                set({ user: backendUser })
              }
            } catch (err) {
              console.warn('[authStore] Profile fetch failed:', err.message)
            }

            return basicUser
          } catch (err) {
            console.error('[authStore] applySession error:', err)
            return null
          } finally {
            setFlightState(null)
          }
        })()

        setFlightState(promise)
        return promise
      },
    }),
    { 
      name: 'auth-storage',
      onRehydrateStorage: () => () => {
        console.log('[authStore] Rehydration complete')
      }
    }
  )
)

export default useAuthStore
