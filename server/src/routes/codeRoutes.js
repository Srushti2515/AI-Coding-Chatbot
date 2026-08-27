import express from 'express';
import {
  executeCode,
  explainCode,
  debugCode,
  optimizeCode,
  generateCode,
  convertCode,
} from '../controllers/codeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/execute', executeCode);
router.use(protect); // Require auth for code developer tools

router.post('/explain', explainCode);
router.post('/debug', debugCode);
router.post('/optimize', optimizeCode);
router.post('/generate', generateCode);
router.post('/convert', convertCode);

export default router;
