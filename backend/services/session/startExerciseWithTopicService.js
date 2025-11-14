import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'
import { GetConstantsService } from '../constant/getConstantsService.js'

export class StartExerciseWithTopicService extends BaseService {
  static async call({ exerciseSessionId, exerciseTopicId, userId }) {
    const result = await prisma.$transaction(async (tx) => {
      // Get the exercise session
      const session = await tx.exerciseSession.findUnique({
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
      const topic = await tx.exerciseTopic.findUnique({
        where: { id: parseInt(exerciseTopicId) },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          },
          tags: {
            include: { tag: true }
          }
        }
      })

      if (!topic) {
        throw new ValidationError('Topic not found')
      }

      if (topic.questions.length === 0) {
        throw new ValidationError('Topic has no questions')
      }

      // Get credit cost from constants
      const constants = await GetConstantsService.call(['exercise_credit_cost'])
      const creditCost = parseInt(constants.exercise_credit_cost)

      // Get user credit
      const userCredit = await tx.userCredit.findUnique({
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
        tags: (topic.tags || []).map(t => ({
          id: t.tag?.id || t.id,
          name: t.tag?.name || t.name || '',
          type: t.tag?.type || t.type || ''
        }))
      }

      // Create question snapshots
      const questionSnapshots = topic.questions.map((q, index) => ({
        exercise_session_id: session.id,
        question_id: q.id,
        question_text: q.question || '',
        answer_text: q.answer || '',
        explanation: q.explanation || '',
        order: q.order !== undefined ? q.order : index
      }))

      await tx.exerciseSessionQuestion.createMany({
        data: questionSnapshots
      })

      // Update exercise session
      const updatedSession = await tx.exerciseSession.update({
        where: { id: session.id },
        data: {
          exercise_topic_id: topic.id,
          topic_snapshot: JSON.stringify(topicSnapshot),
          total_questions: topic.questions.length,
          credits_used: creditCost,
          status: 'active'
        },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      })

      // Deduct credits
      await tx.userCredit.update({
        where: { userId: parseInt(userId) },
        data: {
          balance: { decrement: creditCost }
        }
      })

      // Record credit transaction
      await tx.creditTransaction.create({
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
