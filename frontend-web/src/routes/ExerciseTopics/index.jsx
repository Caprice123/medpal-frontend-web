import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchExerciseTopics } from '@store/exercise/action'
import { fetchCreditBalance } from '@store/credit/action'
import { createExerciseSession } from '@store/session/action'
import {
  Container,
  Header,
  BackButton,
  Title,
  Subtitle,
  CreditBadge,
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
} from './ExerciseTopics.styles'

function ExerciseTopics() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { topics, isLoading } = useSelector(state => state.exercise)
  const { balance } = useSelector(state => state.credit)
  const [exerciseCost, setExerciseCost] = useState(10) // Default cost

  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  useEffect(() => {
    // Fetch exercise topics and credit balance
    dispatch(fetchExerciseTopics())
    dispatch(fetchCreditBalance())
  }, [dispatch])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
    // Re-fetch with filters
    dispatch(fetchExerciseTopics({ [filterType]: value }))
  }

  const handleStartSession = async (topic) => {
    if (balance < exerciseCost) {
      alert('Kredit tidak mencukupi! Silakan isi ulang untuk melanjutkan.')
      navigate('/dashboard')
      return
    }

    try {
      // Create exercise session
      const sessionData = await dispatch(createExerciseSession(topic.id))

      // Show success alert
      alert(`Sesi latihan dimulai! ${exerciseCost} kredit dikurangkan.`)

      // Navigate to exercise player
      navigate(`/exercise-player/${sessionData.session_id}`)
    } catch (error) {
      alert('Gagal membuat sesi: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  // Get unique universities and semesters for filters
  const universities = [...new Set(
    topics.flatMap(t => t.tags.filter(tag => tag.type === 'university').map(tag => tag.name))
  )]

  const semesters = [...new Set(
    topics.flatMap(t => t.tags.filter(tag => tag.type === 'semester').map(tag => tag.name))
  )].sort()

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat topik latihan...
          </div>
        </LoadingContainer>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <div>
          <BackButton onClick={() => navigate('/dashboard')}>
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

      {topics.length === 0 ? (
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
                  onClick={() => handleStartSession(topic)}
                  disabled={balance < exerciseCost}
                >
                  Mulai Latihan
                </StartButton>
              </TopicFooter>
            </TopicCard>
          ))}
        </TopicGrid>
      )}
    </Container>
  )
}

export default ExerciseTopics
