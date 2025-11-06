import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginWithGoogle, getCurrentUser, logout as logoutService } from '@/services/authService'

// Load initial state from localStorage
const loadInitialState = () => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const userStr = localStorage.getItem('user')

  if (accessToken && refreshToken && userStr) {
    try {
      return {
        user: JSON.parse(userStr),
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    } catch (error) {
      // If parsing fails, clear everything
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }
}

const initialState = loadInitialState()

// Async thunks
export const loginWithGoogleThunk = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleCredential, { rejectWithValue }) => {
    try {
      const data = await loginWithGoogle(googleCredential)

      // Store tokens and user data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user', JSON.stringify(data.user))

      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const getCurrentUserThunk = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser()
      return data.user
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user')
    }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutService()

      // Clear local storage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      return null
    } catch (error) {
      // Even if API call fails, clear local data
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    // Login with Google
    builder
      .addCase(loginWithGoogleThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.error = null
      })
      .addCase(loginWithGoogleThunk.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = action.payload
      })

    // Get current user
    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(getCurrentUserThunk.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.error = null
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { clearError, setUser, clearAuth } = authSlice.actions
export default authSlice.reducer
