import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import authController from '../../../controllers/api/v1/auth.controller.js';

const router = express.Router();

router.post('/v1/login', asyncHandler(authController.login.bind(authController)));
router.post('/logout', asyncHandler(authController.logout.bind(authController)));

export default router;
