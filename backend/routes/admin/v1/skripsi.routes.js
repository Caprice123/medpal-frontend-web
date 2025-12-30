import express from 'express'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import SkripsiAdminController from '#controllers/admin/v1/skripsi.controller'

const router = express.Router()

// All routes require authentication and admin role
router.use(authenticateToken)
router.use(requireAdmin)

// Skripsi Sets management
router.get('/skripsi/sets', asyncHandler(SkripsiAdminController.index.bind(SkripsiAdminController)))
router.get('/skripsi/sets/:id', asyncHandler(SkripsiAdminController.show.bind(SkripsiAdminController)))
router.get('/skripsi/sets/:id/tabs', asyncHandler(SkripsiAdminController.getSetTabs.bind(SkripsiAdminController)))
router.delete('/skripsi/sets/:id', asyncHandler(SkripsiAdminController.destroy.bind(SkripsiAdminController)))

export default router
