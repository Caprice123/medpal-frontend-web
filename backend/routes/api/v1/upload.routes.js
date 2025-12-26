import express from 'express'
import { authenticateToken } from '../../../middleware/auth.middleware.js'
import { uploadSingleImage } from '../../../middlewares/uploadSingleImage.js'
import uploadController from '../../../controllers/api/v1/upload.controller.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'

const router = express.Router()

// Upload image endpoint
router.post('/upload/image', authenticateToken, uploadSingleImage, asyncHandler(uploadController.uploadImage))

export default router
