import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login or create new user
 * @access  Public
 */
router.post('/v1/login', authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and deactivate session
 * @access  Private
 */
router.post('/logout', authController.logout);
export default router;
