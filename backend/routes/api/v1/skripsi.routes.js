import express from 'express'
import SkripsiSetsController from '#controllers/api/v1/skripsiSets.controller'
import SkripsiTabsController from '#controllers/api/v1/skripsiTabs.controller'
import { authenticateToken } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'
import { checkFeature } from '#middleware/checkFeature.middleware'

const router = express.Router()

// Skripsi Sets - all under /skripsi/sets
router.get('/skripsi/sets', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.getSets))
router.post('/skripsi/sets', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.createSet))
router.post('/skripsi/export-word', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.exportToWord))
router.get('/skripsi/sets/:id', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.getSet))
router.put('/skripsi/sets/:id', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.updateSet))
router.put('/skripsi/sets/:id/content', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.updateContent))
router.delete('/skripsi/sets/:id', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiSetsController.deleteSet))

// Skripsi Tabs - under /skripsi/tabs
// router.put('/skripsi/tabs/:id', authenticateToken, asyncHandler(SkripsiTabsController.updateTab)) // Deprecated - use /skripsi/sets/:id/content instead
router.get('/skripsi/tabs/:tabId/messages', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiTabsController.getMessages))
router.post('/skripsi/tabs/:id/messages', authenticateToken, checkFeature('skripsi_is_active', 'Fitur Skripsi Builder sedang tidak aktif'), asyncHandler(SkripsiTabsController.sendMessage))

export default router
