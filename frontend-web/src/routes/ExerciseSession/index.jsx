import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionDetail } from '@store/session/action'
import ExercisePlayer from '@components/ExercisePlayer'
import SessionResults from '@components/SessionResults'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0fdfa;
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #0891b2;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

function ExerciseSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentSession, topicSnapshot } = useSelector(state => state.session)
  const { isLoadingDetail } = useSelector(state => state.session.loading)
  const sessionComplete = currentSession?.status === 'completed'

  useEffect(() => {
    // If no session data in Redux, fetch it
    if (!currentSession || currentSession.id !== parseInt(sessionId)) {
      dispatch(fetchSessionDetail(sessionId))
    }
  }, [dispatch, sessionId, currentSession])

  const handleComplete = () => {
    // Refresh session data to get final results
    dispatch(fetchSessionDetail(sessionId))
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  if (isLoadingDetail || !currentSession || !topicSnapshot) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  // Show results if session is completed
  if (sessionComplete) {
    return (
      <SessionResults
        session={currentSession}
        onTryAgain={() => navigate('/exercise-topics')}
        onViewHistory={handleBackToDashboard}
      />
    )
  }

  // Show exercise player for active session
  return <ExercisePlayer onComplete={handleComplete} />
}

export default ExerciseSession
