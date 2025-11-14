import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  features: [],
  loading: {
    isLoadingFeatures: false
  },
  error: null
}

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    setFeatures: (state, action) => {
      state.features = action.payload
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
  }
})

export const { actions } = featureSlice
export default featureSlice.reducer
