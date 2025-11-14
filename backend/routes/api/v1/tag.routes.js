import express from 'express'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import tagController from '../../../controllers/api/v1/tag.controller.js'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tags (available for all authenticated users)
router.get('/', asyncHandler(tagController.index.bind(tagController)))

// CRUD operations require admin role
router.post('/', requireAdmin, asyncHandler(tagController.create.bind(tagController)))
router.put('/:id', requireAdmin, asyncHandler(tagController.update.bind(tagController)))
router.delete('/:id', requireAdmin, asyncHandler(tagController.destroy.bind(tagController)))

export default router
