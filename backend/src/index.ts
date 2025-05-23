console.log('🚀 Starting NotifyWise Backend...');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { validateEnv } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import appointmentRoutes from './routes/appointments';
import clientRoutes from './routes/clients';
import messageRoutes from './routes/messages';
import publicRoutes from './routes/public';

// Load environment variables
dotenv.config();
console.log('📦 Environment variables loaded');

// Validate required environment variables
validateEnv();
console.log('✅ Environment variables validated');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
connectDB();

console.log('🛡️ Setting up security middleware...');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

console.log('⚡ Setting up rate limiting...');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth-specific rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes  
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});
app.use('/api/auth/', authLimiter);

console.log('📦 Setting up body parsing middleware...');

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  type: 'application/json',
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb',
}));
app.use(cookieParser());
app.use(compression());

console.log('📝 Setting up logging...');

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Custom request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

console.log('🛣️ Setting up routes...');

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'NotifyWise API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// API Info endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to NotifyWise API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      appointments: '/api/appointments',
      clients: '/api/clients', 
      messages: '/api/messages',
      public: '/api/public',
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/public', publicRoutes);

// API Documentation endpoint (placeholder)
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'API Documentation',
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      authentication: {
        register: 'POST /auth/register',
        login: 'POST /auth/login', 
        logout: 'POST /auth/logout',
        profile: 'GET /auth/profile',
        updateProfile: 'PUT /auth/profile',
        changePassword: 'POST /auth/change-password',
        refreshToken: 'POST /auth/refresh-token',
        verifyToken: 'GET /auth/verify-token',
        deleteAccount: 'DELETE /auth/account',
      },
      appointments: {
        list: 'GET /appointments',
        create: 'POST /appointments',
        get: 'GET /appointments/:id',
        update: 'PUT /appointments/:id',
        delete: 'DELETE /appointments/:id',
      },
      clients: {
        list: 'GET /clients',
        create: 'POST /clients',
        get: 'GET /clients/:id', 
        update: 'PUT /clients/:id',
        delete: 'DELETE /clients/:id',
      },
      messages: {
        list: 'GET /messages',
        send: 'POST /messages',
        get: 'GET /messages/:id',
        stats: 'GET /messages/stats',
        retry: 'POST /messages/:id/retry',
      },
      public: {
        businessInfo: 'GET /public/business/:businessId',
        availableSlots: 'GET /public/business/:businessId/slots',
        createBooking: 'POST /public/book',
      },
    },
  });
});

console.log('🚫 Setting up error handling...');

// 404 handler for undefined routes
app.use(notFound);

// Global error handling middleware (must be last)
app.use(errorHandler);

console.log('🚀 Starting server...');

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Unhandled promise rejection handling
process.on('unhandledRejection', (err: Error) => {
  console.error('💥 Unhandled promise rejection:', err);
  console.log('🛑 Shutting down server due to unhandled promise rejection');
  process.exit(1);
});

// Uncaught exception handling
process.on('uncaughtException', (err: Error) => {
  console.error('💥 Uncaught exception:', err);
  console.log('🛑 Shutting down server due to uncaught exception');
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(''); // Empty line for readability
  console.log('🎉 ============================================');
  console.log('🚀 NotifyWise Backend Server Started!');
  console.log('🎉 ============================================');
  console.log(`📍 Server running on port: ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔌 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
  console.log('🎉 ============================================');
  console.log('');
});

// Export for testing
export default app;