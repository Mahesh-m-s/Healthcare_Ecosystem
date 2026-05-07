import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '../api/client'
import { getWebSocket, disconnectWebSocket } from '../api/websocket'
import type { UserRole, Patient, Hospital, Doctor, LoginCredentials } from '../types/user.types'

interface AuthState {
  user: Patient | Hospital | Doctor | null
  role: UserRole | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loading: boolean
  error: string | null

  login: (creds: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, role: null, token: null,
      isAuthenticated: false, isLoading: false, loading: false, error: null,

      login: async (creds) => {
        set({ isLoading: true, loading: true, error: null })
        try {
          const { data } = await apiClient.post('/auth/login', creds)
          const accessToken = data.accessToken || data.access_token
          const refreshToken = data.refreshToken || data.refresh_token
          const role = data.role
          const user = data.user
          localStorage.setItem('va_access_token', accessToken)
          localStorage.setItem('va_refresh_token', refreshToken)
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
          set({ user, role, token: accessToken, isAuthenticated: true, isLoading: false, loading: false })
          getWebSocket().connect()
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Login failed'
          set({ error: msg, isLoading: false, loading: false })
        }
      },

      logout: () => {
        localStorage.removeItem('va_access_token')
        localStorage.removeItem('va_refresh_token')
        delete apiClient.defaults.headers.common.Authorization
        disconnectWebSocket()
        set({ user: null, role: null, token: null, isAuthenticated: false })
      },

      refreshToken: async () => {
        const refresh = localStorage.getItem('va_refresh_token')
        if (!refresh) { get().logout(); return }
        try {
          const { data } = await apiClient.post('/auth/refresh', { refreshToken: refresh })
          localStorage.setItem('va_access_token', data.accessToken || data.access_token)
          set({ token: data.accessToken || data.access_token })
        } catch { get().logout() }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'va-auth',
      partialize: (s) => ({ user: s.user, role: s.role, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
