import useAuthStore from '@/store/authStore'
import axios from 'axios'

const apiOrigin = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const baseURL = apiOrigin ? `${apiOrigin}/api` : '/api'

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error(
    '[AI Question Hub] VITE_API_URL missing — /api calls may fail. Set it in Vercel env.',
  )
}

const api = axios.create({
  baseURL,
  timeout: 25_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // Detect if Vercel returned index.html for an API route (missing backend)
    const contentType = response.headers['content-type'] || ''
    if (contentType.includes('text/html') && typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      console.warn(
        '[AI Question Hub] API returned HTML instead of JSON. Your VITE_API_URL might be missing or incorrect on Vercel.',
        response.config.url
      )
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = String(error.config?.url || '')
      const isAuthMe = url.includes('/auth/me')
      if (isAuthMe) {
        return Promise.reject(error)
      }
      useAuthStore.getState().logout()
      // Use replaceState + popstate to trigger React Router navigation without full reload
      window.history.replaceState(null, '', '/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    return Promise.reject(error)
  },
)

export default api
