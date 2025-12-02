import { useState } from 'react'
import {
  Container,
  Header,
  Title,
  Subtitle,
  DeckSelectionContainer,
  DeckGrid,
  DeckCard,
  DeckHeader,
  DeckTitle,
  TagContainer,
  Tag,
  DeckFooter,
  CardCount,
  StartButton,
  FilterSection,
  FilterGroup,
  FilterLabel,
  Select,
  EmptyState,
  DeckDescription
} from './DeckList.styles'
import { useSelector } from 'react-redux'

const DeckList = ({ decks, onSelectDeck }) => {
    const { tags } = useSelector(state => state.tags)
  const [filters, setFilters] = useState({
    university: '',
    semester: ''
  })

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Get unique universities and semesters for filters
  
  const universities = tags.find((tag) => tag.name == "university")?.tags || []
  const universityGroupId = tags.find((tag) => tag.name == "university")?.id

  const semesterGroupId = tags.find((tag) => tag.name == "semester")?.id
  const semesters = tags.find((tag) => tag.name == "semester")?.tags || []

  // Filter decks based on selected filters
  const filteredDecks = decks.filter(deck => {
    const universityMatch = !filters.university ||
      deck.tags?.some(tag => tag.tagGroupId === universityGroupId && tag.name === filters.university)

    const semesterMatch = !filters.semester ||
      deck.tags?.some(tag => tag.tagGroupId === semesterGroupId && tag.name === filters.semester)

    return universityMatch && semesterMatch
  })
  console.log(decks)

  return (
    <Container>
      <Header>
        <div>
          <Title>Pilih Deck Flashcard</Title>
          <Subtitle>
            Pilih deck flashcard untuk memulai sesi belajar Anda
          </Subtitle>
        </div>
      </Header>

      <DeckSelectionContainer>
        <FilterSection>
          <FilterGroup>
            <FilterLabel>Universitas</FilterLabel>
            <Select
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
            >
              <option value="">Semua Universitas</option>
              {universities.map(tag => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
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
              {semesters.map(tag => (
                <option key={tag.name} value={tag.name}>{tag.name}</option>
              ))}
            </Select>
          </FilterGroup>
        </FilterSection>

        {filteredDecks.length === 0 ? (
          <EmptyState>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎴</div>
            <h3>Belum Ada Deck</h3>
            <p>Belum ada deck flashcard yang tersedia saat ini</p>
          </EmptyState>
        ) : (
          <DeckGrid>
            {filteredDecks.map((deck) => (
              <DeckCard key={deck.id}>
                <DeckHeader>
                  <DeckTitle>{deck.title}</DeckTitle>
                  <DeckDescription>{deck.description || 'Tidak ada deskripsi'}</DeckDescription>
                </DeckHeader>

                <TagContainer>
                  {deck.tags && deck.tags.map((tag, index) => (
                    <Tag key={index} type={tag.type}>
                      {tag.name}
                    </Tag>
                  ))}
                </TagContainer>

                <DeckFooter>
                  <CardCount>
                    {deck.cardCount || deck.cards?.length || 0} Kartu
                  </CardCount>
                  <StartButton
                    onClick={() => onSelectDeck(deck)}
                  >
                    Mulai Belajar
                  </StartButton>
                </DeckFooter>
              </DeckCard>
            ))}
          </DeckGrid>
        )}
      </DeckSelectionContainer>
    </Container>
  )
}

export default DeckList
