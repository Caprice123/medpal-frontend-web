import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminFlashcardDecks,
  fetchFlashcardDeck,
  deleteFlashcardDeck
} from '@store/flashcard/action'
import { fetchTags } from '@store/tags/action'
import DeckModal from './components/DeckModal'
import TagManagementModal from '../Exercise/components/TagManagementModal'
import FlashcardSettingsModal from './components/FlashcardSettingsModal'
import {
  Container,
  Header,
  BackButton,
  HeaderContent,
  TitleSection,
  IconLarge,
  Title,
  AddDeckButton,
  FilterSection,
  FilterTitle,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ClearFiltersButton,
  DecksGrid,
  DeckCard,
  DeckHeader,
  DeckTitle,
  DeckType,
  DeckDescription,
  DeckTags,
  DeckTag,
  DeckStats,
  StatItem,
  EmptyState
} from './Flashcard.styles'
import { actions as tagActions } from '@store/tags/reducer'

function FlashcardAdminPage({ onBack }) {
  const dispatch = useDispatch()

  // Redux state
  const { decks, filters, loading } = useSelector(state => state.flashcard)
  const { tags } = useSelector(state => state.tags)

  // Local state
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [deckToEdit, setDeckToEdit] = useState(null)

  // Fetch decks and tags on mount
  useEffect(() => {
    dispatch(fetchAdminFlashcardDecks(filters))
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [])

  const handleOpenCreateModal = () => {
    setDeckToEdit(null)
    setIsDeckModalOpen(true)
  }

  const handleDeckClick = async (deck) => {
    try {
      // Fetch full deck detail with cards
      const fullDeck = await dispatch(fetchFlashcardDeck(deck.id))
      setDeckToEdit(fullDeck)
      setIsDeckModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch deck details:', error)
      alert('Failed to load deck details')
    }
  }

  const handleCloseDeckModal = () => {
    setIsDeckModalOpen(false)
    setDeckToEdit(null)
  }

  const handleDeckSubmit = async () => {
    // Modal handles all the logic internally, just refresh the list
    await dispatch(fetchAdminFlashcardDecks(filters))
    handleCloseDeckModal()
  }

  // Filter handling
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value }
    dispatch(fetchAdminFlashcardDecks(newFilters))
  }

  const handleClearFilters = () => {
    dispatch(fetchAdminFlashcardDecks({}))
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
            <IconLarge>🎴</IconLarge>
            <Title>Flashcard Belajar - Deck Management</Title>
          </TitleSection>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <AddDeckButton
              onClick={() => setIsSettingsModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #64748b, #475569)' }}
            >
              <span>⚙️</span>
              Pengaturan
            </AddDeckButton>
            <AddDeckButton
              onClick={() => setIsTagModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <span>🏷️</span>
              Kelola Tag
            </AddDeckButton>
            <AddDeckButton onClick={handleOpenCreateModal}>
              <span>+</span>
              Buat Deck Baru
            </AddDeckButton>
          </div>
        </HeaderContent>
      </Header>

      {(decks.length > 0 || filters.university || filters.semester) && (
        <FilterSection>
          <FilterTitle>🔍 Filter Deck</FilterTitle>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Universitas</FilterLabel>
              <FilterSelect
                value={filters.university || ''}
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
                value={filters.semester || ''}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
              >
                <option value="">Semua Semester</option>
                {semesterTags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </FilterSelect>
            </FilterGroup>
            <ClearFiltersButton onClick={handleClearFilters}>
              Reset Filter
            </ClearFiltersButton>
          </FilterGrid>
        </FilterSection>
      )}

      {decks.length > 0 ? (
        <DecksGrid>
          {decks.map((deck) => (
            <DeckCard key={deck.id} onClick={() => handleDeckClick(deck)}>
              <DeckHeader>
                <DeckTitle>{deck.title}</DeckTitle>
                <DeckType type={deck.content_type}>
                  {deck.content_type === 'text' ? '📝 Text' : '📄 PDF'}
                </DeckType>
              </DeckHeader>
              <DeckDescription>{deck.description || 'No description'}</DeckDescription>

              {deck.tags && deck.tags.length > 0 && (
                <DeckTags>
                  {deck.tags.map(tag => (
                    <DeckTag key={tag.id} tagType={tag.type}>
                      {tag.name}
                    </DeckTag>
                  ))}
                </DeckTags>
              )}

              <DeckStats>
                <StatItem>
                  <span>🎴</span>
                  {deck.cardCount || 0} kartu
                </StatItem>
                <StatItem>
                  <span>📅</span>
                  {new Date(deck.created_at).toLocaleDateString('id-ID')}
                </StatItem>
              </DeckStats>
            </DeckCard>
          ))}
        </DecksGrid>
      ) : (
        <EmptyState>
          <div>🎴</div>
          <h3>Belum Ada Deck</h3>
          <p>Klik "Buat Deck Baru" untuk membuat deck flashcard pertama Anda</p>
        </EmptyState>
      )}

      <DeckModal
        isOpen={isDeckModalOpen}
        onClose={handleCloseDeckModal}
        onSuccess={handleDeckSubmit}
        deckToEdit={deckToEdit}
      />

      <TagManagementModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
      />

      <FlashcardSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </Container>
  )
}

export default FlashcardAdminPage
