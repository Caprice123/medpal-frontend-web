import express from 'express'
import exerciseController from '../../../controllers/admin/v1/exercise.controller.js'
import constantRoutes from './constant.routes.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { uploadPDF } from '../../../middlewares/uploadPDF.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Constants configuration for exercise feature
router.use('/constants', constantRoutes)

// Generate questions using Gemini (without saving)
router.post('/generate', asyncHandler(exerciseController.generateQuestions.bind(exerciseController)))
router.post('/generate-from-pdf', uploadPDF, asyncHandler(exerciseController.generateQuestionsFromPDF.bind(exerciseController)))

// Topic CRUD
router.post('/topics', asyncHandler(exerciseController.create.bind(exerciseController)))
router.get('/topics', asyncHandler(exerciseController.index.bind(exerciseController)))
router.get('/topics/:id', asyncHandler(exerciseController.show.bind(exerciseController)))
router.put('/topics/:id', asyncHandler(exerciseController.update.bind(exerciseController)))

export default router
