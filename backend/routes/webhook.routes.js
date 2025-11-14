import express from 'express'
import {
  handleXenditInvoiceWebhook,
  handleXenditVAWebhook
} from '../controllers/webhook.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = express.Router()

// Xendit webhook endpoints (no authentication required - verified by token)
router.post('/xendit/invoice', asyncHandler(handleXenditInvoiceWebhook))
router.post('/xendit/va', asyncHandler(handleXenditVAWebhook))

export default router
