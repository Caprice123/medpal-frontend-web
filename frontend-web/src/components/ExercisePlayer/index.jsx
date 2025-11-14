import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitAnswer, nextQuestion, completeSession } from '@store/session/action'
import {
  Container,
  ProgressBar,
  Progress,
  QuestionCard,
  QuestionNumber,
  QuestionText,
  AnswerInput,
  FeedbackCard,
  FeedbackTitle,
  FeedbackText,
  ExplanationCard,
  ExplanationLabel,
  ExplanationText,
  ButtonGroup,
  Button,
  LoadingSpinner
} from './ExercisePlayer.styles'

function ExercisePlayer({ onComplete }) {
  const dispatch = useDispatch()
  const { currentSession, topicSnapshot, currentQuestionIndex, answers } = useSelector(state => state.session)
  const { isSubmittingAnswer, isCompletingSession } = useSelector(state => state.session.loading)

  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(Date.now())

  const currentQuestion = topicSnapshot?.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / topicSnapshot?.questions.length) * 100
  const isLastQuestion = currentQuestionIndex === topicSnapshot?.questions.length - 1
  const hasAnswered = feedback !== null

  useEffect(() => {
    // Reset for new question
    setUserAnswer('')
    setFeedback(null)
    setStartTime(Date.now())
  }, [currentQuestionIndex])

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      alert('Silakan masukkan jawaban')
      return
    }

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    try {
      const result = await dispatch(
        submitAnswer(
          currentSession.id,
          currentQuestion.id,
          userAnswer,
          timeTaken
        )
      )

      setFeedback(result)
    } catch (error) {
      alert('Gagal submit jawaban: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleNext = () => {
    dispatch(nextQuestion())
  }

  const handleComplete = async () => {
    try {
      const result = await dispatch(completeSession(currentSession.id))

      if (onComplete) {
        onComplete(result)
      }
    } catch (error) {
      alert('Gagal menyelesaikan sesi: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const renderQuestionText = (text, showAnswer = false, correctAnswer = '') => {
    const parts = text.split('____')
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className="blank">
                {showAnswer ? correctAnswer : '____'}
              </span>
            )}
          </span>
        ))}
      </>
    )
  }

  if (!currentSession || !topicSnapshot) {
    return <Container>Loading...</Container>
  }

  return (
    <Container>
      <ProgressBar>
        <Progress percentage={progress} />
      </ProgressBar>

      <QuestionCard>
        <QuestionNumber>
          Soal {currentQuestionIndex + 1} dari {topicSnapshot.questions.length}
        </QuestionNumber>

        <QuestionText>
          {renderQuestionText(
            currentQuestion.question,
            hasAnswered,
            feedback?.correct_answer
          )}
        </QuestionText>

        {!hasAnswered ? (
          <>
            <AnswerInput
              type="text"
              placeholder="Ketik jawaban Anda di sini..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              disabled={isSubmittingAnswer}
            />

            <ButtonGroup>
              <Button
                variant="primary"
                onClick={handleSubmitAnswer}
                disabled={isSubmittingAnswer || !userAnswer.trim()}
              >
                {isSubmittingAnswer && <LoadingSpinner />}
                Submit Jawaban
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <FeedbackCard isCorrect={feedback.is_correct}>
              <FeedbackTitle>
                {feedback.is_correct ? '✓ Benar!' : '✗ Salah'}
              </FeedbackTitle>
              <FeedbackText>
                {feedback.is_correct
                  ? `Jawaban Anda "${userAnswer}" benar!`
                  : `Jawaban Anda "${userAnswer}" salah. Jawaban yang benar adalah "${feedback.correct_answer}"`}
              </FeedbackText>

              {feedback.explanation && (
                <ExplanationCard>
                  <ExplanationLabel>Penjelasan</ExplanationLabel>
                  <ExplanationText>{feedback.explanation}</ExplanationText>
                </ExplanationCard>
              )}
            </FeedbackCard>

            <ButtonGroup>
              {!isLastQuestion ? (
                <Button variant="primary" onClick={handleNext}>
                  Soal Selanjutnya →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  disabled={isCompletingSession}
                >
                  {isCompletingSession && <LoadingSpinner />}
                  Selesai
                </Button>
              )}
            </ButtonGroup>
          </>
        )}
      </QuestionCard>

      <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
        {answers.length} dari {topicSnapshot.questions.length} soal telah dijawab
      </div>
    </Container>
  )
}

export default ExercisePlayer
