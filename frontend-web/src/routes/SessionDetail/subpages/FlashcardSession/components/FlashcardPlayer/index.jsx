import React, { useState, useEffect } from 'react'
import './FlashcardPlayer.css'

const FlashcardPlayer = ({ deckSnapshot, onComplete, attemptId }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [startTime, setStartTime] = useState(Date.now())

  const cards = deckSnapshot?.cards || []
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

  const handleSubmit = (allAnswers) => {
    if (window.confirm('Submit all your answers? This will complete the session.')) {
      onComplete(allAnswers)
    }
  }

  if (!currentCard) {
    return <div>No cards available</div>
  }

  return (
    <div className="flashcard-player-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress-text">
          Card {currentCardIndex + 1} / {cards.length}
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="card-container">
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          {/* Card Front */}
          <div className="card-face card-front">
            <div className="card-label">Question</div>
            <div className="card-content">
              <p>{currentCard.front_text || currentCard.front}</p>
            </div>
          </div>

          {/* Card Back */}
          <div className="card-face card-back">
            <div className="card-label">Correct Answer</div>
            <div className="card-content">
              <p>{currentCard.back_text || currentCard.back}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Answer Input */}
      <div className="answer-section">
        <label className="answer-label">Your Answer:</label>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="answer-input"
          rows="3"
        />
      </div>

      {/* Show Answer Button */}
      {!showAnswer && (
        <div className="show-answer-section">
          <button
            onClick={handleShowAnswer}
            className="btn btn-show-answer"
          >
            Show Answer
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
          className="btn btn-secondary"
        >
          ← Previous
        </button>

        {isLastCard ? (
          <button
            onClick={() => handleNext()}
            className="btn btn-primary"
            disabled={!showAnswer}
          >
            Submit All
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-primary"
            disabled={!showAnswer}
          >
            Next →
          </button>
        )}
      </div>

      {/* Card Navigation Dots */}
      <div className="card-dots">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentCardIndex ? 'active' : ''} ${index < currentCardIndex ? 'completed' : ''}`}
            onClick={() => setCurrentCardIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default FlashcardPlayer
