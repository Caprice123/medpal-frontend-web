import {
  Container,
  ContentWrapper,
  ResultCard,
  ScoreCircle,
  ScoreNumber,
  ScoreLabel,
  ResultTitle,
  ResultSubtitle,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  ButtonGroup,
  Button,
  AnswersSection,
  SectionTitle,
  AnswerItem,
  AnswerHeader,
  AnswerNumber,
  CardFront,
  CardBack
} from './SessionResults.styles'

function SessionResults({ attemptMetadata, attemptDetail, onViewHistory, onTryAgain }) {
  // Use attemptMetadata and attemptDetail from props
  const cards = attemptDetail?.cards || []
  const answers = attemptDetail?.answers || []

  const totalCards = attemptMetadata?.total_cards || 0

  return (
    <Container>
      <ContentWrapper>
        <ResultCard>
          <ScoreCircle>
            <ScoreNumber>{totalCards}</ScoreNumber>
            <ScoreLabel>Kartu Dipelajari</ScoreLabel>
          </ScoreCircle>

          <ResultTitle>Sesi Selesai!</ResultTitle>
          <ResultSubtitle>
            Anda telah menyelesaikan sesi belajar flashcard
          </ResultSubtitle>

          <StatsGrid>
            <StatCard>
              <StatValue>{totalCards}</StatValue>
              <StatLabel>Total Kartu</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{new Date(attemptMetadata?.started_at).toLocaleDateString()}</StatValue>
              <StatLabel>Tanggal</StatLabel>
            </StatCard>
          </StatsGrid>

          <ButtonGroup>
            <Button onClick={onTryAgain}>
              🔄 Coba Lagi
            </Button>
            <Button variant="primary" onClick={onViewHistory}>
              📊 Lihat Riwayat
            </Button>
          </ButtonGroup>
        </ResultCard>

        <AnswersSection>
          <SectionTitle>Review Flashcard</SectionTitle>

          {cards.map((card, index) => {
            // Find the user's answer for this card
            const userAnswer = answers.find(a => a.flashcard_session_card_id === card.id)

            return (
              <AnswerItem key={index}>
                <AnswerHeader>
                  <AnswerNumber>Kartu {index + 1}</AnswerNumber>
                </AnswerHeader>

                <CardFront>
                  <strong>Pertanyaan:</strong> {card.front || card.front_text}
                </CardFront>

                <CardBack>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Jawaban Anda:</strong> {userAnswer?.user_answer || '(Tidak ada jawaban)'}
                  </div>
                  <div style={{ color: '#10b981' }}>
                    <strong>Jawaban Benar:</strong> {card.back || card.back_text}
                  </div>
                </CardBack>
              </AnswerItem>
            )
          })}
        </AnswersSection>
      </ContentWrapper>
    </Container>
  )
}

export default SessionResults
