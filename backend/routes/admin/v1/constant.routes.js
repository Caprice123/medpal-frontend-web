import express from 'express'
import constantController from '#controllers/admin/v1/constant.controller'
import { asyncHandler } from '#utils/asyncHandler'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'

const router = express.Router()

// Get constants (optionally filtered by keys)
router.get('/', authenticateToken, requireAdmin, asyncHandler(constantController.index.bind(constantController)))

// Update constants
router.put('/', authenticateToken, requireAdmin, asyncHandler(constantController.update.bind(constantController)))

export default router
