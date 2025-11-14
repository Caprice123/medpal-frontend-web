import express from 'express'
import sessionController from '../../../controllers/api/v1/session.controller.js'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Create a new exercise session
router.post('/', asyncHandler(sessionController.create.bind(sessionController)))

// Start exercise with topic selection
router.post('/:sessionId/start', asyncHandler(sessionController.startExerciseWithTopic.bind(sessionController)))

// Submit an answer for a question
router.post('/:sessionId/answer', asyncHandler(sessionController.submitAnswer.bind(sessionController)))

// Complete a session
router.post('/:sessionId/complete', asyncHandler(sessionController.completeSession.bind(sessionController)))

// Get user's session history
router.get('/', asyncHandler(sessionController.getUserSessions.bind(sessionController)))

// Get session detail
router.get('/:sessionId', asyncHandler(sessionController.getSessionDetail.bind(sessionController)))

export default router
