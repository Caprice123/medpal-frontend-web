import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'

export class GetUserSessionsService extends BaseService {
  static async call({ userId, status = null, page = 1, perPage = 30 }) {
    // Calculate limit and offset from page and perPage
    const limit = parseInt(perPage)
    const offset = (parseInt(page) - 1) * limit

    // Build where clause
    const where = {
        user_id: parseInt(userId)
    }

    if (status) {
        where.status = status
    }

    // Fetch limit + 1 to check if there are more results
    const sessions = await prisma.user_learning_sessions.findMany({
        where,
        orderBy: {
            id: 'desc'
        },
        take: limit + 1,
        skip: offset
    })

    // Check if there are more results
    const hasMore = sessions.length > limit
    const isLastPage = !hasMore

    // Get only the requested number of sessions (exclude the extra one)
    const sessionsToReturn = hasMore ? sessions.slice(0, limit) : sessions

    return {
      data: sessionsToReturn,
      pagination: {
        page: parseInt(page),
        perPage: limit,
        isLastPage: isLastPage
      }
    }
  }
}
