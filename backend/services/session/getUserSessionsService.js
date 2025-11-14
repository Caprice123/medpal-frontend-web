import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetUserSessionsService extends BaseService {
  static async call({ userId, status = null, limit = 20, offset = 0 }) {
    const where = {
      user_id: parseInt(userId)
    }

    if (status) {
      where.status = status
    }

    const [sessions, total] = await Promise.all([
      prisma.exercise_sessions.findMany({
        where,
        include: {
          user_learning_sessions: true,
          exercise_topics: {
            select: {
              id: true,
              title: true,
              description: true
            }
          },
          exercise_session_answers: {
            select: {
              id: true,
              is_correct: true,
              answered_at: true
            }
          }
        },
        orderBy: {
          started_at: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.exercise_sessions.count({ where })
    ])

    // Transform sessions to include calculated fields
    const transformedSessions = sessions.map(session => {
      const topicSnapshot = session.topic_snapshot ? JSON.parse(session.topic_snapshot) : null
      const percentage = session.total_questions > 0
        ? Math.round((session.score / session.total_questions) * 100)
        : 0

      return {
        id: session.id,
        user_learning_session_id: session.user_learning_session_id,
        exercise_topic_id: session.exercise_topic_id,
        topic_title: topicSnapshot?.title || 'No topic selected',
        topic_description: topicSnapshot?.description || '',
        credits_used: session.credits_used,
        started_at: session.started_at,
        completed_at: session.completed_at,
        status: session.status,
        score: session.score,
        total_questions: session.total_questions,
        percentage,
        total_answered: session.exercise_session_answers.length,
        learning_session_status: session.user_learning_sessions.status
      }
    })

    return {
      sessions: transformedSessions,
      total,
      limit,
      offset
    }
  }
}
