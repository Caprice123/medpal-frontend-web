import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import flashcardController from '../../../controllers/api/v1/flashcard.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Deck endpoints (for regular users)
router.get('/decks', asyncHandler(flashcardController.getDecks.bind(flashcardController)))
router.get('/:userLearningSessionId/attempts', asyncHandler(flashcardController.attempts.bind(flashcardController)))
router.post('/:userLearningSessionId/attempts', asyncHandler(flashcardController.createAttempt.bind(flashcardController)))

export default router
