import { Router } from 'express';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats
} from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';
import { validateClient, validateObjectId, validatePagination } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/stats', getClientStats);
router.get('/', validatePagination, getClients);
router.post('/', validateClient, createClient);
router.get('/:id', validateObjectId('id'), getClient);
router.put('/:id', validateObjectId('id'), validateClient, updateClient);
router.delete('/:id', validateObjectId('id'), deleteClient);

export default router;