import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  filter: {
    email: undefined,
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
    setCurrentPage: (state, { payload }) => {
        state.pagination.currentPage = payload
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
  }
})

export const actions = usersSlice.actions
export default usersSlice.reducer
