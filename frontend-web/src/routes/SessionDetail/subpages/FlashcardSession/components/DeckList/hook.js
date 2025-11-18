import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startFlashcardWithDeck, fetchFlashcardAttempts } from '@store/session/action'

export const useDeckList = () => {
  const dispatch = useDispatch()
  const { sessionDetail } = useSelector(state => state.session)
  const { sessionAttempts } = useSelector(state => state.session)

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleStartDeck = async (deck) => {
    try {
      if (!sessionAttempts || sessionAttempts.length === 0) {
        throw new Error('No active attempt found')
      }

      const currentAttempt = sessionAttempts[0]

      await dispatch(startFlashcardWithDeck(
        sessionDetail.id,
        currentAttempt.id,
        deck.id
      ))

      // Refresh attempts to get the updated attempt with deck_id
      await dispatch(fetchFlashcardAttempts(sessionDetail.id, 1, 30))
    } catch (error) {
      console.error('Error starting flashcard session:', error)
      alert('Gagal memulai sesi: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  return {
    filters,
    handleFilterChange,
    handleStartDeck
  }
}
