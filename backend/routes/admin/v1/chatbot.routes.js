import express from 'express'
import ChatbotAdminController from '#controllers/admin/v1/chatbot.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

router.use(authenticateToken)
router.use(requireAdmin)

// Conversation management
router.get('/conversations', asyncHandler(ChatbotAdminController.getConversations))
router.get('/conversations/:id', asyncHandler(ChatbotAdminController.getConversation))
router.get('/conversations/:id/messages', asyncHandler(ChatbotAdminController.getConversationMessages))
router.delete('/conversations/:id', asyncHandler(ChatbotAdminController.deleteConversation))

export default router
