import { useState, useEffect, useRef } from 'react'
import Button from '@components/common/Button'
import {
  Container,
  Header,
  TopicInfo,
  BackButton,
  QuestionCard,
  QuestionNumber,
  QuestionText,
  InlineInput,
  NavigationButtons,
  ProgressBar,
  ProgressFill
} from './ExercisePlayer.styles'

const ExercisePlayer = ({ topic, onSubmit, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const inputRef = useRef(null)

  // Auto-focus input when question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentIndex])

  const currentQuestion = topic.questions[currentIndex]
  const totalQuestions = topic.questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Convert answers object to array format for API
    const answersArray = topic.questions.map(question => ({
      questionId: question.id,
      userAnswer: answers[question.id] || ''
    }))

    onSubmit(answersArray)
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const allAnswered = topic.questions.every(q => answers[q.id]?.trim())

  // Replace ____ with inline input in question text
  const renderQuestionWithInput = () => {
    const questionParts = currentQuestion.question.split('____')

    if (questionParts.length === 1) {
      // No blank, just return the question
      return <QuestionText>{currentQuestion.question}</QuestionText>
    }

    return (
      <QuestionText>
        {questionParts[0]}
        <InlineInput
          ref={inputRef}
          type="text"
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
        />
        {questionParts[1]}
      </QuestionText>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          ← Kembali
        </BackButton>
        <TopicInfo>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
        </TopicInfo>
      </Header>

      <QuestionCard>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <QuestionNumber>
          Soal {currentIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        {renderQuestionWithInput()}

        <NavigationButtons>
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Sebelumnya
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isLastQuestion}
          >
            Selanjutnya →
          </Button>
        </NavigationButtons>
      </QuestionCard>

      {isLastQuestion && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
        >
          Selesai & Lihat Hasil
        </Button>
      )}
    </Container>
  )
}

export default ExercisePlayer
