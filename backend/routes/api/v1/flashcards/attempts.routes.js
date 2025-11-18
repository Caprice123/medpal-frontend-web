import express from 'express'
import { authenticateToken } from '../../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../../utils/asyncHandler.js'
import flashcardAttemptsController from '../../../../controllers/api/v1/flashcards/attempts.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Attempt endpoints (for regular users)
router.get('/:attemptId', asyncHandler(flashcardAttemptsController.detail.bind(flashcardAttemptsController)))
router.put('/:attemptId/start', asyncHandler(flashcardAttemptsController.start.bind(flashcardAttemptsController)))
router.put('/:attemptId/complete', asyncHandler(flashcardAttemptsController.complete.bind(flashcardAttemptsController)))

export default router
