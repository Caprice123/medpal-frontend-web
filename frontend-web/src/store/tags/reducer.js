import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tags: [],
  loading: {
    isTagsLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false
  },
  error: null
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
    addTag: (state, action) => {
      state.tags.push(action.payload)
    },
    updateTag: (state, action) => {
      const index = state.tags.findIndex(tag => tag.id === action.payload.id)
      if (index !== -1) {
        state.tags[index] = action.payload
      }
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload)
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const actions = tagsSlice.actions
export default tagsSlice.reducer
