import { useSelector } from 'react-redux'
import {
  LoadingOverlay,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  DeckGrid,
  DeckCard,
  DeckCardHeader,
  DeckCardTitle,
  DeckDescription,
  TagList,
  Tag,
  DeckStats,
  StatItem,
  StatLabel,
  StatValue,
  StartButton
} from './DeckList.styles'
import { generatePath, useNavigate } from 'react-router-dom'
import { FlashcardRoute } from '../../../../routes'

function DeckList() {
    const { decks, loading } = useSelector(state => state.flashcard)
    const navigate = useNavigate()

  // Loading state
  if (loading.isGetListDecksLoading) {
    return <LoadingOverlay>Memuat deck flashcard...</LoadingOverlay>
  }

  // Empty state
  if (decks.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>🎴</EmptyStateIcon>
        <EmptyStateText>Tidak ada deck flashcard ditemukan</EmptyStateText>
      </EmptyState>
    )
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  // Data state - render deck grid
  return (
    <DeckGrid>
      {decks.map((deck) => {
        // Get tag groups
        const universityTags = deck.tags?.filter(tag => tag.tag_group?.name === 'university') || []
        const semesterTags = deck.tags?.filter(tag => tag.tag_group?.name === 'semester') || []

        return (
          <DeckCard key={deck.id}>
            <DeckCardHeader>
              <DeckCardTitle>{deck.title}</DeckCardTitle>
            </DeckCardHeader>

            <DeckDescription>
              {deck.description || 'Tidak ada deskripsi'}
            </DeckDescription>

            {/* University Tags */}
            {universityTags.length > 0 && (
              <TagList>
                {universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Semester Tags */}
            {semesterTags.length > 0 && (
              <TagList>
                {semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            <div style={{ flex: '1' }}></div>

            <DeckStats>
              <StatItem>
                <StatLabel>Kartu</StatLabel>
                <StatValue>{deck.cardCount || deck.cards?.length || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Diperbarui</StatLabel>
                <StatValue>{formatDate(deck.updated_at || deck.updatedAt)}</StatValue>
              </StatItem>
            </DeckStats>

            <StartButton onClick={() => navigate(generatePath(FlashcardRoute.detailRoute, { id: deck.id }))}>
              Mulai Belajar
            </StartButton>
          </DeckCard>
        )
      })}
    </DeckGrid>
  )
}

export default DeckList
