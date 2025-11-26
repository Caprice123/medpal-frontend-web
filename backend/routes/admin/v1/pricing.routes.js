import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import pricingPlanController from '../../../controllers/admin/v1/pricing.controller.js'

const router = express.Router()

// Admin routes (all require authentication and admin role)
router.get('/', authenticateToken, requireAdmin, asyncHandler(pricingPlanController.index.bind(pricingPlanController)))
router.get('/:id', authenticateToken, requireAdmin, asyncHandler(pricingPlanController.show.bind(pricingPlanController)))
router.post('/', authenticateToken, requireAdmin, asyncHandler(pricingPlanController.create.bind(pricingPlanController)))
router.put('/:id', authenticateToken, requireAdmin, asyncHandler(pricingPlanController.update.bind(pricingPlanController)))
router.patch('/:id/toggle', authenticateToken, requireAdmin, asyncHandler(pricingPlanController.toggle.bind(pricingPlanController)))

export default router
