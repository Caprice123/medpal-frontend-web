import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlashcardAttempts, fetchFlashcardAttemptDetail, createNewFlashcardAttempt, completeFlashcardSession } from '@store/session/action'
import { fetchFlashcardDecks } from '@store/flashcard/action'
import { fetchCreditBalance } from '@store/credit/action'
import FlashcardPlayer from './components/FlashcardPlayer'
import SessionResults from './components/SessionResults'
import DeckList from './components/DeckList'
import FlashcardAttemptHistory from './components/FlashcardAttemptHistory'
import {
  LoadingContainer,
  LoadingSpinner
} from './FlashcardSession.styles'

function FlashcardSession({ sessionData }) {
  const dispatch = useDispatch()

  const sessionState = useSelector(state => state.session)
  const { sessionDetail, sessionAttempts: attempts, attemptDetail, loading } = sessionState
  const { isLoadingAttempts, isLoadingAttemptDetail } = loading || {}

  const [currentView, setCurrentView] = useState('auto') // 'auto', 'results'
  const [selectedAttempt, setSelectedAttempt] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 30

  // Use sessionData as sessionDetail if available
  const effectiveSessionDetail = sessionDetail || sessionData

  // Step 1: Fetch attempts when we have the session detail or page changes
  useEffect(() => {
    if (effectiveSessionDetail?.id) {
      const offset = (currentPage - 1) * itemsPerPage
      dispatch(fetchFlashcardAttempts(effectiveSessionDetail.id, itemsPerPage, offset))
    }
  }, [dispatch, effectiveSessionDetail?.id, currentPage, itemsPerPage])

  // Step 2: Determine what data to fetch based on attempts
  useEffect(() => {
    if (!attempts || attempts.length === 0) return

    const activeAttempt = attempts.find(attempt =>
      attempt.deck_id && !attempt.completed_at
    )

    if (activeAttempt) {
      // If there's an active attempt, fetch its detail for the flashcard player
      setSelectedAttempt(activeAttempt)
    } else if (attempts[0] && !attempts[0].deck_id && !attempts[0].completed_at) {
      // If the latest attempt is not_started, fetch decks and credit balance
      dispatch(fetchFlashcardDecks())
      dispatch(fetchCreditBalance())
    } else if (selectedAttempt) {
      // If we had a selected attempt, check if it's now completed
      const updatedAttempt = attempts.find(a => a.id === selectedAttempt.id)
      if (updatedAttempt && updatedAttempt.completed_at && !selectedAttempt.completed_at) {
        // Attempt just got completed, update it
        setSelectedAttempt(updatedAttempt)
      }
    }
    // Otherwise (multiple attempts or completed), we don't need to fetch anything yet
  }, [dispatch, attempts, selectedAttempt])

  useEffect(() => {
    if (!selectedAttempt) return

    dispatch(fetchFlashcardAttemptDetail(selectedAttempt.id))
  }, [selectedAttempt, dispatch])

  useEffect(() => {
    if (!selectedAttempt) return

    if (selectedAttempt.completed_at) {
      setCurrentView('results')
    }
  }, [selectedAttempt, attempts])

  const handleTryAgain = async () => {
    try {
      const newAttempt = await dispatch(createNewFlashcardAttempt(effectiveSessionDetail.id))

      // Refresh attempts list to include the new attempt
      const offset = (currentPage - 1) * itemsPerPage
      await dispatch(fetchFlashcardAttempts(effectiveSessionDetail.id, itemsPerPage, offset))

      // Fetch decks for selection
      await dispatch(fetchFlashcardDecks())
      await dispatch(fetchCreditBalance())

      // Reset view and clear selected attempt so it shows deck selection
      setCurrentView('auto')
      setSelectedAttempt(null)
    } catch (error) {
      alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleViewAttemptsList = () => {
    setCurrentView('auto')
    setSelectedAttempt(null)
  }

  // Show loading state
  if (!effectiveSessionDetail || isLoadingAttempts) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  // ===== VIEW LOGIC BASED ON FLOW =====
  // If viewing specific attempt results
  if (currentView === 'results' && selectedAttempt) {
    if (isLoadingAttemptDetail || !attemptDetail) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat hasil...
          </div>
        </LoadingContainer>
      )
    }

    return (
      <SessionResults
        attemptMetadata={selectedAttempt}
        attemptDetail={attemptDetail}
        onTryAgain={handleTryAgain}
        onViewHistory={handleViewAttemptsList}
      />
    )
  }

  // If there's an active attempt, show FlashcardPlayer immediately
  if (selectedAttempt && selectedAttempt.deck_id && !selectedAttempt.completed_at) {
    if (!attemptDetail || !attemptDetail.cards?.length) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat kartu...
          </div>
        </LoadingContainer>
      )
    }

    return (
      <FlashcardPlayer
        deckSnapshot={attemptDetail}
        attemptId={selectedAttempt.id}
        onComplete={async (answers) => {
          try {
            // Complete the flashcard session with answers
            await dispatch(completeFlashcardSession(selectedAttempt.id, answers))

            // Refresh attempts to get updated status and metadata
            const offset = (currentPage - 1) * itemsPerPage
            await dispatch(fetchFlashcardAttempts(effectiveSessionDetail.id, itemsPerPage, offset))

            // The useEffect will detect the completed attempt and switch to results view
          } catch (error) {
            console.error('Error completing flashcard session:', error)
            alert('Gagal menyelesaikan sesi: ' + (error.message || 'Terjadi kesalahan'))
          }
        }}
      />
    )
  }

  // If the latest attempt is not_started (no deck_id), show deck selection
  if (attempts.length > 0 && attempts[0] && !attempts[0].deck_id && !attempts[0].completed_at) {
    return (
      <DeckList />
    )
  }

  // Otherwise, show list of all attempts
  return (
    <FlashcardAttemptHistory
      setSelectedAttempt={setSelectedAttempt}
      setCurrentView={setCurrentView}
    />
  )
}

export default FlashcardSession
