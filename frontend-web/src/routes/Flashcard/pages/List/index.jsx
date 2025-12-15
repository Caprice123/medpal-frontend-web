import { Filter } from './components/Filter'
import DeckList from './components/DeckList'
import { useFlashcardList } from './hooks/useFlashcardList'
import {
  Container,
  DeckSelectionContainer
} from './List.styles'

function FlashcardListPage() {
  useFlashcardList()

  return (
    <Container>
      <DeckSelectionContainer>
        <Filter />

        <DeckList />
      </DeckSelectionContainer>
    </Container>
  )
}

export default FlashcardListPage
