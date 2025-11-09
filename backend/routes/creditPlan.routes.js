import express from 'express'
import {
  getAllCreditPlans,
  getActiveCreditPlans,
  getCreditPlanById,
  createCreditPlan,
  updateCreditPlan,
  deleteCreditPlan,
  toggleCreditPlanStatus
} from '../controllers/creditPlan.controller.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes (authenticated users)
router.get('/active', authenticateToken, getActiveCreditPlans)
router.get('/:id', authenticateToken, getCreditPlanById)

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllCreditPlans)
router.post('/', authenticateToken, requireAdmin, createCreditPlan)
router.put('/:id', authenticateToken, requireAdmin, updateCreditPlan)
router.delete('/:id', authenticateToken, requireAdmin, deleteCreditPlan)
router.patch('/:id/toggle', authenticateToken, requireAdmin, toggleCreditPlanStatus)

export default router
