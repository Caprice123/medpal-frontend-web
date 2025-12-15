import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  topics: [],
  filter: {
    name: undefined,
    tagName: undefined
  },
  detail: undefined,
  loading: {
    isGetListCalculatorsLoading: false,
    isGetDetailCalculatorLoading: false,
    isCreateCalculatorLoading: false,
    isUpdateCalculatorLoading: false,
    isDeleteCalculatorLoading: false,
    isCalculateResultLoading: false,
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
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
