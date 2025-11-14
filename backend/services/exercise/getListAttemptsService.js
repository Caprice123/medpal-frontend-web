import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetListAttemptsService extends BaseService {
  static async call({ userLearningSessionId, userId }) {
    // Validate inputs
    if (!userLearningSessionId) {
      throw new ValidationError('User learning session ID is required')
    }

    // Get the learning session with exercise session and all attempts
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(userLearningSessionId), userId: userId },
      include: {
        exercise_sessions: {
          include: {
            exercise_session_attempts: {
              select: {
                attempt_number: true,
                started_at: true,
                completed_at: true,
                score: true,
              },
              orderBy: {
                id: 'desc'
              }
            },
          }
        }
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Learning session not found')
    }

    // Get exercise session
    const exerciseSession = userLearningSession.exercise_sessions[0]

    if (!exerciseSession) {
      throw new ValidationError('No exercise session found')
    }

    // Transform attempts
    const attempts = exerciseSession.exercise_session_attempts.map(attempt => {
      return {
        id: attempt.id,
        attempt_number: attempt.attempt_number,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
        status: attempt.status,
        score: attempt.score,
      }
    })

    return attempts
  }
}
