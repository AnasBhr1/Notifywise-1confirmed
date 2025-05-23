import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import User from '../models/User';
import Business from '../models/Business';
import { config } from '../config/env';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

// Set JWT cookie
const setTokenCookie = (res: Response, token: string): void => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('token', token, cookieOptions);
};

// Register new user
export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, businessName, whatsappSenderId } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    businessName,
    whatsappSenderId,
  });

  // Create default business for the user
  const business = await Business.create({
    owner: user._id,
    name: businessName,
    whatsappNumber: whatsappSenderId || '',
    services: ['General Consultation'], // Default service
  });

  // Generate token
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Remove password from response
  const userResponse = user.toJSON() as any;
  if (userResponse.password) {
    delete userResponse.password;
  }

  const response: ApiResponse = {
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      business,
      token,
    },
  };

  res.status(201).json(response);
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email, isActive: true }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  // Get user's business
  const business = await Business.findOne({ owner: user._id, isActive: true });

  // Generate token
  const token = generateToken(user._id);
  setTokenCookie(res, token);

  // Remove password from response
  const userResponse = user.toJSON() as any;
  if (userResponse.password) {
    delete userResponse.password;
  }

  const response: ApiResponse = {
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      business,
      token,
    },
  };

  res.status(200).json(response);
});

// Logout user
export const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear cookie
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.status(200).json(response);
});

// Get current user profile
export const getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const user = await User.findById(req.user.id);
  const business = await Business.findOne({ owner: req.user.id, isActive: true });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Profile retrieved successfully',
    data: {
      user,
      business,
    },
  };

  res.status(200).json(response);
});

// Update user profile
export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { businessName, whatsappSenderId } = req.body;

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      ...(businessName && { businessName }),
      ...(whatsappSenderId && { whatsappSenderId }),
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update business if business name changed
  if (businessName) {
    await Business.findOneAndUpdate(
      { owner: req.user.id },
      { name: businessName },
      { new: true }
    );
  }

  const response: ApiResponse = {
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  };

  res.status(200).json(response);
});

// Change password
export const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully',
  };

  res.status(200).json(response);
});

// Refresh token
export const refreshToken = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Generate new token
  const token = generateToken(req.user.id);
  setTokenCookie(res, token);

  const response: ApiResponse = {
    success: true,
    message: 'Token refreshed successfully',
    data: { token },
  };

  res.status(200).json(response);
});

// Verify token (for frontend to check if user is still authenticated)
export const verifyToken = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Token is invalid or expired', 401);
  }

  const user = await User.findById(req.user.id);
  
  if (!user || !user.isActive) {
    throw new AppError('User account is deactivated', 401);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        id: user._id,
        email: user.email,
        businessName: user.businessName,
        role: user.role,
      },
    },
  };

  res.status(200).json(response);
});

// Delete account (soft delete)
export const deleteAccount = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { password } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password
  if (!(await user.comparePassword(password))) {
    throw new AppError('Password is incorrect', 400);
  }

  // Soft delete user and business
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  await Business.findOneAndUpdate({ owner: req.user.id }, { isActive: false });

  // Clear cookie
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };

  res.status(200).json(response);
});