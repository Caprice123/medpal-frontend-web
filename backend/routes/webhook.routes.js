import express from 'express'
import {
  handleXenditInvoiceWebhook,
  handleXenditVAWebhook
} from '../controllers/webhook.controller.js'

const router = express.Router()

// Xendit webhook endpoints (no authentication required - verified by token)
router.post('/xendit/invoice', handleXenditInvoiceWebhook)
router.post('/xendit/va', handleXenditVAWebhook)

export default router
