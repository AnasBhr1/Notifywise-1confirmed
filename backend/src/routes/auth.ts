import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  verifyToken,
  deleteAccount,
} from '../controllers/authController';
import { authenticateToken, authRateLimit } from '../middleware/auth';
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange,
} from '../middleware/validation';

const router = Router();

// Auth rate limiting (5 attempts per 15 minutes)
const loginRateLimit = authRateLimit(5, 15 * 60 * 1000);

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', loginRateLimit, validateUserLogin, login);
router.post('/logout', logout);

// Protected routes (require authentication)
router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', validatePasswordChange, changePassword);
router.post('/refresh-token', refreshToken);
router.get('/verify-token', verifyToken);
router.delete('/account', deleteAccount);

export default router;