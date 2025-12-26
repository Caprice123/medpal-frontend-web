import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteConversationService extends BaseService {
  static async call({ userId, conversationId }) {
    this.validate({ userId, conversationId })

    const conversation = await prisma.chatbot_conversations.findUnique({
      where: { id: conversationId },
      select: { user_id: true, is_deleted: true }
    })

    if (!conversation || conversation.is_deleted) {
      throw new ValidationError('Conversation not found')
    }

    // Verify ownership
    if (conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    // Soft delete
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: { is_deleted: true }
    })

    return true
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
