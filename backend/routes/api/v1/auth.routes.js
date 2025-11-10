import express from 'express';
import authController from '../../../controllers/api/v1/auth.controller.js';

const router = express.Router();

router.post('/v1/login', authController.login);
router.post('/logout', authController.logout);

export default router;
