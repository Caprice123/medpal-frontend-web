import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchExerciseTopics,
  fetchExerciseTags,
  generateQuestions,
  createExerciseTopic,
  updateExerciseFilters,
  clearExerciseFilters
} from '@store/exercise/action'
import TopicModal from './components/TopicModal'
import QuestionPreviewModal from './components/QuestionPreviewModal'
import TagManagementModal from './components/TagManagementModal'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  IconLarge,
  Title,
  AddTopicButton,
  FilterSection,
  FilterTitle,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ClearFiltersButton,
  TopicsGrid,
  TopicCard,
  TopicHeader,
  TopicTitle,
  TopicType,
  TopicDescription,
  TopicTags,
  TopicTag,
  TopicStats,
  StatItem,
  EmptyState
} from './LatihanSoal.styles'

function LatihanSoal({ onBack }) {
  const dispatch = useDispatch()

  // Redux state
  const {
    topics,
    tags,
    generatedQuestions,
    filters,
    loading
  } = useSelector(state => state.exercise)

  // Local state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [generatingStatus, setGeneratingStatus] = useState('')

  // Fetch topics and tags on mount
  useEffect(() => {
    dispatch(fetchExerciseTopics(filters))
    dispatch(fetchExerciseTags())
  }, [])

  const handleCreateTopic = async (topicData) => {
    try {
      setGeneratingStatus('Generating questions...')

      // Prepare content based on type
      let content = topicData.content
      if (topicData.type === 'pdf') {
        // TODO: Handle PDF upload and text extraction
        alert('PDF upload not yet implemented. Please use text input for now.')
        setGeneratingStatus('')
        return
      }

      // Generate questions using Redux action
      await dispatch(generateQuestions(content, topicData.type, 10))

      setSelectedTopic(topicData)
      setIsCreateModalOpen(false)
      setIsPreviewModalOpen(true)
    } catch (error) {
      console.error('Error generating questions:', error)
      alert('Gagal generate soal: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setGeneratingStatus('')
    }
  }

  const handleSaveQuestions = async (questions) => {
    try {
      setGeneratingStatus('Saving topic...')

      // Prepare topic data
      const topicData = {
        title: selectedTopic.title,
        description: selectedTopic.description || '',
        content_type: selectedTopic.type,
        content: selectedTopic.content || '',
        pdf_url: selectedTopic.pdf_url || '',
        tags: selectedTopic.tags,
        questions: questions.map((q, index) => ({
          question: q.question,
          answer: q.answer,
          explanation: q.explanation,
          order: index
        }))
      }

      // Create topic using Redux action
      await dispatch(createExerciseTopic(topicData))

      setIsPreviewModalOpen(false)
      setSelectedTopic(null)
      alert('Topik berhasil disimpan!')
    } catch (error) {
      console.error('Error saving topic:', error)
      alert('Gagal menyimpan topik: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setGeneratingStatus('')
    }
  }

  const handleTopicClick = (topic) => {
    // TODO: Show topic details and questions
    console.log('Topic clicked:', topic)
  }

  // Filter handling - topics are already filtered by backend
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    dispatch(updateExerciseFilters(newFilters))
    dispatch(fetchExerciseTopics(newFilters))
  }

  const handleClearFilters = () => {
    dispatch(clearExerciseFilters())
    dispatch(fetchExerciseTopics({}))
  }

  // Get tags by type from Redux
  const universityTags = tags.filter(tag => tag.type === 'university')
  const semesterTags = tags.filter(tag => tag.type === 'semester')

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          ←
        </BackButton>
        <HeaderContent>
          <TitleSection>
            <IconLarge>✏️</IconLarge>
            <Title>Latihan Soal - Topic Management</Title>
          </TitleSection>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <AddTopicButton onClick={() => setIsTagModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <span>🏷️</span>
              Kelola Tag
            </AddTopicButton>
            <AddTopicButton onClick={() => setIsCreateModalOpen(true)}>
              <span>+</span>
              Buat Topik Baru
            </AddTopicButton>
          </div>
        </HeaderContent>
      </Header>

      {(topics.length > 0 || filters.university || filters.semester) && (
        <FilterSection>
          <FilterTitle>🔍 Filter Topik</FilterTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Universitas</FilterLabel>
              <FilterSelect
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
              >
                <option value="">Semua Universitas</option>
                {universityTags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Semester</FilterLabel>
              <FilterSelect
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <option value="">Semua Semester</option>
                {semesterTags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <ClearFiltersButton
              onClick={handleClearFilters}
            >
              Reset Filter
            </ClearFiltersButton>
          </FilterGrid>
        </FilterSection>
      )}

      {topics.length > 0 ? (
        <TopicsGrid>
          {topics.map((topic) => (
            <TopicCard key={topic.id} onClick={() => handleTopicClick(topic)}>
              <TopicHeader>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicType type={topic.type}>
                  {topic.type === 'text' ? '📝 Text' : '📄 PDF'}
                </TopicType>
              </TopicHeader>
              <TopicDescription>{topic.description}</TopicDescription>

              {topic.tags && topic.tags.length > 0 && (
                <TopicTags>
                  {topic.tags.map(tag => (
                    <TopicTag key={tag.id} tagType={tag.type}>
                      {tag.name}
                    </TopicTag>
                  ))}
                </TopicTags>
              )}

              <TopicStats>
                <StatItem>
                  <span>❓</span>
                  {topic.questionCount} soal
                </StatItem>
                <StatItem>
                  <span>📅</span>
                  {new Date(topic.createdAt).toLocaleDateString('id-ID')}
                </StatItem>
              </TopicStats>
            </TopicCard>
          ))}
        </TopicsGrid>
      ) : topics.length > 0 ? (
        <EmptyState>
          <div>🔍</div>
          <h3>Tidak Ada Hasil</h3>
          <p>Tidak ada topik yang sesuai dengan filter yang dipilih</p>
        </EmptyState>
      ) : (
        <EmptyState>
          <div>📚</div>
          <h3>Belum Ada Topik</h3>
          <p>Klik "Buat Topik Baru" untuk membuat topik latihan soal pertama Anda</p>
        </EmptyState>
      )}

      <TopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTopic}
        isGenerating={!!generatingStatus}
      />

      <QuestionPreviewModal
        isOpen={isPreviewModalOpen}
        questions={generatedQuestions}
        topic={selectedTopic}
        onClose={() => setIsPreviewModalOpen(false)}
        onSave={handleSaveQuestions}
        isSaving={generatingStatus === 'Saving topic...'}
      />

      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />

      {generatingStatus && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            minWidth: '300px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #8b5cf6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#374151' }}>
              {generatingStatus}
            </p>
          </div>
        </div>
      )}
    </Container>
  )
}

export default LatihanSoal
