import express from 'express';
import { asyncHandler } from '#utils/asyncHandler';
import authController from '#controllers/api/v1/auth.controller';

const router = express.Router();

router.post('/v1/login', asyncHandler(authController.login.bind(authController)));
router.post('/v1/refresh', asyncHandler(authController.refresh.bind(authController)));
router.post('/logout', asyncHandler(authController.logout.bind(authController)));

export default router;
