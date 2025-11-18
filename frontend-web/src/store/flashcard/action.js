import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDecks,
  setTags,
  setSelectedDeck,
  setCards,
  setGeneratedCards,
  setFilters,
  clearFilters,
  clearError,
  addDeck,
  updateDeck,
  removeDeck,
  addCard,
  updateCard,
  removeCard,
  clearGeneratedCards,
  clearSelectedDeck
} = actions

// ============= Decks Actions =============

/**
 * Fetch all flashcard decks (user endpoint)
 */
export const fetchFlashcardDecks = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDecksLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.flashcards.decks, queryParams)

    dispatch(setDecks(response.data.data || response.data.decks || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDecksLoading', value: false }))
  }
}

/**
 * Fetch all flashcard decks for admin panel
 */
export const fetchAdminFlashcardDecks = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDecksLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.flashcards.admin.decks, queryParams)

    dispatch(setDecks(response.data.data || response.data.decks || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDecksLoading', value: false }))
  }
}

/**
 * Fetch single deck with cards (for editing in admin)
 */
export const fetchFlashcardDeck = (deckId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCardsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.flashcards.admin.deck(deckId))

    const deck = response.data.data || response.data.deck
    dispatch(setSelectedDeck(deck))
    dispatch(setCards(deck.flashcard_cards || deck.cards || []))
    return deck
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCardsLoading', value: false }))
  }
}

/**
 * Generate flashcards using Gemini (admin only)
 */
export const generateFlashcards = (content, type, cardCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingCards', value: true }))
    dispatch(clearError())

    const requestBody = {
      content,
      type,
      cardCount
    }

    const response = await postWithToken(Endpoints.flashcards.admin.generate, requestBody)

    const cards = response.data.data || response.data.cards || []
    dispatch(setGeneratedCards(cards))
    return cards
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingCards', value: false }))
  }
}

/**
 * Generate flashcards from PDF using Gemini (admin only)
 */
export const generateFlashcardsFromPDF = (pdfFile, cardCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingCards', value: true }))
    dispatch(clearError())

    // Create FormData for PDF upload
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('cardCount', cardCount)

    const response = await postWithToken(Endpoints.flashcards.admin.generateFromPDF, formData)

    const data = response.data.data || {}
    const cards = data.cards || []
    const pdfInfo = {
      pdf_url: data.pdf_url,
      pdf_key: data.pdf_key,
      pdf_filename: data.pdf_filename
    }

    dispatch(setGeneratedCards(cards))
    return { cards, ...pdfInfo }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingCards', value: false }))
  }
}

/**
 * Create new flashcard deck (admin only)
 * Supports both JSON (text-based) and FormData (PDF-based)
 */
export const createFlashcardDeck = (deckData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingDeck', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.flashcards.admin.decks, deckData)

    const deck = response.data.data || response.data.deck
    dispatch(addDeck(deck))
    dispatch(clearGeneratedCards())
    return deck
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingDeck', value: false }))
  }
}

/**
 * Update deck cards (admin only)
 */
export const updateDeckCards = (deckId, cards) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: true }))
    dispatch(clearError())

    const response = await putWithToken(
      Endpoints.flashcards.admin.deck(deckId),
      { cards }
    )

    const deck = response.data.data || response.data.deck
    dispatch(updateDeck(deck))
    return deck
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: false }))
  }
}

/**
 * Delete deck (admin only)
 */
export const deleteFlashcardDeck = (deckId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingDeck', value: true }))
    dispatch(clearError())

    await deleteWithToken(Endpoints.flashcards.admin.deck(deckId))

    dispatch(removeDeck(deckId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeletingDeck', value: false }))
  }
}

// ============= Filter Actions =============

/**
 * Update filters
 */
export const updateFlashcardFilters = (filters) => (dispatch) => {
  dispatch(setFilters(filters))
}

/**
 * Clear all filters
 */
export const clearFlashcardFilters = () => (dispatch) => {
  dispatch(clearFilters())
}

/**
 * Clear selected deck and cards
 */
export const clearFlashcardSelection = () => (dispatch) => {
  dispatch(clearSelectedDeck())
}

// ============= Constants Actions =============

/**
 * Fetch flashcard constants (admin only)
 */
export const fetchFlashcardConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.flashcards.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update flashcard constants (admin only)
 */
export const updateFlashcardConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.flashcards.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}
