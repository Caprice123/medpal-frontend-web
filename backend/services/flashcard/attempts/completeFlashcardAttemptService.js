import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import { ValidationError } from '../../../errors/validationError.js'

export class CompleteFlashcardAttemptService extends BaseService {
  static async call({ attemptId, userId, answers = [] }) {
    // Validate inputs
    if (!attemptId) {
      throw new ValidationError('Attempt ID is required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Fetch the attempt with cards
      const attempt = await tx.flashcard_session_attempts.findUnique({
        where: { id: parseInt(attemptId) },
        include: {
          flashcard_session: {
            include: {
              user_learning_session: true,
              flashcard_session_cards: {
                orderBy: { order: 'asc' }
              }
            }
          },
          flashcard_session_answers: true
        }
      })

      if (!attempt) {
        throw new ValidationError('Attempt not found')
      }

      if (userId && attempt.flashcard_session.user_learning_session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized to complete this attempt')
      }

      let answerResults = []

      // Process answers if provided
      if (answers && answers.length > 0) {
        // Create a map of card id to session card for quick lookup
        const sessionCardsMap = {}
        attempt.flashcard_session.flashcard_session_cards.forEach(card => {
          sessionCardsMap[card.id] = card
        })

        // Process each answer
        for (const answer of answers) {
          const sessionCard = sessionCardsMap[answer.cardId]

          if (!sessionCard) {
            throw new ValidationError(`Card ${answer.cardId} not found in this attempt`)
          }

          // Create answer record (no correctness check)
          const answerRecord = await tx.flashcard_session_answers.create({
            data: {
              flashcard_session_attempt_id: attempt.id,
              flashcard_session_card_id: sessionCard.id,
              user_answer: answer.userAnswer || '',
              time_taken_seconds: answer.timeTakenSeconds || 0
            }
          })

          answerResults.push({
            cardId: answer.cardId,
            userAnswer: answer.userAnswer,
            correctAnswer: sessionCard.back_text,
            answerId: answerRecord.id
          })
        }
      }

      // Update attempt with completed time
      const updatedAttempt = await tx.flashcard_session_attempts.update({
        where: { id: parseInt(attemptId) },
        data: {
          completed_at: new Date()
        }
      })

      // Get total cards
      const totalCards = attempt.flashcard_session.flashcard_session_cards.length

      return {
        attempt: updatedAttempt,
        total_cards: totalCards,
        answers: answerResults
      }
    })

    return result
  }
}
