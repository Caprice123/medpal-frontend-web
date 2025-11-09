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

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Public
 */
router.get('/verify', authController.verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions for current user
 * @access  Private
 */
router.get('/sessions', authenticate, authController.getSessions);

export default router;
