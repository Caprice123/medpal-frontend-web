import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import creditPlanController from '../../../controllers/admin/v1/creditPlan.controller.js'

const router = express.Router()

// Admin routes (all require authentication and admin role)
router.get('/', authenticateToken, requireAdmin, creditPlanController.index.bind(creditPlanController))
router.post('/', authenticateToken, requireAdmin, creditPlanController.create.bind(creditPlanController))
router.put('/:id', authenticateToken, requireAdmin, creditPlanController.update.bind(creditPlanController))
router.patch('/:id/toggle', authenticateToken, requireAdmin, creditPlanController.toggle.bind(creditPlanController))

export default router
