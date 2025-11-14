import express from 'express'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { authenticate } from '../../../middleware/auth.middleware.js'
import featureController from '../../../controllers/api/v1/feature.controller.js'

const router = express.Router()

// All feature routes require authentication
router.use(authenticate)

// GET /api/v1/features - Get all active features
router.get('/', asyncHandler(featureController.index.bind(featureController)))

export default router
