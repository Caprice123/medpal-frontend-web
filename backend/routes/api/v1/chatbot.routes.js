import express from 'express'
import ChatbotController from '../../../controllers/api/v1/chatbot.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Configuration
router.get('/config', authenticateToken, asyncHandler(ChatbotController.getConfig))

// Conversation management
router.get('/conversations', authenticateToken, asyncHandler(ChatbotController.getConversations))
router.post('/conversations', authenticateToken, asyncHandler(ChatbotController.createConversation))
router.get('/conversations/:id', authenticateToken, asyncHandler(ChatbotController.getConversation))
router.put('/conversations/:id', authenticateToken, asyncHandler(ChatbotController.updateConversation))
router.delete('/conversations/:id', authenticateToken, asyncHandler(ChatbotController.deleteConversation))

// Message management
router.get('/conversations/:conversationId/messages', authenticateToken, asyncHandler(ChatbotController.getMessages))
router.post('/conversations/:conversationId/send', authenticateToken, asyncHandler(ChatbotController.sendMessage))

// Message feedback
router.post('/messages/:messageId/feedback', authenticateToken, asyncHandler(ChatbotController.submitFeedback))

export default router
