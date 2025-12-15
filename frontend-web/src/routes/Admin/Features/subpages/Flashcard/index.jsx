import { useDispatch, useSelector } from 'react-redux'
import { useFlashcardSection } from './hooks/useFlashcardSection'
import { actions } from '@store/flashcard/reducer'
import { fetchAdminFlashcardDecks, fetchFlashcardDeck } from '@store/flashcard/adminAction'
import CreateFlashcardModal from './components/CreateFlashcardModal'
import UpdateFlashcardModal from './components/UpdateFlashcardModal'
import FlashcardSettingsModal from './components/FlashcardSettingsModal'
import FlashcardList from './components/FlashcardList'
import Pagination from '@components/Pagination'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  Title,
  Actions,
  ActionButton
} from './Flashcard.styles'
import { Filter } from './components/Filter'

function FlashcardAdminPage({ onBack }) {
  const dispatch = useDispatch()
  const { pagination, loading } = useSelector(state => state.flashcard)

  const {
    uiState,
    setUiState,
  } = useFlashcardSection()

  const handlePageChange = (page) => {
    dispatch(actions.setPage(page))
    dispatch(fetchAdminFlashcardDecks())
  }

  const handleEditFlashcard = async (deck) => {
    await dispatch(fetchFlashcardDeck(deck.id, () => {
      setUiState({
        ...uiState,
        isDeckModalOpen: true,
        mode: "update",
      })
    }))
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>← Back</BackButton>
        <HeaderContent>
          <TitleSection>
            <Title>Kelola Flashcard</Title>
          </TitleSection>
          <Actions>
            <ActionButton secondary onClick={() => setUiState({ ...uiState, isFeatureSettingOpen: true })}>
              Pengaturan
            </ActionButton>
            <ActionButton onClick={() => setUiState({ ...uiState, isDeckModalOpen: true, mode: "create" })}>
              + Tambah Deck Baru
            </ActionButton>
          </Actions>
        </HeaderContent>
      </Header>

      <Filter />

      <FlashcardList
        onEdit={handleEditFlashcard}
        onDelete={(id) => {
          // Handle delete
        }}
        onCreateFirst={() => setUiState({ ...uiState, isDeckModalOpen: true, mode: "create", selectedDeck: null })}
      />

      <Pagination
        currentPage={pagination.page}
        isLastPage={pagination.isLastPage}
        onPageChange={handlePageChange}
        isLoading={loading.isGetListDecksLoading}
        variant="admin"
        language="id"
      />

      { uiState.isDeckModalOpen && uiState.mode === "create" && (
        <CreateFlashcardModal onClose={() => setUiState({ ...uiState, isDeckModalOpen: false, mode: null, selectedDeck: null })} />
      )}

      { uiState.isDeckModalOpen && uiState.mode === "update" && (
        <UpdateFlashcardModal onClose={() => setUiState({ ...uiState, isDeckModalOpen: false, mode: null, selectedDeck: null })} />
      )}

      { uiState.isFeatureSettingOpen && (
        <FlashcardSettingsModal onClose={() => setUiState(prev => ({...prev, isFeatureSettingOpen: false}))} />
      )}
    </Container>
  )
}

export default FlashcardAdminPage
