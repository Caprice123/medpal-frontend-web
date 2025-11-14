import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import exerciseController from '../../../controllers/api/v1/exercise.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Topic endpoints (for regular users)
router.get('/topics', asyncHandler(exerciseController.getTopics.bind(exerciseController)))
router.put('/start', asyncHandler(exerciseController.start.bind(exerciseController)))
router.get('/attempts', asyncHandler(exerciseController.attempts.bind(exerciseController)))
router.post('/attempts', asyncHandler(exerciseController.createNewAttempt.bind(exerciseController)))
router.post('/attempts/complete', asyncHandler(exerciseController.completeAttempt.bind(exerciseController)))

export default router
