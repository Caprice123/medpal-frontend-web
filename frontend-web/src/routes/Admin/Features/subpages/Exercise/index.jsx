import { useDispatch, useSelector } from 'react-redux'
import { useExerciseSection } from './hooks/useExerciseSection'
import { fetchExerciseTopic, fetchAdminExerciseTopics } from '@store/exercise/action'
import TopicModal from './components/TopicModal'
import ExerciseSettingsModal from './components/ExerciseSettingsModal'
import ExerciseList from './components/ExerciseList'
import { Filter } from './components/Filter'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  ActionButton
} from './Exercise.styles'

function LatihanSoal({ onBack }) {
  const dispatch = useDispatch()
  const { filters } = useSelector(state => state.exercise)

  const {
    uiState,
    setUiState,
  } = useExerciseSection()

  const handleEditTopic = async (topic) => {
    try {
      const fullTopic = await dispatch(fetchExerciseTopic(topic.id))
      setUiState({
        ...uiState,
        isTopicModalOpen: true,
        mode: "update",
        selectedTopic: fullTopic
      })
    } catch (error) {
      console.error('Failed to fetch topic details:', error)
      alert('Failed to load topic details')
    }
  }

  const handleTopicSubmit = async () => {
    await dispatch(fetchAdminExerciseTopics(filters))
    setUiState({
      ...uiState,
      isTopicModalOpen: false,
      mode: null,
      selectedTopic: null
    })
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>← Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Latihan Soal</Title>
          </TitleSection>
          <Actions>
            <ActionButton
              secondary
              onClick={() => setUiState({ ...uiState, isFeatureSettingOpen: true })}
            >
              Pengaturan
            </ActionButton>
            <ActionButton
              onClick={() => setUiState({
                ...uiState,
                isTopicModalOpen: true,
                mode: "create",
                selectedTopic: null
              })}
            >
              + Tambah Topik Baru
            </ActionButton>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <ExerciseList
        onEdit={handleEditTopic}
        onDelete={(id) => {
          // Handle delete
        }}
        onCreateFirst={() => setUiState({
          ...uiState,
          isTopicModalOpen: true,
          mode: "create",
          selectedTopic: null
        })}
      />

      {uiState.isTopicModalOpen && (
        <TopicModal
          isOpen={uiState.isTopicModalOpen}
          onClose={() => setUiState({
            ...uiState,
            isTopicModalOpen: false,
            mode: null,
            selectedTopic: null
          })}
          onSuccess={handleTopicSubmit}
          topicToEdit={uiState.selectedTopic}
        />
      )}

      {uiState.isFeatureSettingOpen && (
        <ExerciseSettingsModal
          isOpen={uiState.isFeatureSettingOpen}
          onClose={() => setUiState({ ...uiState, isFeatureSettingOpen: false })}
        />
      )}
    </Container>
  )
}

export default LatihanSoal
