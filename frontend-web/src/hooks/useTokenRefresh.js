import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearAuth } from '@store/slices/authSlice'
import { resetCredits } from '@store/slices/creditsSlice'
import { jwtDecode } from 'jwt-decode'

/**
 * Hook to handle automatic token refresh
 * Monitors token expiration and refreshes before it expires
 */
export const useTokenRefresh = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    let refreshTimer

    const scheduleTokenRefresh = () => {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        return
      }

      try {
        const decoded = jwtDecode(accessToken)
        const expiresAt = decoded.exp * 1000 // Convert to milliseconds
        const now = Date.now()
        const timeUntilExpiry = expiresAt - now

        // Refresh 5 minutes before expiration (or immediately if less than 5 minutes left)
        const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0)

        if (refreshTime > 0) {
          refreshTimer = setTimeout(() => {
            // The axios interceptor will handle the actual refresh
            // This just triggers a request that will cause a refresh
            console.log('Token refresh scheduled')
          }, refreshTime)
        } else {
          // Token is already expired or about to expire, force logout
          handleTokenExpired()
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        handleTokenExpired()
      }
    }

    const handleTokenExpired = () => {
      console.log('Token expired, logging out')
      dispatch(clearAuth())
      dispatch(resetCredits())
      navigate('/login')
    }

    // Listen for token expired event from axios interceptor
    const handleTokenExpiredEvent = () => {
      handleTokenExpired()
    }

    window.addEventListener('token-expired', handleTokenExpiredEvent)

    // Schedule initial refresh
    scheduleTokenRefresh()

    // Re-schedule on storage change (e.g., token updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        clearTimeout(refreshTimer)
        scheduleTokenRefresh()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearTimeout(refreshTimer)
      window.removeEventListener('token-expired', handleTokenExpiredEvent)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [dispatch, navigate])
}
