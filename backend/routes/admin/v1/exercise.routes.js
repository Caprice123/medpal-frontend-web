import express from 'express'
import exerciseController from '../../../controllers/admin/v1/exercise.controller.js'
import { authenticateToken, requireAdmin } from '../../../middleware/auth.middleware.js'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Generate questions using Gemini (without saving)
router.post('/generate', exerciseController.generateQuestions.bind(exerciseController))

// Topic CRUD
router.post('/topics', exerciseController.createTopic.bind(exerciseController))
router.get('/topics', exerciseController.getTopics.bind(exerciseController))
router.get('/topics/:id', exerciseController.getTopic.bind(exerciseController))
router.delete('/topics/:id', exerciseController.deleteTopic.bind(exerciseController))

// Question management
router.put('/topics/:id/questions', exerciseController.updateQuestions.bind(exerciseController))
router.post('/topics/:id/questions', exerciseController.addQuestion.bind(exerciseController))

// Tags
router.get('/tags', exerciseController.getTags.bind(exerciseController))

export default router
