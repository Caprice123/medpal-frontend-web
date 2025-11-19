import { useDispatch, useSelector } from 'react-redux'
import { createNewFlashcardAttempt } from '@store/session/action'
import { fetchFlashcardAttemptDetail } from '../../../../../../store/session/action'

export const useFlashcardAttemptHistory = (setCurrentView) => {
  const dispatch = useDispatch()
  const { sessionDetail } = useSelector(state => state.session)

  const handleTryAgain = async () => {
    try {
        const newAttempt = await dispatch(createNewFlashcardAttempt(sessionDetail.id))
        dispatch(fetchFlashcardAttemptDetail(newAttempt.attempt.id))
        setCurrentView("flashcard_exercise")
    } catch (error) {
      console.error('Error creating new attempt:', error)
      alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  return {
    handleTryAgain
  }
}
