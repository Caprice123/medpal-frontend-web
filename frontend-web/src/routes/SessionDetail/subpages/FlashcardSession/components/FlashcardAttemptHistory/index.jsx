import { useFlashcardAttemptHistory } from './hook'
import { useSelector } from 'react-redux'
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
  CostBadge,
  StartButton
} from './FlashcardAttemptHistory.styles'

const FlashcardAttemptHistory = ({ setSelectedAttempt, setCurrentView }) => {
  const { handleTryAgain } = useFlashcardAttemptHistory(setSelectedAttempt)

  const { sessionAttempts: attempts } = useSelector(state => state.session)

  return (
    <Container>
      <Header>
        <div>
          <Title>Riwayat Percobaan</Title>
          <Subtitle>
            Lihat semua percobaan flashcard Anda
          </Subtitle>
        </div>
        <StartButton
          onClick={handleTryAgain}
          style={{
            alignSelf: 'flex-start',
            marginTop: '1rem'
          }}
        >
          🔄 Coba Lagi
        </StartButton>
      </Header>

      <DeckSelectionContainer>
        <DeckGrid>
          {attempts && attempts.map((attempt, index) => (
            <DeckCard
              key={attempt.id}
              onClick={() => {
                if (attempt.completed_at) {
                  setSelectedAttempt(attempt)
                  setCurrentView("results")
                }
              }}
              style={{ cursor: attempt.completed_at ? 'pointer' : 'default' }}
            >
              <DeckHeader>
                <DeckTitle>Percobaan #{attempt.attemptNumber || index + 1}</DeckTitle>
              </DeckHeader>

              <TagContainer>
                <Tag type="status">
                  {attempt.completed_at ? '✓ Selesai' :
                    attempt.deck_id ? '▶ Aktif' : '○ Belum dimulai'}
                </Tag>
                {attempt.total_cards && (
                  <Tag type="score">
                    Kartu: {attempt.total_cards}
                  </Tag>
                )}
              </TagContainer>

              <DeckFooter>
                <div>
                  <CardCount>
                    {attempt.total_cards || 0} Kartu
                  </CardCount>
                  <CostBadge>
                    {new Date(attempt.started_at).toLocaleDateString()}
                  </CostBadge>
                </div>
                {attempt.completed_at && (
                  <StartButton
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedAttempt(attempt)
                      setCurrentView("results")
                    }}
                  >
                    Lihat Hasil
                  </StartButton>
                )}
              </DeckFooter>
            </DeckCard>
          ))}
        </DeckGrid>
      </DeckSelectionContainer>
    </Container>
  )
}

export default FlashcardAttemptHistory
