import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminExerciseTopics,
  fetchExerciseTopic,
  createExerciseTopic,
  updateExerciseFilters,
  clearExerciseFilters
} from '@store/exercise/action'
import { fetchTags } from '@store/tags/action'
import TopicModal from './components/TopicModal'
import TagManagementModal from './components/TagManagementModal'
import ExerciseSettingsModal from './components/ExerciseSettingsModal'
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
} from './Exercise.styles'
import { actions as tagActions } from '@store/tags/reducer'

function LatihanSoal({ onBack }) {
  const dispatch = useDispatch()

  // Redux state
  const {
    topics,
    filters,
    loading
  } = useSelector(state => state.exercise)

  const { tags } = useSelector(state => state.tags)

  // Local state
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [topicToEdit, setTopicToEdit] = useState(null)

  // Fetch topics and tags on mount
  useEffect(() => {
    dispatch(fetchAdminExerciseTopics(filters))
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handleOpenCreateModal = () => {
    setTopicToEdit(null)
    setIsTopicModalOpen(true)
  }

  const handleTopicClick = async (topic) => {
    try {
      // Fetch full topic detail with questions
      const fullTopic = await dispatch(fetchExerciseTopic(topic.id))
      setTopicToEdit(fullTopic)
      setIsTopicModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch topic details:', error)
      alert('Failed to load topic details')
    }
  }

  const handleCloseTopicModal = () => {
    setIsTopicModalOpen(false)
    setTopicToEdit(null)
  }

  const handleTopicSubmit = async () => {
    // Modal handles all the logic internally, just refresh the list
    await dispatch(fetchAdminExerciseTopics(filters))
    handleCloseTopicModal()
  }

  // Filter handling - topics are already filtered by backend
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    dispatch(updateExerciseFilters(newFilters))
    dispatch(fetchAdminExerciseTopics(newFilters))
  }

  const handleClearFilters = () => {
    dispatch(clearExerciseFilters())
    dispatch(fetchAdminExerciseTopics({}))
  }

  // Get tags by type from Redux
  const universityTags = tags.find(tag => tag.name === 'university')?.tags || []
  const semesterTags = tags.find(tag => tag.name === 'semester')?.tags || []

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
            <AddTopicButton onClick={() => setIsSettingsModalOpen(true)} style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}>
              <span>⚙️</span>
              Pengaturan
            </AddTopicButton>
            <AddTopicButton onClick={() => setIsTagModalOpen(true)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <span>🏷️</span>
              Kelola Tag
            </AddTopicButton>
            <AddTopicButton onClick={handleOpenCreateModal}>
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
        isOpen={isTopicModalOpen}
        onClose={handleCloseTopicModal}
        onSuccess={handleTopicSubmit}
        topicToEdit={topicToEdit}
      />

      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />

      <ExerciseSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </Container>
  )
}

export default LatihanSoal
