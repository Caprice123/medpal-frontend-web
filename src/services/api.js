import axios from 'axios'

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If error is 401, token is invalid or expired
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('tokenExpiry')

      // Dispatch event to notify app of token expiration
      window.dispatchEvent(new Event('token-expired'))
    }

    return Promise.reject(error)
  }
)

export default api
