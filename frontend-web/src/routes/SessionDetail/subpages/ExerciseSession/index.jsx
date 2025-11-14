import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchExerciseTopics } from '@store/exercise/action'
import { fetchCreditBalance } from '@store/credit/action'
import { startExerciseWithTopic, submitAnswer, nextQuestion, completeSession } from '@store/session/action'
import ExercisePlayer from './ExercisePlayer'
import SessionResults from '@components/SessionResults'
import {
  Container,
  Header,
  BackButton,
  Title,
  Subtitle,
  CreditBadge,
  TopicSelectionContainer,
  FilterSection,
  FilterGroup,
  FilterLabel,
  Select,
  TopicGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  TopicDescription,
  TagContainer,
  Tag,
  TopicFooter,
  QuestionCount,
  CostBadge,
  StartButton,
  EmptyState,
  LoadingContainer,
  LoadingSpinner
} from './ExerciseSession.styles'

function ExerciseSession({ sessionId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentSession, topicSnapshot } = useSelector(state => state.session)
  const { topics, isLoading } = useSelector(state => state.exercise)
  const { balance } = useSelector(state => state.credit)

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })
  const [exerciseCost, setExerciseCost] = useState(10) // Will be fetched from constants

  useEffect(() => {
    // Fetch topics and credit balance when status is not_started
    if (currentSession?.status === 'not_started') {
      dispatch(fetchExerciseTopics())
      dispatch(fetchCreditBalance())
    }
  }, [dispatch, currentSession?.status])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    dispatch(fetchExerciseTopics({ [filterType]: value }))
  }

  const handleStartTopic = async (topic) => {
    if (balance < exerciseCost) {
      alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
      navigate('/dashboard')
      return
    }

    try {
      await dispatch(startExerciseWithTopic(sessionId, topic.id))
      alert(`Sesi latihan dimulai! ${exerciseCost} kredit dikurangkan.`)
    } catch (error) {
      alert('Gagal memulai latihan: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleComplete = async () => {
    try {
      await dispatch(completeSession(sessionId))
    } catch (error) {
      console.error('Failed to complete session:', error)
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  // Get unique universities and semesters for filters
  const universities = [...new Set(
    topics.flatMap(t => t.tags.filter(tag => tag.type === 'university').map(tag => tag.name))
  )]

  const semesters = [...new Set(
    topics.flatMap(t => t.tags.filter(tag => tag.type === 'semester').map(tag => tag.name))
  )].sort()

  // Show loading state
  if (!currentSession) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  // Show results if completed
  if (currentSession.status === 'completed') {
    return (
      <SessionResults
        session={currentSession}
        onTryAgain={handleBackToDashboard}
        onViewHistory={handleBackToDashboard}
      />
    )
  }

  // Show player if active
  if (currentSession.status === 'active' && topicSnapshot) {
    return <ExercisePlayer sessionId={sessionId} onComplete={handleComplete} />
  }

  // Show topic selection if not_started
  if (currentSession.status === 'not_started') {
    return (
      <Container>
        <Header>
          <div>
            <BackButton onClick={handleBackToDashboard}>
              ← Kembali ke Dashboard
            </BackButton>
            <Title>Pilih Topik Latihan</Title>
            <Subtitle>
              Pilih topik latihan soal untuk meningkatkan pemahaman Anda
            </Subtitle>
          </div>
          <CreditBadge>
            💎 {balance} Kredit
          </CreditBadge>
        </Header>

        <TopicSelectionContainer>
          <FilterSection>
            <FilterGroup>
              <FilterLabel>Universitas</FilterLabel>
              <Select
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="">Semua Universitas</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Semester</FilterLabel>
              <Select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <option value="">Semua Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterSection>

          {isLoading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <div style={{ marginTop: '1rem', color: '#6b7280' }}>
                Memuat topik...
              </div>
            </LoadingContainer>
          ) : topics.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3>Belum Ada Topik</h3>
              <p>Belum ada topik latihan yang tersedia saat ini</p>
            </EmptyState>
          ) : (
            <TopicGrid>
              {topics.map((topic) => (
                <TopicCard key={topic.id}>
                  <TopicHeader>
                    <TopicTitle>{topic.title}</TopicTitle>
                    <TopicDescription>{topic.description || 'Tidak ada deskripsi'}</TopicDescription>
                  </TopicHeader>

                  <TagContainer>
                    {topic.tags && topic.tags.map((tag, index) => (
                      <Tag key={index} type={tag.type}>
                        {tag.name}
                      </Tag>
                    ))}
                  </TagContainer>

                  <TopicFooter>
                    <div>
                      <QuestionCount>
                        {topic.questionCount || topic.questions?.length || 0} Soal
                      </QuestionCount>
                      <CostBadge>
                        💎 {exerciseCost} kredit
                      </CostBadge>
                    </div>
                    <StartButton
                      onClick={() => handleStartTopic(topic)}
                      disabled={balance < exerciseCost}
                    >
                      Mulai Latihan
                    </StartButton>
                  </TopicFooter>
                </TopicCard>
              ))}
            </TopicGrid>
          )}
        </TopicSelectionContainer>
      </Container>
    )
  }

  return null
}

export default ExerciseSession
