import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlashcardAttempts, fetchFlashcardAttemptDetail } from '@store/session/action'
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

function FlashcardSession({ sessionId }) {
    const dispatch = useDispatch()

    const sessionState = useSelector(state => state.session)
    const { sessionAttempts: attempts, attemptDetail, loading } = sessionState
    const { isLoadingAttempts, isLoadingAttemptDetail } = loading || {}

    const [currentView, setCurrentView] = useState(null) // 'select_flashcard_decks', 'list_attempts', 'flashcard_exercise', 'attempt_results'

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 30

    // Step 1: Fetch attempts when we have the session detail or page changes
    useEffect(() => {
        dispatch(fetchFlashcardAttempts(sessionId, currentPage, perPage))
    }, [dispatch, sessionId, currentPage, perPage])

    // Step 2: Determine what data to fetch based on attempts
    useEffect(() => {
        if (!attempts || attempts.length === 0) return

        // Check the latest attempt (first in array, ordered desc)
        const activeAttempt = attempts.find(attempt => attempt.status === "active")
        if (attempts.length === 1 && attempts[0].status === 'not_started') {
            // If the latest attempt is not_started (no deck selected yet), show deck selection
            dispatch(fetchFlashcardDecks())
            dispatch(fetchCreditBalance())
            setCurrentView('select_flashcard_decks')
        } else if (activeAttempt) {
            // If the latest attempt is active (deck selected but not completed), show flashcard player
            dispatch(fetchFlashcardAttemptDetail(activeAttempt.id))
            setCurrentView('flashcard_exercise')
        } else {
            // Latest attempt is completed, show attempt list
            setCurrentView('list_attempts')
        }
    }, [dispatch, attempts])

  // Show loading state
    if (!sessionId || isLoadingAttempts) {
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
    if (currentView === 'attempt_results') {
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
                currentPage={currentPage}
                perPage={perPage}
                setCurrentView={setCurrentView}
                setCurrentPage={setCurrentPage}
            />
        )
    }

    // If there's an active attempt, show FlashcardPlayer immediately
    if (currentView == 'flashcard_exercise') {
        if (isLoadingAttemptDetail || !attemptDetail) {
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
            <FlashcardPlayer setCurrentView={setCurrentView} />
        )
    }

    // If the latest attempt is not_started (no deck_id), show deck selection
    if (currentView == "select_flashcard_decks") {
        return (
            <DeckList />
        )
    }

    // Otherwise, show list of all attempts
    if (currentView == "list_attempts") {
        return (
            <FlashcardAttemptHistory currentPage={currentPage} setCurrentPage={setCurrentPage} setCurrentView={setCurrentView} />
        )
    }
}

export default FlashcardSession
