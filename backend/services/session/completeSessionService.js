import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CompleteSessionService extends BaseService {
  static async call({ exerciseSessionId, userId }) {
    // Validate inputs
    if (!exerciseSessionId) {
      throw new ValidationError('Exercise session ID is required')
    }

    // Fetch the session with answers
    const session = await prisma.exercise_sessions.findUnique({
      where: { id: parseInt(exerciseSessionId) },
      include: {
        answers: true,
        user_learning_session: true
      }
    })

    if (!session) {
      throw new ValidationError('Exercise session not found')
    }

    if (userId && session.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to complete this session')
    }

    if (session.status !== 'active') {
      throw new ValidationError('Exercise session is already completed or abandoned')
    }

    // Update session and parent session to completed
    const updatedSession = await prisma.$transaction(async (tx) => {
      // Update exercise session
      const exerciseSession = await tx.exerciseSession.update({
        where: { id: parseInt(exerciseSessionId) },
        data: {
          status: 'completed',
          completed_at: new Date()
        }
      })

      // Update parent learning session
      await tx.userLearningSession.update({
        where: { id: session.user_learning_session_id },
        data: {
          status: 'completed',
          ended_at: new Date()
        }
      })

      return exerciseSession
    })

    // Calculate statistics
    const totalQuestions = session.total_questions
    const totalAnswered = session.answers.length
    const correctAnswers = session.score
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    return {
      session: updatedSession,
      statistics: {
        total_questions: totalQuestions,
        total_answered: totalAnswered,
        correct_answers: correctAnswers,
        percentage,
        credits_used: session.credits_used
      }
    }
  }
}
