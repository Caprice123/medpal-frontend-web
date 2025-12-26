import express from 'express';
import { convertHtmlToDocxWithImages } from '../../../controllers/api/v1/htmlToDocx.controller.js';

const router = express.Router();

// POST /api/v1/html-to-docx/convert (using docx package with image support)
router.post('/convert', convertHtmlToDocxWithImages);

// Alias for backward compatibility
router.post('/convert-with-images', convertHtmlToDocxWithImages);

export default router;
