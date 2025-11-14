import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import creditPlanController from '../../../controllers/api/v1/creditPlan.controller.js'

const router = express.Router()

// Public routes (authenticated users)
router.get('/', authenticateToken, asyncHandler(creditPlanController.index.bind(creditPlanController)))

export default router
