import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  statistics: {
    totalUsers: 0,
    totalSessions: 0,
    totalFlashcards: 0,
    totalQuestions: 0,
    totalSummaryNotes: 0,
    satisfactionRate: 95
  },
  loading: {
    isLoadingStatistics: false
  },
  error: null
}

const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    setStatistics: (state, action) => {
      state.statistics = action.payload
    },
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export const { actions } = statisticSlice
export default statisticSlice.reducer
