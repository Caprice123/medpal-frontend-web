import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tags: [],
  filter: {
    tagGroupNames: undefined,
  },
  loading: {
    isGetListTagsLoading: false,
    isCreateTagLoading: false,
    isUpdateTagLoading: false,
  },
}

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setTags: (state, action) => {
      state.tags = action.payload
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload
      state.filter[key] = value
    },
  }
})

export const actions = tagsSlice.actions
export default tagsSlice.reducer
