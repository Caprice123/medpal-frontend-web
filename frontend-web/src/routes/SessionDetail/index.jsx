import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionDetail } from '@store/session/action'
import ExerciseSessionPage from './subpages/ExerciseSession'
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

function SessionDetail() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentSession } = useSelector(state => state.session)
  const { isLoadingDetail } = useSelector(state => state.session.loading)

  useEffect(() => {
    // Fetch session detail
    const loadSession = async () => {
      try {
        await dispatch(fetchSessionDetail(sessionId))
      } catch (error) {
        console.error('Failed to load session:', error)
        alert('Gagal memuat sesi')
        navigate('/dashboard')
      }
    }

    loadSession()
  }, [dispatch, sessionId, navigate])

  if (isLoadingDetail || !currentSession) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  // Route to appropriate subpage based on session type
  // For now, we only have exercise type
  return <ExerciseSessionPage sessionId={sessionId} />
}

export default SessionDetail
