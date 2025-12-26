import express from 'express'
import {
  getUserCreditBalance,
  getUserCreditTransactions,
  purchaseCredit,
  confirmPayment,
  deductCredits,
  addBonusCredits,
  getAllCreditTransactions
} from '#controllers/credit.controller'
import { authenticateToken, requireAdmin } from '#middleware/auth.middleware'
import { asyncHandler } from '#utils/asyncHandler'

const router = express.Router()

// User routes
router.get('/balance', authenticateToken, asyncHandler(getUserCreditBalance))
router.get('/transactions', authenticateToken, asyncHandler(getUserCreditTransactions))
router.post('/purchase', authenticateToken, asyncHandler(purchaseCredit))
router.post('/deduct', authenticateToken, asyncHandler(deductCredits))

// Admin routes
router.get('/transactions/all', authenticateToken, requireAdmin, asyncHandler(getAllCreditTransactions))
router.post('/confirm/:transactionId', authenticateToken, requireAdmin, asyncHandler(confirmPayment))
router.post('/bonus', authenticateToken, requireAdmin, asyncHandler(addBonusCredits))

export default router
