import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetUserSessionsService extends BaseService {
  static async call({ userId, status = null, limit = 20, offset = 0 }) {
    // Build where clause for attempts
    const attemptWhere = {
      exercise_sessions: {
        user_id: parseInt(userId)
      }
    }

    if (status) {
      attemptWhere.status = status
    }
    const sessions = await prisma.user_learning_sessions.findMany({
        where
    })


    return sessions
  }
}
