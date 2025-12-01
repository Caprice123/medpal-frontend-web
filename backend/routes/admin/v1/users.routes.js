import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import usersController from '../../../controllers/admin/v1/users.controller.js'

const router = express.Router()

// All routes require authentication
// router.use(authenticateToken, requireAdmin)

// Get all tag groups (available for all authenticated users)
router.get('/', asyncHandler(usersController.index.bind(usersController)))
router.put('/credits', asyncHandler(usersController.addCredit.bind(usersController)))

export default router
