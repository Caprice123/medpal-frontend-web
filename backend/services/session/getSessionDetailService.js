import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetSessionDetailService extends BaseService {
  static async call({ sessionId, userId }) {
    const session = await prisma.exercise_sessions.findUnique({
      where: { id: parseInt(sessionId) },
      include: {
        user_learning_sessions: true,
        exercise_topics: {
          select: {
            id: true,
            title: true,
            description: true
          }
        },
        exercise_session_questions: {
          orderBy: {
            order: 'asc'
          }
        },
        exercise_session_answers: {
          include: {
            exercise_session_questions: true
          },
          orderBy: {
            answered_at: 'asc'
          }
        }
      }
    })

    if (!session) {
      throw new ValidationError('Session not found')
    }

    // Verify user owns this session
    if (userId && session.user_id !== parseInt(userId)) {
      throw new ValidationError('Unauthorized to view this session')
    }

    // Parse topic snapshot (null if not started yet)
    let topicSnapshot = null
    if (session.topic_snapshot) {
      topicSnapshot = JSON.parse(session.topic_snapshot)
      // Add questions from session_questions table
      topicSnapshot.questions = session.exercise_session_questions.map(q => ({
        id: q.question_id,
        question: q.question_text,
        answer: q.answer_text,
        explanation: q.explanation,
        order: q.order
      }))
    }

    const answers = session.exercise_session_answers.map(answer => ({
      id: answer.id,
      question_id: answer.exercise_session_questions.question_id,
      question_text: answer.exercise_session_questions.question_text,
      answer_text: answer.exercise_session_questions.answer_text,
      user_answer: answer.user_answer,
      is_correct: answer.is_correct,
      answered_at: answer.answered_at,
      time_taken_seconds: answer.time_taken_seconds
    }))

    // Calculate statistics
    const percentage = session.total_questions > 0
      ? Math.round((session.score / session.total_questions) * 100)
      : 0

    return {
      id: session.id,
      user_learning_session_id: session.user_learning_session_id,
      exercise_topic_id: session.exercise_topic_id,
      topic_snapshot: topicSnapshot,
      credits_used: session.credits_used,
      started_at: session.started_at,
      completed_at: session.completed_at,
      status: session.status,
      score: session.score,
      total_questions: session.total_questions,
      percentage,
      answers,
      learning_session: {
        id: session.user_learning_sessions.id,
        status: session.user_learning_sessions.status,
        started_at: session.user_learning_sessions.started_at,
        ended_at: session.user_learning_sessions.ended_at
      }
    }
  }
}
