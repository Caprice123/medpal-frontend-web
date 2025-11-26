import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import pricingController from '../../../controllers/api/v1/pricing.controller.js'

const router = express.Router()

// Public route (no authentication required - for landing page)
router.get('/plans', asyncHandler(pricingController.getPlans.bind(pricingController)))

// Authenticated routes
router.get('/status', authenticateToken, asyncHandler(pricingController.getUserStatus.bind(pricingController)))
router.get('/history', authenticateToken, asyncHandler(pricingController.getPurchaseHistory.bind(pricingController)))
router.post('/purchase', authenticateToken, asyncHandler(pricingController.purchase.bind(pricingController)))

export default router
