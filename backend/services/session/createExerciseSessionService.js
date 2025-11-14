import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class CreateExerciseSessionService extends BaseService {
  static async call({ userId, sessionId, exerciseTopicId }) {
    // Validate inputs
    if (!userId || !sessionId || !exerciseTopicId) {
      throw new ValidationError('User ID, Session ID and Exercise Topic ID are required')
    }

    // Fetch the topic with all questions and tags
    const topic = await prisma.exercise_topics.findFirst({
      where: {
        id: parseInt(exerciseTopicId),
        is_active: true
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!topic) {
      throw new ValidationError('Exercise topic not found or inactive')
    }

    if (!topic.questions || topic.questions.length === 0) {
      throw new ValidationError('Exercise topic has no questions')
    }

    console.log('Fetched topic:', JSON.stringify(topic, null, 2))

    // Get credit cost from constants
    const creditCostConstant = await prisma.constants.findUnique({
      where: { key: 'exercise_credit_cost' }
    })

    const creditsUsed = creditCostConstant ? parseInt(creditCostConstant.value) : 0

    // Check user has enough credits
    const userCredit = await prisma.user_credits.findUnique({
      where: { userId: parseInt(userId) }
    })

    if (!userCredit || userCredit.balance < creditsUsed) {
      throw new ValidationError('Insufficient credits')
    }

    // Create snapshot of topic
    const topicSnapshot = {
      id: topic.id,
      title: topic.title || 'Untitled',
      description: topic.description || '',
      content_type: topic.content_type || 'text',
      tags: (topic.tags || []).map(t => ({
        id: t.tag?.id || t.id,
        name: t.tag?.name || t.name || '',
        type: t.tag?.type || t.type || ''
      })),
      questions: (topic.questions || []).map(q => ({
        id: q.id,
        question: q.question || '',
        answer: q.answer || '',
        explanation: q.explanation || '',
        order: q.order || 0
      }))
    }

    console.log('Created snapshot:', JSON.stringify(topicSnapshot, null, 2))

    // Prepare data for transaction
    const topicTitle = topic.title || 'Untitled'
    const totalQuestions = topic.questions.length
    const userCreditId = userCredit.id
    const userBalance = userCredit.balance

    // Create session in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create parent learning session
      const userLearningSession = await tx.user_learning_sessions.findUnique({
        where: {
            id: sessionId,
        }
      })

      // Create exercise session
      const exerciseSession = await tx.exercise_questions.update({
        where: {
            user_learning_session_id: userLearningSession.id,
        },
        data: {
          topic_snapshot: JSON.stringify(topicSnapshot),
          credits_used: creditsUsed,
          status: 'active',
          score: 0,
          total_questions: totalQuestions
        }
      })

      // Deduct credits
      await tx.user_credits.update({
        where: { userId: parseInt(userId) },
        data: {
          balance: { decrement: creditsUsed }
        }
      })

      // Record credit transaction
      await tx.credit_transactions.create({
        data: {
          userId: parseInt(userId),
          userCreditId: userCreditId,
          type: 'deduction',
          amount: -creditsUsed,
          balanceBefore: userBalance,
          balanceAfter: userBalance - creditsUsed,
          description: `Exercise session: ${topicTitle}`,
          sessionId: exerciseSession.id
        }
      })

      return {
        userLearningSession,
        exerciseSession,
        topicSnapshot
      }
    })

    return result
  }
}
