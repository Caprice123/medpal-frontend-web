import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDecks,
  setDetail
} = actions

// ============= Decks Actions =============

/**
 * Fetch all flashcard decks (user endpoint)
 */
export const fetchFlashcardDecks = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: true }))

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const route = Endpoints.api.flashcards
    const response = await getWithToken(route, queryParams)

    dispatch(setDecks(response.data.data || response.data.decks || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: false }))
  }
}

export const fetchFlashcardDeck = (deckId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    const response = await getWithToken(route)

    const deck = response.data.data || response.data.deck
    dispatch(setDetail(deck))
    if (onSuccess) onSuccess()
    return deck
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: false }))
  }
}
