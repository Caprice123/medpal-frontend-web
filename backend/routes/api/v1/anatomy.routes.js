import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import anatomyController from '../../../controllers/api/v1/anatomy.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all published anatomy quizzes
router.get('/', asyncHandler(anatomyController.index.bind(anatomyController)))

// Get single quiz for user to take
router.get('/:id', asyncHandler(anatomyController.show.bind(anatomyController)))

// Submit answers for a quiz (simpler approach without sessions)
router.post(
  '/:id/submit',
  asyncHandler(anatomyController.submit.bind(anatomyController))
)

export default router
