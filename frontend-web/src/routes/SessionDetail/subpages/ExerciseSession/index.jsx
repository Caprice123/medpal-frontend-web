import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExerciseTopics } from '@store/exercise/action'
import { fetchCreditBalance } from '@store/credit/action'
import { fetchSessionAttempts, createNewAttempt, fetchSessionAttemptDetail } from '@store/session/action'
import ExercisePlayer from './components/ExercisePlayer'
import SessionResults from './components/SessionResults'
import {
  LoadingContainer,
  LoadingSpinner
} from './ExerciseSessionSubpage.styles'
import TopicList from './components/TopicList'
import AttemptHistory from './components/AttemptHistory'

function ExerciseSessionSubpage({ sessionId }) {
  const dispatch = useDispatch()

  const sessionState = useSelector(state => state.session)
  const { sessionDetail, sessionAttempts: attempts, attemptDetail, loading } = sessionState
  const { isLoadingAttempts, isLoadingAttemptDetail } = loading

  const [currentView, setCurrentView] = useState('auto') // 'auto', 'results'
  const [selectedAttempt, setSelectedAttempt] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 30

  // Step 1: Fetch attempts when we have the session detail or page changes
  useEffect(() => {
    if (sessionDetail?.id) {
      dispatch(fetchSessionAttempts(sessionDetail.id, currentPage, perPage))
    }
  }, [dispatch, sessionDetail?.id, currentPage, perPage])

  // Step 2: Determine what data to fetch based on attempts
  useEffect(() => {
    if (!attempts || attempts.length === 0) return

    const activeAttempt = attempts.find(attempt => attempt.status === "active")

    if (activeAttempt) {
      // If there's an active attempt, fetch its detail for the exercise player
      setSelectedAttempt(activeAttempt)
    //   dispatch(fetchSessionAttemptDetail(activeAttempt.id))
    } else if (attempts.length === 1 && attempts[0].status === 'not_started') {
      // If there's only 1 not_started attempt, fetch topics and credit balance
      dispatch(fetchExerciseTopics())
      dispatch(fetchCreditBalance())
    }
    // Otherwise (multiple attempts or completed), we don't need to fetch anything yet
  }, [dispatch, attempts])

  useEffect(() => {
    if (!selectedAttempt) return

    dispatch(fetchSessionAttemptDetail(selectedAttempt.id))
  }, [selectedAttempt, dispatch])

  useEffect(() => {
    if (!selectedAttempt) return

    if (selectedAttempt.status == "completed") {
        setCurrentView('results')
    }
  }, [selectedAttempt, attempts])


  const handleTryAgain = async () => {
    try {
      const newAttempt = await dispatch(createNewAttempt(sessionId))
      setSelectedAttempt(newAttempt.attempt)
    } catch (error) {
      alert('Gagal membuat attempt baru: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleViewAttemptsList = () => {
    setCurrentView('auto')
    setSelectedAttempt(null)
  }

  // Show loading state
  if (!sessionDetail || isLoadingAttempts) {
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
    if (isLoadingAttemptDetail || !attemptDetail || !attemptDetail.questions?.length) {
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

  // If there's an active attempt, show ExercisePlayer immediately
  if (selectedAttempt) {
    if (!attemptDetail || !attemptDetail.questions?.length) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat soal...
          </div>
        </LoadingContainer>
      )
    }

    return (
      <ExercisePlayer
        attemptId={selectedAttempt.id}
        onComplete={async (attempt) => {
            setSelectedAttempt(attempt)
          // Fetch the attempt detail for results
        //   await dispatch(fetchSessionAttemptDetail(attemptId))

          // Refresh attempts to get updated status and metadata
          await dispatch(fetchSessionAttempts(sessionDetail.id, currentPage, perPage))

          // Set flag to show results (useEffect will handle finding the attempt)
        //   setCompletedAttemptId(attemptId)
        }}
      />
    )
  }

  // If there's only 1 attempt and it's not_started, show topic selection
  if (attempts.length === 1 && attempts[0].status === 'not_started') {
    return (
      <TopicList />
    )
  }

  // Otherwise, show list of all attempts
  return (
    <AttemptHistory setSelectedAttempt={setSelectedAttempt} setCurrentView={setCurrentView} />
  )
}

export default ExerciseSessionSubpage
