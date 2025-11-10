import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import creditPlanController from '../../../controllers/api/v1/creditPlan.controller.js'

const router = express.Router()

// Public routes (authenticated users)
router.get('/', authenticateToken, creditPlanController.index.bind(creditPlanController))

export default router
