import { Router } from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
  updateAppointmentStatus
} from '../controllers/appointementController';
import { authenticateToken } from '../middleware/auth';
import { validateAppointment, validateObjectId, validatePagination } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes
router.get('/stats', getAppointmentStats);
router.get('/', validatePagination, getAppointments);
router.post('/', validateAppointment, createAppointment);
router.get('/:id', validateObjectId('id'), getAppointment);
router.put('/:id', validateObjectId('id'), validateAppointment, updateAppointment);
router.patch('/:id/status', validateObjectId('id'), updateAppointmentStatus);
router.delete('/:id', validateObjectId('id'), deleteAppointment);

export default router;