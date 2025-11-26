import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  plans: [],
  pagination: {
    page: 1,
    limit: 10,
    isLastPage: true
  },
  userStatus: {
    hasActiveSubscription: false,
    subscription: null,
    creditBalance: 0,
    userId: null
  },
  purchaseHistory: [],
  loading: {
    isPlansLoading: false,
    isStatusLoading: false,
    isHistoryLoading: false,
    isPurchaseLoading: false,
  },
  error: null,
}

const { reducer, actions } = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setPlans: (state, { payload }) => {
      state.plans = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload || initialState.pagination
    },
    setUserStatus: (state, { payload }) => {
      state.userStatus = payload
    },
    setPurchaseHistory: (state, { payload }) => {
      state.purchaseHistory = payload
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addPurchase: (state, { payload }) => {
      state.purchaseHistory = [payload, ...state.purchaseHistory]
    }
  }
})

export { actions }
export default reducer
