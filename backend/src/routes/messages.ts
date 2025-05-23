import { Router } from 'express';
import {
  getMessages,
  getMessageStats,
  sendTestMessage
} from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { validateMessage, validateObjectId, validatePagination } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/stats', getMessageStats);
router.get('/', validatePagination, getMessages);
router.post('/test', sendTestMessage);

export default router;