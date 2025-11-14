import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitAnswer, nextQuestion } from '@store/session/action'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f0fdfa;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #0e7490, #14b8a6);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`

const QuestionCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`

const QuestionNumber = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const QuestionText = styled.div`
  font-size: 1.25rem;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 1.5rem;

  .blank {
    display: inline-block;
    min-width: 120px;
    padding: 0.25rem 0.75rem;
    border-bottom: 2px solid #0891b2;
    color: #0891b2;
    font-weight: 600;
    margin: 0 0.25rem;
  }
`

const AnswerInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`

const FeedbackCard = styled.div`
  background: ${props => props.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 2px solid ${props => props.isCorrect ? '#10b981' : '#ef4444'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
`

const FeedbackTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.isCorrect ? '#10b981' : '#ef4444'};
  margin-bottom: 0.5rem;
`

const FeedbackText = styled.div`
  color: #374151;
  line-height: 1.6;
`

const ExplanationCard = styled.div`
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`

const ExplanationLabel = styled.div`
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const ExplanationText = styled.div`
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.875rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #0e7490, #14b8a6)' : '#6b7280'};
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 116, 144, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

function ExercisePlayer({ sessionId, onComplete }) {
  const dispatch = useDispatch()
  const { currentSession, topicSnapshot, currentQuestionIndex, answers } = useSelector(state => state.session)
  const { isSubmittingAnswer, isCompletingSession } = useSelector(state => state.session.loading)

  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [startTime, setStartTime] = useState(Date.now())

  // Get current question from topicSnapshot questions
  const currentQuestion = topicSnapshot?.questions?.[currentQuestionIndex]
  const progress = topicSnapshot?.questions ? ((currentQuestionIndex + 1) / topicSnapshot.questions.length) * 100 : 0
  const isLastQuestion = topicSnapshot?.questions && currentQuestionIndex === topicSnapshot.questions.length - 1
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
          sessionId,
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

  const handleFinish = async () => {
    if (onComplete) {
      await onComplete()
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

  if (!currentSession || !topicSnapshot || !currentQuestion) {
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
              <FeedbackTitle isCorrect={feedback.is_correct}>
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
                  onClick={handleFinish}
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
