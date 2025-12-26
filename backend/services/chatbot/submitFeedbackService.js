import prisma from '#prisma/client'
import { BaseService } from '#baseService.js'
import { ValidationError } from '#errors/validationError'

export class SubmitFeedbackService extends BaseService {
  static async call({ userId, messageId, isHelpful, feedback }) {
    this.validate({ userId, messageId, isHelpful, feedback })

    // Verify message exists
    const message = await prisma.chatbot_messages.findFirst({
      where: {
        id: messageId,
        is_deleted: false,
        sender_type: 'ai' // Can only give feedback on AI messages
      },
      include: {
        chatbot_conversation: {
          select: { user_id: true, is_deleted: true }
        }
      }
    })

    if (!message || message.chatbot_conversation.is_deleted) {
      throw new ValidationError('Message not found')
    }

    // Verify user has access to this conversation
    if (message.chatbot_conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    // Upsert feedback (update if exists, create if not)
    await prisma.chatbot_message_feedbacks.upsert({
      where: {
        message_id_user_id: {
          message_id: messageId,
          user_id: userId
        }
      },
      update: {
        is_helpful: isHelpful,
        feedback: feedback || null
      },
      create: {
        message_id: messageId,
        user_id: userId,
        is_helpful: isHelpful,
        feedback: feedback || null
      }
    })

    return true
  }

  static validate({ userId, messageId, isHelpful, feedback }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!messageId || isNaN(parseInt(messageId))) {
      throw new ValidationError('Invalid message ID')
    }

    if (typeof isHelpful !== 'boolean') {
      throw new ValidationError('isHelpful must be a boolean')
    }

    if (feedback && typeof feedback !== 'string') {
      throw new ValidationError('Feedback must be a string')
    }

    if (feedback && feedback.length > 1000) {
      throw new ValidationError('Feedback is too long (max 1000 characters)')
    }
  }
}
