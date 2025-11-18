import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewFlashcardAttempt, fetchFlashcardAttempts } from '@store/session/action'
import { fetchFlashcardDecks } from '@store/flashcard/action'
import { fetchCreditBalance } from '@store/credit/action'

export const useFlashcardAttemptHistory = (setSelectedAttempt) => {
  const dispatch = useDispatch()
  const { sessionDetail } = useSelector(state => state.session)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 30

  const handleTryAgain = async () => {
    try {
      const newAttempt = await dispatch(createNewFlashcardAttempt(sessionDetail.id))

      // Refresh attempts list to include the new attempt
      await dispatch(fetchFlashcardAttempts(sessionDetail.id, currentPage, perPage))

      // Fetch decks for selection
      await dispatch(fetchFlashcardDecks())
      await dispatch(fetchCreditBalance())

      // Clear selected attempt so it shows deck selection
      setSelectedAttempt(null)
    } catch (error) {
      console.error('Error creating new attempt:', error)
      alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  return {
    currentPage,
    setCurrentPage,
    handleTryAgain
  }
}
