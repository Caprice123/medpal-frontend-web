import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { completeFlashcardSession, fetchFlashcardAttemptDetail } from '../../../../../../store/session/action'
import {
  PlayerContainer,
  ProgressBar,
  ProgressText,
  ProgressBarBg,
  ProgressBarFill,
  CardContainer,
  Flashcard,
  CardFront,
  CardBack,
  CardLabel,
  CardContent,
  AnswerSection,
  AnswerLabel,
  AnswerInput,
  ShowAnswerSection,
  ShowAnswerButton,
  NavigationButtons,
  PrimaryButton,
  SecondaryButton,
  CardDots,
  Dot
} from './FlashcardPlayer.styles'

const FlashcardPlayer = ({ setCurrentView }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [startTime, setStartTime] = useState(Date.now())

  const { attemptDetail } = useSelector(state => state.session)
  const dispatch = useDispatch()

  const cards = attemptDetail?.cards || []
  const currentCard = cards[currentCardIndex]
  const isLastCard = currentCardIndex === cards.length - 1

  useEffect(() => {
    // Reset when moving to next card
    setIsFlipped(false)
    setShowAnswer(false)
    setCurrentAnswer('')
    setStartTime(Date.now())
  }, [currentCardIndex])

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setIsFlipped(true)
  }

  const handleNext = () => {
    if (!showAnswer) {
      alert('Please click "Show Answer" first to see the correct answer')
      return
    }

    // Save current answer
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const newAnswer = {
      cardId: currentCard.id,
      userAnswer: currentAnswer,
      timeTakenSeconds: timeTaken
    }

    setUserAnswers([...userAnswers, newAnswer])

    if (isLastCard) {
      // Submit all answers
      handleSubmit([...userAnswers, newAnswer])
    } else {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      // Restore previous answer if exists
      if (userAnswers[currentCardIndex - 1]) {
        setCurrentAnswer(userAnswers[currentCardIndex - 1].userAnswer)
      }
    }
  }
  console.log(attemptDetail)

  const handleSubmit = async (allAnswers) => {
    if (window.confirm('Submit all your answers? This will complete the session.')) {
        // Complete the flashcard session with answers
        await dispatch(completeFlashcardSession(attemptDetail.id, allAnswers))
        dispatch(fetchFlashcardAttemptDetail(attemptDetail.id))
        setCurrentView('attempt_results')
    }
  }

  if (!currentCard) {
    return <div>No cards available</div>
  }

  return (
    <PlayerContainer>
      {/* Progress Bar */}
      <ProgressBar>
        <ProgressText>
          Card {currentCardIndex + 1} / {cards.length}
        </ProgressText>
        <ProgressBarBg>
          <ProgressBarFill
            progress={((currentCardIndex + 1) / cards.length) * 100}
          />
        </ProgressBarBg>
      </ProgressBar>

      {/* Card Container */}
      <CardContainer>
        <Flashcard flipped={isFlipped}>
          {/* Card Front */}
          <CardFront>
            <CardLabel>Question</CardLabel>
            <CardContent>
              <p>{currentCard.front_text || currentCard.front}</p>
            </CardContent>
          </CardFront>

          {/* Card Back */}
          <CardBack>
            <CardLabel>Correct Answer</CardLabel>
            <CardContent>
              <p>{currentCard.back_text || currentCard.back}</p>
            </CardContent>
          </CardBack>
        </Flashcard>
      </CardContainer>

      {/* Your Answer Input */}
      <AnswerSection>
        <AnswerLabel>Your Answer:</AnswerLabel>
        <AnswerInput
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows="3"
        />
      </AnswerSection>

      {/* Show Answer Button */}
      {!showAnswer && (
        <ShowAnswerSection>
          <ShowAnswerButton onClick={handleShowAnswer}>
            Show Answer
          </ShowAnswerButton>
        </ShowAnswerSection>
      )}

      {/* Navigation Buttons */}
      <NavigationButtons>
        <SecondaryButton
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
        >
          ← Previous
        </SecondaryButton>

        {isLastCard ? (
          <PrimaryButton
            onClick={() => handleNext()}
            disabled={!showAnswer}
          >
            Submit All
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={handleNext}
            disabled={!showAnswer}
          >
            Next →
          </PrimaryButton>
        )}
      </NavigationButtons>

      {/* Card Navigation Dots */}
      <CardDots>
        {cards.map((_, index) => (
          <Dot
            key={index}
            active={index === currentCardIndex}
            completed={index < currentCardIndex}
            onClick={() => setCurrentCardIndex(index)}
          />
        ))}
      </CardDots>
    </PlayerContainer>
  )
}

export default FlashcardPlayer
