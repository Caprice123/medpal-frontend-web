import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  decks: [],
  tags: [],
  selectedDeck: null,
  cards: [],
  generatedCards: [],
  loading: {
    isDecksLoading: false,
    isTagsLoading: false,
    isGeneratingCards: false,
    isCreatingDeck: false,
    isUpdatingDeck: false,
    isDeletingDeck: false,
    isCardsLoading: false,
  },
  error: null,
  filters: {
    university: '',
    semester: '',
    status: ''
  }
}

const { reducer, actions } = createSlice({
  name: 'flashcard',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDecks: (state, { payload }) => {
      state.decks = payload
    },
    setTags: (state, { payload }) => {
      state.tags = payload
    },
    setSelectedDeck: (state, { payload }) => {
      state.selectedDeck = payload
    },
    setCards: (state, { payload }) => {
      state.cards = payload
    },
    setGeneratedCards: (state, { payload }) => {
      state.generatedCards = payload
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
    addDeck: (state, { payload }) => {
      state.decks = [payload, ...state.decks]
    },
    updateDeck: (state, { payload }) => {
      const index = state.decks.findIndex(d => d.id === payload.id)
      if (index !== -1) {
        state.decks[index] = payload
      }
    },
    removeDeck: (state, { payload }) => {
      state.decks = state.decks.filter(d => d.id !== payload)
    },
    addCard: (state, { payload }) => {
      state.cards = [...state.cards, payload]
    },
    updateCard: (state, { payload }) => {
      const index = state.cards.findIndex(c => c.id === payload.id)
      if (index !== -1) {
        state.cards[index] = payload
      }
    },
    removeCard: (state, { payload }) => {
      state.cards = state.cards.filter(c => c.id !== payload)
    },
    clearGeneratedCards: (state) => {
      state.generatedCards = []
    },
    clearSelectedDeck: (state) => {
      state.selectedDeck = null
      state.cards = []
    }
  }
})

export { actions }
export default reducer
