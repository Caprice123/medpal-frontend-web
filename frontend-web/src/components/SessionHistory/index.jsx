import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessions } from '@store/session/action'
import {
  Container,
  Header,
  Title,
  Subtitle,
  SessionList,
  SessionCard,
  SessionHeader,
  SessionInfo,
  SessionTitle,
  SessionDate,
  ScoreBadge,
  SessionStats,
  Stat,
  StatusBadge,
  EmptyState,
  LoadingContainer,
  LoadingSpinner
} from './SessionHistory.styles'

function SessionHistory({ onSessionClick }) {
  const dispatch = useDispatch()
  const { sessions, pagination } = useSelector(state => state.session)
  const { isLoadingSessions } = useSelector(state => state.session.loading)

  useEffect(() => {
    dispatch(fetchSessions())
  }, [dispatch])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (startedAt, completedAt) => {
    if (!completedAt) return '-'

    const start = new Date(startedAt)
    const end = new Date(completedAt)
    const durationMinutes = Math.floor((end - start) / 1000 / 60)

    if (durationMinutes < 1) return '< 1 menit'
    if (durationMinutes < 60) return `${durationMinutes} menit`

    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return `${hours} jam ${minutes} menit`
  }

  if (isLoadingSessions) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat riwayat sesi...
          </div>
        </LoadingContainer>
      </Container>
    )
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Container>
        <EmptyState>
          <div>📚</div>
          <h3>Belum Ada Riwayat</h3>
          <p>Mulai latihan soal pertama Anda untuk melihat riwayat di sini</p>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Riwayat Latihan</Title>
        <Subtitle>
          {pagination.total} sesi latihan
        </Subtitle>
      </Header>

      <SessionList>
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            onClick={() => onSessionClick && onSessionClick(session)}
          >
            <SessionHeader>
              <SessionInfo>
                <SessionTitle>{session.topic_title}</SessionTitle>
                <SessionDate>{formatDate(session.started_at)}</SessionDate>
              </SessionInfo>
              <ScoreBadge percentage={session.percentage}>
                {session.percentage}%
              </ScoreBadge>
            </SessionHeader>

            <SessionStats>
              <Stat>
                <span>{session.score}/{session.total_questions}</span>
                Benar
              </Stat>
              <Stat>
                <span>{session.total_answered}</span>
                Dijawab
              </Stat>
              <Stat>
                <span>{session.credits_used}</span>
                Kredit
              </Stat>
              <Stat>
                <span>{formatDuration(session.started_at, session.completed_at)}</span>
                Durasi
              </Stat>
              <StatusBadge status={session.status}>
                {session.status === 'completed' ? '✓ Selesai' : '◷ Aktif'}
              </StatusBadge>
            </SessionStats>
          </SessionCard>
        ))}
      </SessionList>
    </Container>
  )
}

export default SessionHistory
