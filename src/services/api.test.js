import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock authStore
const mockGetState = vi.fn()
vi.mock('@/store/authStore', () => ({
  default: { getState: (...args) => mockGetState(...args) },
}))

// Must import after mocks
import api from './api'

describe('api service', () => {
  describe('baseURL', () => {
    it('should default to /api when VITE_API_URL is not set', () => {
      expect(api.defaults.baseURL).toBe('/api')
    })
  })

  describe('request interceptor', () => {
    it('should attach Authorization header when token exists', () => {
      mockGetState.mockReturnValue({ token: 'my-jwt-token' })

      // Simulate interceptor
      const config = { headers: {} }
      const interceptor = api.interceptors.request.handlers[0].fulfilled
      const result = interceptor(config)

      expect(result.headers.Authorization).toBe('Bearer my-jwt-token')
    })

    it('should not attach Authorization header when no token', () => {
      mockGetState.mockReturnValue({ token: null })

      const config = { headers: {} }
      const interceptor = api.interceptors.request.handlers[0].fulfilled
      const result = interceptor(config)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('response interceptor', () => {
    it('should pass through successful responses', () => {
      const response = { data: { ok: true }, headers: { 'content-type': 'application/json' } }
      const interceptor = api.interceptors.response.handlers[0].fulfilled
      const result = interceptor(response)

      expect(result).toEqual(response)
    })

    it('should handle 401 errors by calling logout', async () => {
      const mockLogout = vi.fn()
      mockGetState.mockReturnValue({ logout: mockLogout })

      // Mock window
      const originalDispatch = window.dispatchEvent
      window.dispatchEvent = vi.fn()

      const error = {
        response: { status: 401 },
        config: { url: '/papers' },
      }

      const errorHandler = api.interceptors.response.handlers[0].rejected

      await expect(errorHandler(error)).rejects.toEqual(error)
      expect(mockLogout).toHaveBeenCalled()

      window.dispatchEvent = originalDispatch
    })

    it('should NOT logout on 401 from /auth/me', async () => {
      const mockLogout = vi.fn()
      mockGetState.mockReturnValue({ logout: mockLogout })

      const error = {
        response: { status: 401 },
        config: { url: '/auth/me' },
      }

      const errorHandler = api.interceptors.response.handlers[0].rejected

      await expect(errorHandler(error)).rejects.toEqual(error)
      expect(mockLogout).not.toHaveBeenCalled()
    })

    it('should pass through non-401 errors', async () => {
      const error = {
        response: { status: 500 },
        config: { url: '/papers' },
      }

      const errorHandler = api.interceptors.response.handlers[0].rejected

      await expect(errorHandler(error)).rejects.toEqual(error)
    })
  })

  describe('configuration', () => {
    it('should have correct timeout', () => {
      expect(api.defaults.timeout).toBe(25000)
    })

    it('should have JSON content type', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json')
    })

    it('should send credentials', () => {
      expect(api.defaults.withCredentials).toBe(true)
    })
  })
})
