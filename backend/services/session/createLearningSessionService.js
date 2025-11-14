import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class CreateLearningSessionService extends BaseService {
  static async call({ userId, type = 'exercise' }) {
    // Create parent learning session
    const userLearningSession = await prisma.user_learning_sessions.create({
      data: {
        user_id: parseInt(userId),
        type,
        status: 'active'
      }
    })

    // Create the appropriate child session based on type
    let childSession = null

    if (type === 'exercise') {
      childSession = await prisma.exercise_sessions.create({
        data: {
          user_learning_session_id: userLearningSession.id,
          user_id: parseInt(userId),
          status: 'not_started'
        }
      })
    }

    return {
      userLearningSession,
      childSession
    }
  }
}
