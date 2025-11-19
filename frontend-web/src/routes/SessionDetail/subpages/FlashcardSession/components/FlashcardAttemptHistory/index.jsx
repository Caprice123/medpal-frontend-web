import { useFlashcardAttemptHistory } from './hook'
import { useDispatch, useSelector } from 'react-redux'
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
import { fetchFlashcardAttemptDetail } from '../../../../../../store/session/action'
import Pagination from '../../../../../../components/Pagination'

const FlashcardAttemptHistory = ({ currentPage, setCurrentPage, setCurrentView }) => {
  const { handleTryAgain } = useFlashcardAttemptHistory(setCurrentView)

  const dispatch = useDispatch()
  const { sessionAttempts: attempts, pagination, loading } = useSelector(state => state.session)
  const { isLoadingAttempts } = loading || {}

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
                if (attempt.status == "completed") {
                    dispatch(fetchFlashcardAttemptDetail(attempt.id))
                    setCurrentView("attempt_results")
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
                {attempt.status == "completed" && (
                  <StartButton
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(fetchFlashcardAttemptDetail(attempt.id))
                      setCurrentView("attempt_results")
                    }}
                  >
                    Lihat Hasil
                  </StartButton>
                )}
              </DeckFooter>
            </DeckCard>
          ))}
        </DeckGrid>

        <Pagination
          currentPage={currentPage}
          isLastPage={pagination?.isLastPage ?? true}
          onPageChange={setCurrentPage}
          isLoading={isLoadingAttempts}
        />
      </DeckSelectionContainer>
    </Container>
  )
}

export default FlashcardAttemptHistory
