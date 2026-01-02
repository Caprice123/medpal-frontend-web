import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import subscriptionsController from '#controllers/admin/v1/subscriptions.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Add subscription for a user
// PUT /admin/v1/subscriptions
router.put('/', asyncHandler(subscriptionsController.addSubscription.bind(subscriptionsController)))

export default router
