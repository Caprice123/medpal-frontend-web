import express from 'express'
import flashcardController from '../../../controllers/admin/v1/flashcard.controller.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { uploadPDF } from '../../../middlewares/uploadPDF.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Generate flashcards using Gemini (without saving)
router.post('/generate', asyncHandler(flashcardController.generateCards.bind(flashcardController)))
router.post('/generate-from-pdf', uploadPDF, asyncHandler(flashcardController.generateCardsFromPDF.bind(flashcardController)))

// Deck CRUD
router.post('/', asyncHandler(flashcardController.create.bind(flashcardController)))
router.get('/', asyncHandler(flashcardController.index.bind(flashcardController)))
router.get('/:id', asyncHandler(flashcardController.show.bind(flashcardController)))
router.put('/:id', asyncHandler(flashcardController.update.bind(flashcardController)))

export default router
