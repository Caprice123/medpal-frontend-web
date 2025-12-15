import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  topics: [],
  tags: [],
  selectedTopic: null,
  questions: [],
  generatedQuestions: [],
  loading: {
    isTopicsLoading: false,
    isTagsLoading: false,
    isGeneratingQuestions: false,
    isCreatingTopic: false,
    isUpdatingTopic: false,
    isDeletingTopic: false,
    isQuestionsLoading: false,
  },
  error: null,
  filters: {
    university: '',
    semester: '',
    status: ''
  }
}

const { reducer, actions } = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
    },
    setTags: (state, { payload }) => {
      state.tags = payload
    },
    setSelectedTopic: (state, { payload }) => {
      state.selectedTopic = payload
    },
    setQuestions: (state, { payload }) => {
      state.questions = payload
    },
    setGeneratedQuestions: (state, { payload }) => {
      state.generatedQuestions = payload
    },
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters: (state) => {
      state.filters = {
        university: '',
        semester: '',
        status: ''
      }
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addTopic: (state, { payload }) => {
      state.topics = [payload, ...state.topics]
    },
    updateTopic: (state, { payload }) => {
      const index = state.topics.findIndex(t => t.id === payload.id)
      if (index !== -1) {
        state.topics[index] = payload
      }
    },
    removeTopic: (state, { payload }) => {
      state.topics = state.topics.filter(t => t.id !== payload)
    },
    addQuestion: (state, { payload }) => {
      state.questions = [...state.questions, payload]
    },
    updateQuestion: (state, { payload }) => {
      const index = state.questions.findIndex(q => q.id === payload.id)
      if (index !== -1) {
        state.questions[index] = payload
      }
    },
    removeQuestion: (state, { payload }) => {
      state.questions = state.questions.filter(q => q.id !== payload)
    },
    clearGeneratedQuestions: (state) => {
      state.generatedQuestions = []
    },
    clearSelectedTopic: (state) => {
      state.selectedTopic = null
      state.questions = []
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
