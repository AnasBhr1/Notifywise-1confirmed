import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';
import { config } from '../config/env';

// Middleware to verify JWT token
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header or cookie
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user account deactivated.'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      businessName: user.businessName,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }

  next();
};

// Middleware to check if user owns the resource (optional userId parameter)
export const requireOwnership = (userIdParam: string = 'userId') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // User can only access their own resources
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.token;
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : cookieToken;

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          businessName: user.businessName,
          role: user.role
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting for auth endpoints
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const key = req.ip + (req.body.email || '');
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old attempts
    for (const [attemptKey, timestamp] of attempts.entries()) {
      if (timestamp < windowStart) {
        attempts.delete(attemptKey);
      }
    }

    // Count recent attempts
    let recentAttempts = 0;
    for (const [attemptKey, timestamp] of attempts.entries()) {
      if (attemptKey.startsWith(key) && timestamp >= windowStart) {
        recentAttempts++;
      }
    }

    if (recentAttempts >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Please try again in ${Math.ceil(windowMs / 60000)} minutes.`
      });
    }

    // Record this attempt
    attempts.set(`${key}_${now}`, now);
    next();
  };
};