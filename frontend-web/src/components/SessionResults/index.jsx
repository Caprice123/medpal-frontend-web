import { useSelector } from 'react-redux'
import {
  Container,
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
  AnswerStatus,
  AnswerQuestion,
  AnswerDetails
} from './SessionResults.styles'

function SessionResults({ sessionData, onViewHistory, onTryAgain }) {
  const { answers, topicSnapshot } = useSelector(state => state.session)

  const statistics = sessionData?.statistics || {}
  const percentage = statistics.percentage || 0
  const totalQuestions = statistics.total_questions || 0
  const correctAnswers = statistics.correct_answers || 0
  const creditsUsed = statistics.credits_used || 0

  const getResultMessage = () => {
    if (percentage >= 80) return 'Luar Biasa!'
    if (percentage >= 60) return 'Bagus!'
    if (percentage >= 40) return 'Cukup Baik'
    return 'Tetap Semangat!'
  }

  return (
    <Container>
      <ResultCard>
        <ScoreCircle percentage={percentage}>
          <ScoreNumber>{percentage}%</ScoreNumber>
          <ScoreLabel>Skor Anda</ScoreLabel>
        </ScoreCircle>

        <ResultTitle>{getResultMessage()}</ResultTitle>
        <ResultSubtitle>
          Anda telah menyelesaikan latihan soal
        </ResultSubtitle>

        <StatsGrid>
          <StatCard>
            <StatValue>{correctAnswers}</StatValue>
            <StatLabel>Benar</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalQuestions - correctAnswers}</StatValue>
            <StatLabel>Salah</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalQuestions}</StatValue>
            <StatLabel>Total Soal</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{creditsUsed}</StatValue>
            <StatLabel>Kredit Digunakan</StatLabel>
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
        <SectionTitle>Review Jawaban Anda</SectionTitle>

        {topicSnapshot?.questions.map((question, index) => {
          const answer = answers[index]
          const isCorrect = answer?.isCorrect

          return (
            <AnswerItem key={question.id} isCorrect={isCorrect}>
              <AnswerHeader>
                <AnswerNumber>Soal {index + 1}</AnswerNumber>
                <AnswerStatus isCorrect={isCorrect}>
                  {isCorrect ? '✓ Benar' : '✗ Salah'}
                </AnswerStatus>
              </AnswerHeader>

              <AnswerQuestion>{question.question}</AnswerQuestion>

              <AnswerDetails>
                <div>
                  <strong>Jawaban Anda:</strong> {answer?.userAnswer || '-'}
                </div>
                {!isCorrect && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Jawaban Benar:</strong> {answer?.correctAnswer || question.answer}
                  </div>
                )}
                {answer?.explanation && (
                  <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    <strong>Penjelasan:</strong> {answer.explanation}
                  </div>
                )}
              </AnswerDetails>
            </AnswerItem>
          )
        })}
      </AnswersSection>
    </Container>
  )
}

export default SessionResults
