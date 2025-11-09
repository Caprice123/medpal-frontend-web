import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getUserCredits,
  deductUserCredits,
  topUpCredits,
  getCreditTransactions,
} from '@services/authService'

const initialState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
}

// Async thunks
export const fetchUserCreditsThunk = createAsyncThunk(
  'credits/fetchUserCredits',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserCredits()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch credits')
    }
  }
)

export const deductCreditsThunk = createAsyncThunk(
  'credits/deductCredits',
  async ({ featureId, amount, featureName }, { rejectWithValue }) => {
    try {
      const data = await deductUserCredits(featureId, amount)
      return { ...data, featureName }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to deduct credits')
    }
  }
)

export const topUpCreditsThunk = createAsyncThunk(
  'credits/topUpCredits',
  async ({ amount, paymentMethod }, { rejectWithValue }) => {
    try {
      const data = await topUpCredits(amount, paymentMethod)
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to top up credits')
    }
  }
)

export const fetchTransactionsThunk = createAsyncThunk(
  'credits/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCreditTransactions()
      return data.transactions
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch transactions')
    }
  }
)

export const creditsSlice = createSlice({
  name: 'credits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetCredits: (state) => {
      state.balance = 0
      state.transactions = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch user credits
    builder
      .addCase(fetchUserCreditsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserCreditsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload.balance
        state.error = null
      })
      .addCase(fetchUserCreditsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Deduct credits
    builder
      .addCase(deductCreditsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deductCreditsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload.newBalance

        // Add transaction to local state
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction)
        }

        state.error = null
      })
      .addCase(deductCreditsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Top up credits
    builder
      .addCase(topUpCreditsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(topUpCreditsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload.newBalance

        // Add transaction to local state
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction)
        }

        state.error = null
      })
      .addCase(topUpCreditsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch transactions
    builder
      .addCase(fetchTransactionsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
        state.error = null
      })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, resetCredits } = creditsSlice.actions
export default creditsSlice.reducer
