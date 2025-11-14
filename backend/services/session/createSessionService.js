import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CreateSessionService extends BaseService {
  static async call({ userId, sessionType = 'exercise' }) {
    // Validate inputs
    if (!userId || !sessionType) {
      throw new ValidationError('User ID and Session Type are required')
    }

    const supportedSessionTypes = ["exercise"]
    if (!supportedSessionTypes.includes(sessionType)) {
      throw new ValidationError("Tipe sesi tidak didukung")
    }

    // Create session in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create parent learning session
      const userLearningSession = await tx.userLearningSession.create({
        data: {
          user_id: parseInt(userId),
          type: sessionType,
          status: 'active'
        }
      })

      // Create exercise session with not_started status
      let childSession = null
      if (sessionType === 'exercise') {
        childSession = await tx.exerciseSession.create({
          data: {
            user_learning_session_id: userLearningSession.id,
            user_id: parseInt(userId),
            status: 'not_started'
          }
        })
      }

      return {
        userLearningSession,
        exerciseSession: childSession
      }
    })

    return result
  }
}
