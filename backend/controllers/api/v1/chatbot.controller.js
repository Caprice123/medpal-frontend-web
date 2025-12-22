import { GetConversationsService } from '../../../services/chatbot/getConversationsService.js'
import { CreateConversationService } from '../../../services/chatbot/createConversationService.js'
import { GetConversationService } from '../../../services/chatbot/getConversationService.js'
import { UpdateConversationService } from '../../../services/chatbot/updateConversationService.js'
import { DeleteConversationService } from '../../../services/chatbot/deleteConversationService.js'
import { GetMessagesService } from '../../../services/chatbot/getMessagesService.js'
import { SendMessageService } from '../../../services/chatbot/sendMessageService.js'
import { SubmitFeedbackService } from '../../../services/chatbot/submitFeedbackService.js'
import { GetChatbotConfigService } from '../../../services/chatbot/getChatbotConfigService.js'

class ChatbotController {
  // Get user's conversations
  async getConversations(req, res) {
    const userId = req.user.id
    const { page, perPage, search } = req.query

    const result = await GetConversationsService.call({
      userId,
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 20,
      search
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Create a new conversation
  async createConversation(req, res) {
    const userId = req.user.id
    const { topic, initialMode } = req.body

    const conversation = await CreateConversationService.call({
      userId,
      topic,
      initialMode
    })

    return res.status(201).json({
      success: true,
      data: conversation,
      message: 'Conversation created successfully'
    })
  }

  // Get conversation details with messages
  async getConversation(req, res) {
    const userId = req.user.id
    const { id } = req.params

    const conversation = await GetConversationService.call({
      userId,
      conversationId: parseInt(id)
    })

    return res.status(200).json({
      success: true,
      data: conversation
    })
  }

  // Update conversation (rename topic)
  async updateConversation(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const { topic } = req.body

    const conversation = await UpdateConversationService.call({
      userId,
      conversationId: parseInt(id),
      topic
    })

    return res.status(200).json({
      success: true,
      data: conversation,
      message: 'Conversation updated successfully'
    })
  }

  // Delete conversation (soft delete)
  async deleteConversation(req, res) {
    const userId = req.user.id
    const { id } = req.params

    await DeleteConversationService.call({
      userId,
      conversationId: parseInt(id)
    })

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    })
  }

  // Get messages for a conversation
  async getMessages(req, res) {
    const userId = req.user.id
    const { conversationId } = req.params
    const { page, perPage } = req.query

    const result = await GetMessagesService.call({
      userId,
      conversationId: parseInt(conversationId),
      page: parseInt(page) || 1,
      perPage: parseInt(perPage) || 50
    })

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })
  }

  // Send a message and get AI response (with streaming support)
  async sendMessage(req, res) {
    const userId = req.user.id
    const { conversationId } = req.params
    const { message, mode } = req.body

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    try {
      await SendMessageService.call({
        userId,
        conversationId: parseInt(conversationId),
        message,
        mode,
        onStream: (chunk) => {
          // Send streaming chunk to client
          res.write(`data: ${JSON.stringify(chunk)}\n\n`)
        },
        onComplete: (result) => {
          // Send final result
          res.write(`data: ${JSON.stringify({ type: 'done', data: result })}\n\n`)
          res.end()
        },
        onError: (error) => {
          res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
          res.end()
        }
      })
    } catch (error) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
      res.end()
    }
  }

  // Submit feedback for a message
  async submitFeedback(req, res) {
    const userId = req.user.id
    const { messageId } = req.params
    const { isHelpful, feedback } = req.body

    await SubmitFeedbackService.call({
      userId,
      messageId: parseInt(messageId),
      isHelpful,
      feedback
    })

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully'
    })
  }

  // Get chatbot configuration (available modes, costs, etc.)
  async getConfig(req, res) {
    const config = await GetChatbotConfigService.call()

    return res.status(200).json({
      success: true,
      data: config
    })
  }
}

export default new ChatbotController()
