import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'
import { ValidationError } from '#errors/validationError'

export class CreateNewFlashcardAttemptService extends BaseService {
  static async call({ userLearningSessionId, userId }) {
    // Validate inputs
    if (!userLearningSessionId || !userId) {
      throw new ValidationError('User learning session ID and user ID are required')
    }

    const result = await prisma.$transaction(async (tx) => {
      // Verify the user_learning_session exists and belongs to the user
      const userLearningSession = await tx.user_learning_sessions.findUnique({
        where: { id: parseInt(userLearningSessionId), user_id: userId },
        include: {
          flashcard_session: true
        }
      })

      if (!userLearningSession) {
        throw new ValidationError('Learning session not found')
      }

      // Get the flashcard session for this learning session
      const flashcardSession = userLearningSession.flashcard_session

      if (!flashcardSession) {
        throw new ValidationError('No flashcard session found')
      }

      // Create new attempt with not_started status (user needs to select deck first)
      const newAttempt = await tx.flashcard_session_attempts.create({
        data: {
          flashcard_session_id: flashcardSession.id,
          attempt_number: flashcardSession.number_of_attempts + 1,
          started_at: new Date(),
          status: 'active'
        }
      })

      await tx.flashcard_sessions.update({
        where: { id: flashcardSession.id },
        data: {
          number_of_attempts: flashcardSession.number_of_attempts + 1
        }
      })

      return {
        attempt: newAttempt,
        userLearningSession
      }
    })

    return result
  }
}
