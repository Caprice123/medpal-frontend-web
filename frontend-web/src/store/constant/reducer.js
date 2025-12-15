import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  constants: [],
  filter: {
    name: undefined,
    tagName: undefined
  },
  loading: {
    isGetListConstantsLoading: false,
    isUpdateConstantLoading: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'constants',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setConstants: (state, { payload }) => {
      state.constants = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    }
  },

    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export { actions }
export default reducer
