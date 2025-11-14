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
  const { sessionDetail } = useSelector(state => state.session)

  // Get data from sessionDetail (from fetchSessionDetail) or from sessionData prop (from complete)
  const data = sessionData || sessionDetail
  const topicSnapshot = data?.topic_snapshot
  const answers = data?.answers || []

  const percentage = data?.percentage || 0
  const totalQuestions = data?.total_questions || 0
  const correctAnswers = data?.score || 0
  const creditsUsed = data?.credits_used || 0

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
          // Find answer by question_id
          const answer = answers.find(a => a.question_id === question.id)
          const isCorrect = answer?.is_correct

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
                  <strong>Jawaban Anda:</strong> {answer?.user_answer || '-'}
                </div>
                {!isCorrect && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Jawaban Benar:</strong> {answer?.answer_text || question.answer}
                  </div>
                )}
                {(answer?.explanation || question.explanation) && (
                  <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    <strong>Penjelasan:</strong> {answer?.explanation || question.explanation}
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
