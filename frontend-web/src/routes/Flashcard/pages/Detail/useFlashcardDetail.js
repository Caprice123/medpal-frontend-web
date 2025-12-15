import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startFlashcardDeck, submitFlashcardProgress, clearSession } from '@store/session/action'
import { FlashcardRoute } from '../../routes'

export const useFlashcardDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const { topicSnapshot, loading } = useSelector(state => state.session)
  const [isStarting, setIsStarting] = useState(false)

  // Start the deck when component mounts
  useEffect(() => {
    const startDeck = async () => {
      try {
        setIsStarting(true)

        // Clear previous session data
        dispatch(clearSession())

        // Start flashcard deck
        await dispatch(startFlashcardDeck(id))
      } catch (error) {
        console.error('Error starting flashcard:', error)
        alert('Gagal memulai flashcard: ' + (error.message || 'Terjadi kesalahan'))
        // Navigate back to list on error
        navigate(FlashcardRoute.initialRoute)
      } finally {
        setIsStarting(false)
      }
    }

    startDeck()
  }, [dispatch, id, navigate])

  const handleSubmitAnswers = async (answers) => {
    try {
      // Submit answers to update spaced repetition data
      await dispatch(submitFlashcardProgress(id, answers))

      alert('Sesi selesai! Progress Anda telah disimpan.')

      // Navigate back to list
      navigate(FlashcardRoute.initialRoute)
    } catch (error) {
      console.error('Failed to submit answers:', error)
      alert('Gagal menyimpan progress: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleBackToDeckList = () => {
    // Clear session state when going back
    dispatch(clearSession())
    navigate(FlashcardRoute.initialRoute)
  }

  return {
    topicSnapshot,
    loading,
    isStarting,
    handleSubmitAnswers,
    handleBackToDeckList
  }
}
