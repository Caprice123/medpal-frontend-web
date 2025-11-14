import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { completeSession } from '@store/session/action'
import { BlankInput } from './ExercisePlayer.styles'

function ExercisePlayer({ sessionId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { topicSnapshot } = useSelector(state => state.session)
  const { isCompletingSession } = useSelector(state => state.session.loading)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // Store all answers: { questionId: { answer: '', timeTaken: 0 } }
  const [questionStartTimes, setQuestionStartTimes] = useState({})

  const currentQuestion = topicSnapshot?.questions?.[currentQuestionIndex]
  const totalQuestions = topicSnapshot?.questions?.length || 0
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const answeredCount = Object.keys(userAnswers).length

  useEffect(() => {
    // Track time for current question
    if (currentQuestion && !questionStartTimes[currentQuestion.id]) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [currentQuestion.id]: Date.now()
      }))
    }
  }, [currentQuestion, questionStartTimes])

  const handleAnswerChange = (value) => {
    if (!currentQuestion) return

    const timeTaken = questionStartTimes[currentQuestion.id]
      ? Math.floor((Date.now() - questionStartTimes[currentQuestion.id]) / 1000)
      : 0

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        answer: value,
        timeTaken
      }
    }))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitAll = async () => {
    if (answeredCount === 0) {
      alert('Silakan jawab setidaknya satu pertanyaan sebelum submit')
      return
    }

    const unansweredCount = totalQuestions - answeredCount
    if (unansweredCount > 0) {
      const confirm = window.confirm(
        `Anda belum menjawab ${unansweredCount} soal. Apakah Anda yakin ingin submit sekarang?`
      )
      if (!confirm) return
    }

    try {
      // Format answers for backend
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, data]) => ({
        questionId: parseInt(questionId),
        userAnswer: data.answer,
        timeTakenSeconds: data.timeTaken
      }))

      await dispatch(completeSession(sessionId, formattedAnswers))

      // Reload the page to fetch updated session with results
      window.location.reload()
    } catch (error) {
      alert('Gagal submit jawaban: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const renderQuestionText = (text) => {
    const parts = text.split('____')
    const currentAnswer = userAnswers[currentQuestion?.id]?.answer || ''

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <BlankInput
                type="text"
                placeholder="____"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                autoFocus={index === 0}
              />
            )}
          </span>
        ))}
      </>
    )
  }

  if (!topicSnapshot || !currentQuestion) {
    return <Container>Loading...</Container>
  }

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <Container>
      <HeaderNav>
        <BackLink onClick={() => navigate('/dashboard')}>
          ← Kembali ke Dashboard
        </BackLink>
        <TopicTitle>{topicSnapshot.title}</TopicTitle>
        <div></div>
      </HeaderNav>

      <ContentWrapper>
        <ProgressBar>
          <Progress percentage={progress} />
        </ProgressBar>

        <QuestionIndicators>
        {topicSnapshot.questions.map((q, index) => (
          <QuestionDot
            key={q.id}
            current={index === currentQuestionIndex}
            answered={!!userAnswers[q.id]?.answer}
            onClick={() => handleJumpToQuestion(index)}
          >
            {index + 1}
          </QuestionDot>
        ))}
      </QuestionIndicators>

      <QuestionCard>
        <QuestionNumber>
          Soal {currentQuestionIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        <QuestionText>
          {renderQuestionText(currentQuestion.question)}
        </QuestionText>

        <NavigationButtons>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Sebelumnya
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isLastQuestion ? (
              <Button
                variant="secondary"
                onClick={handleNext}
              >
                Selanjutnya →
              </Button>
            ) : null}

            <Button
              variant="primary"
              onClick={handleSubmitAll}
              disabled={isCompletingSession}
            >
              {isCompletingSession && <LoadingSpinner />}
              Submit Semua Jawaban
            </Button>
          </div>
        </NavigationButtons>
      </QuestionCard>

        <QuestionStats>
          {answeredCount} dari {totalQuestions} soal telah dijawab
        </QuestionStats>
      </ContentWrapper>
    </Container>
  )
}

export default ExercisePlayer
