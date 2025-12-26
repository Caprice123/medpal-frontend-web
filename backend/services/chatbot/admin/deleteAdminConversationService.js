import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteAdminConversationService extends BaseService {
  static async call({ conversationId }) {
    this.validate({ conversationId })

    const conversation = await prisma.chatbot_conversations.findUnique({
      where: { id: conversationId },
      select: { id: true, is_deleted: true }
    })

    if (!conversation || conversation.is_deleted) {
      throw new ValidationError('Conversation not found')
    }

    // Hard delete for admin (cascade delete will handle messages, sources, feedbacks)
    await prisma.chatbot_conversations.delete({
      where: { id: conversationId }
    })

    return true
  }

  static validate({ conversationId }) {
    if (!conversationId || isNaN(parseInt(conversationId))) {
      throw new ValidationError('Invalid conversation ID')
    }
  }
}
