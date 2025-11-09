import api from './api'

/**
 * Auth Service - Handles all authentication-related API calls
 */

// Login with Google OAuth token
export const loginWithGoogle = async (googleCredential) => {
  try {
    const response = await api.post('/auth/login', {
      googleToken: googleCredential,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Get user credits
export const getUserCredits = async () => {
  try {
    const response = await api.get('/credits')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Deduct credits for feature usage
export const deductUserCredits = async (featureId, amount) => {
  try {
    const response = await api.post('/credits/deduct', {
      featureId,
      amount,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Top up credits
export const topUpCredits = async (amount, paymentMethod) => {
  try {
    const response = await api.post('/credits/topup', {
      amount,
      paymentMethod,
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

// Get credit transactions
export const getCreditTransactions = async () => {
  try {
    const response = await api.get('/credits/transactions')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
