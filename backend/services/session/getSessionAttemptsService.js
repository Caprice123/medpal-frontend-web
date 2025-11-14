import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSessionAttemptsService extends BaseService {
  static async call({ userLearningSessionId, userId }) {
    // Validate inputs
    if (!userLearningSessionId) {
      throw new ValidationError('User learning session ID is required')
    }

    // Get the learning session with exercise session and all attempts
    const userLearningSession = await prisma.user_learning_sessions.findUnique({
      where: { id: parseInt(userLearningSessionId) },
      include: {
        exercise_sessions: {
          include: {
            exercise_session_attempts: {
              include: {
                exercise_topics: {
                  select: {
                    id: true,
                    title: true,
                    description: true
                  }
                }
              },
              orderBy: {
                attempt_number: 'desc'
              }
            }
          }
        }
      }
    })

    if (!userLearningSession) {
      throw new ValidationError('Learning session not found')
    }

    if (userId && userLearningSession.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized')
    }

    // Get exercise session
    const exerciseSession = userLearningSession.exercise_sessions[0]

    if (!exerciseSession) {
      throw new ValidationError('No exercise session found')
    }

    // Transform attempts
    const attempts = exerciseSession.exercise_session_attempts.map(attempt => {
      const percentage = attempt.total_questions > 0
        ? Math.round((attempt.score / attempt.total_questions) * 100)
        : 0

      return {
        id: attempt.id,
        attempt_number: attempt.attempt_number,
        exercise_topic_id: attempt.exercise_topic_id,
        topic_title: attempt.exercise_topics?.title || 'No topic selected',
        topic_description: attempt.exercise_topics?.description || '',
        credits_used: attempt.credits_used,
        started_at: attempt.started_at,
        completed_at: attempt.completed_at,
        status: attempt.status,
        score: attempt.score,
        total_questions: attempt.total_questions,
        percentage
      }
    })

    return {
      user_learning_session_id: userLearningSession.id,
      type: userLearningSession.type,
      status: userLearningSession.status,
      started_at: userLearningSession.started_at,
      ended_at: userLearningSession.ended_at,
      attempts
    }
  }
}
