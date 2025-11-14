import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartExerciseWithTopicService extends BaseService {
  static async call({ exerciseSessionId, exerciseTopicId, userId }) {
    // Get credit cost from constants BEFORE transaction
    const constants = await GetConstantsService.call(['exercise_credit_cost'])
    const creditCost = parseInt(constants.exercise_credit_cost)

    const result = await prisma.$transaction(async (tx) => {
      // Get the exercise session
      const session = await tx.exercise_sessions.findUnique({
        where: { id: parseInt(exerciseSessionId) }
      })

      if (!session) {
        throw new ValidationError('Session not found')
      }

      if (session.user_id !== parseInt(userId)) {
        throw new ValidationError('Unauthorized')
      }

      if (session.status !== 'not_started') {
        throw new ValidationError('Session already started')
      }

      // Get the topic with questions
      const topic = await tx.exercise_topics.findUnique({
        where: { id: parseInt(exerciseTopicId) },
        include: {
          exercise_questions: {
            orderBy: { order: 'asc' }
          },
          exercise_topic_tags: {
            include: { tags: true }
          }
        }
      })

      if (!topic) {
        throw new ValidationError('Topic not found')
      }

      if (topic.exercise_questions.length === 0) {
        throw new ValidationError('Topic has no questions')
      }

      // Get user credit
      const userCredit = await tx.user_credits.findUnique({
        where: { userId: parseInt(userId) }
      })

      if (!userCredit || userCredit.balance < creditCost) {
        throw new ValidationError('Insufficient credits')
      }

      // Create topic snapshot
      const topicSnapshot = {
        id: topic.id,
        title: topic.title || 'Untitled',
        description: topic.description || '',
        content_type: topic.content_type || 'text',
        tags: (topic.exercise_topic_tags || []).map(t => ({
          id: t.tags?.id || t.id,
          name: t.tags?.name || t.name || '',
          type: t.tags?.type || t.type || ''
        })),
        questions: topic.exercise_questions.map((q, index) => ({
          id: q.id,
          question: q.question || '',
          answer: q.answer || '',
          explanation: q.explanation || '',
          order: q.order !== undefined ? q.order : index
        }))
      }

      // Create question snapshots for database
      const questionSnapshots = topic.exercise_questions.map((q, index) => ({
        exercise_session_id: session.id,
        question_id: q.id,
        question_text: q.question || '',
        answer_text: q.answer || '',
        explanation: q.explanation || '',
        order: q.order !== undefined ? q.order : index
      }))

      await tx.exercise_session_questions.createMany({
        data: questionSnapshots
      })

      // Update exercise session
      const updatedSession = await tx.exercise_sessions.update({
        where: { id: session.id },
        data: {
          exercise_topic_id: topic.id,
          topic_snapshot: JSON.stringify(topicSnapshot),
          total_questions: topic.exercise_questions.length,
          credits_used: creditCost,
          status: 'active'
        },
        include: {
          exercise_session_questions: {
            orderBy: { order: 'asc' }
          }
        }
      })

      // Deduct credits
      await tx.user_credits.update({
        where: { userId: parseInt(userId) },
        data: {
          balance: { decrement: creditCost }
        }
      })

      // Record credit transaction
      await tx.credit_transactions.create({
        data: {
          userId: parseInt(userId),
          userCreditId: userCredit.id,
          type: 'deduction',
          amount: -creditCost,
          balanceBefore: userCredit.balance,
          balanceAfter: userCredit.balance - creditCost,
          description: `Started exercise: ${topic.title}`,
          sessionId: session.id
        }
      })

      return {
        session: updatedSession,
        topicSnapshot
      }
    })

    return result
  }
}
