import axios, { type AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config/constants'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('va_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean }
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('va_refresh_token')
      if (refreshToken) {
        try {
          const { data } = await apiClient.post('/auth/refresh', { refreshToken })
          const accessToken = data.accessToken || data.access_token
          localStorage.setItem('va_access_token', accessToken)
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
          return apiClient(original)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
