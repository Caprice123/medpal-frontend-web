import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSessionDetailService extends BaseService {
  static async call({ sessionId, userId }) {
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        exercise_session: true,
        flashcard_session: true
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Sesi not found')
    }

    // Verify user owns this attempt
    if (userId && userLearningSession.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this attempt')
    }

    return {
      id: userLearningSession.id,
      title: userLearningSession.title,
      type: userLearningSession.type,
      session_type: userLearningSession.type,
      created_at: userLearningSession.created_at,
      exerciseSession: await this.populateExerciseQuestionData({ userLearningSession }),
      flashcardSession: await this.populateFlashcardData({ userLearningSession })
    }
  }

  static async populateExerciseQuestionData({ userLearningSession }) {
    // TODO: change exercise into from constant table
    if (userLearningSession.type != "exercise") {
        return
    }

    return {
        totalQuestion: userLearningSession.exercise_session.total_question,
    }
  }

  static async populateFlashcardData({ userLearningSession }) {
    if (userLearningSession.type != "flashcard") {
        return
    }

    return {
        totalCards: userLearningSession.flashcard_session.total_cards,
    }
  }
}
