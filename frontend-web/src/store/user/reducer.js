import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  users: [],
  filter: {
    email: undefined,
    name: undefined,
    status: undefined,
  },
  pagination: {
    page: 1,
    perPage: 50,
    isLastPage: false
  },
  loading: {
    isGetUsersLoading: false,
    isAdjustCreditLoading: false,
    isAdjustSubscriptionLoading: false,
  },
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setPage: (state, { payload }) => {
        state.pagination.page = payload
    },
    setPagination: (state, action) => {
      const { page, perPage, isLastPage } = action.payload
      state.pagination.page = page
      state.pagination.perPage = perPage
      state.pagination.isLastPage = isLastPage
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    updateFilter: (state, { payload }) => {
        state.pagination.currentPage = 1
        Object.assign(state.filter, { [payload.key]: payload.value })
    },
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export const actions = usersSlice.actions
export default usersSlice.reducer
