import express from 'express'
import calculatorController from '#controllers/api/v1/calculator.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Calculator endpoints
router.get('/topics', asyncHandler(calculatorController.getTopics.bind(calculatorController)))
router.get('/topics/:topicId', asyncHandler(calculatorController.getTopicDetail.bind(calculatorController)))
router.post('/:topicId/calculate', asyncHandler(calculatorController.calculate.bind(calculatorController)))

export default router
