import express from 'express'
import ChatbotAdminController from '../../../controllers/admin/v1/chatbot.controller.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Conversation management
router.get('/conversations', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.getConversations))
router.get('/conversations/:id', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.getConversation))
router.get('/conversations/:id/messages', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.getConversationMessages))
router.delete('/conversations/:id', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.deleteConversation))

// Constants management (settings)
router.get('/constants', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.getConstants))
router.put('/constants', authenticateToken, requireAdmin, asyncHandler(ChatbotAdminController.updateConstants))

export default router
