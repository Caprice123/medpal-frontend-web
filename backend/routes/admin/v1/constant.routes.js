import express from 'express'
import constantController from '../../../controllers/admin/v1/constant.controller.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Note: Authentication and admin check are handled by parent router

// Get exercise constants (optionally filtered by keys)
router.get('/', asyncHandler(constantController.index.bind(constantController)))

// Update exercise constants
router.put('/', asyncHandler(constantController.update.bind(constantController)))

export default router
