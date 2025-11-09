import express from 'express'
import {
  getUserCreditBalance,
  getUserCreditTransactions,
  purchaseCredit,
  confirmPayment,
  deductCredits,
  addBonusCredits,
  getAllCreditTransactions
} from '../controllers/credit.controller.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js'

const router = express.Router()

// User routes
router.get('/balance', authenticateToken, getUserCreditBalance)
router.get('/transactions', authenticateToken, getUserCreditTransactions)
router.post('/purchase', authenticateToken, purchaseCredit)
router.post('/deduct', authenticateToken, deductCredits)

// Admin routes
router.get('/transactions/all', authenticateToken, requireAdmin, getAllCreditTransactions)
router.post('/confirm/:transactionId', authenticateToken, requireAdmin, confirmPayment)
router.post('/bonus', authenticateToken, requireAdmin, addBonusCredits)

export default router
