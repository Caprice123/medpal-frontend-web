import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import tagGroupController from '#controllers/api/v1/tagGroup.controller'

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

// Get all tag groups (available for all authenticated users)
router.get('/', asyncHandler(tagGroupController.index.bind(tagGroupController)))

export default router
