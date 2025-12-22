import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { ValidationError } from '../../errors/validationError.js'

export class GetConversationService extends BaseService {
  static async call({ userId, conversationId }) {
    this.validate({ userId, conversationId })

    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        is_deleted: false
      },
      include: {
        _count: {
          select: {
            chatbot_messages: {
              where: { is_deleted: false }
            }
          }
        }
      }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    // Verify ownership
    if (conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    return {
      id: conversation.id,
      topic: conversation.topic,
      messageCount: conversation._count.chatbot_messages,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at
    }
  }

  static validate({ userId, conversationId }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId || isNaN(parseInt(conversationId))) {
      throw new ValidationError('Invalid conversation ID')
    }
  }
}
