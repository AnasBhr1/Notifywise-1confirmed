import { Response } from 'express';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import Business from '../models/Business';
import { whatsappService } from '../services/whatsappService';

// Get message statistics
export const getMessageStats = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // For now, return mock data since we don't have a messages collection yet
  // In a real implementation, you would have a Message model and calculate real stats
  const mockStats = {
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    successRate: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  };

  const response: ApiResponse = {
    success: true,
    message: 'Message statistics retrieved successfully',
    data: mockStats
  };

  res.status(200).json(response);
});

// Get messages (placeholder for future implementation)
export const getMessages = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { page = 1, limit = 50 } = req.query;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Return empty array for now - implement when you add Message model
  const response: ApiResponse = {
    success: true,
    message: 'Messages retrieved successfully',
    data: [],
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: 0,
      totalPages: 0
    }
  };

  res.status(200).json(response);
});

// Send test message using real 1Confirmed API
export const sendTestMessage = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    throw new AppError('Phone number and message are required', 400);
  }

  // Validate phone number format
  if (!whatsappService.isValidPhoneNumber(phoneNumber)) {
    throw new AppError('Invalid phone number format. Use format: +212600000000 or 0600000000', 400);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  console.log(`📱 ${business.name} sending test message to ${phoneNumber}`);

  // Send the message using 1Confirmed WhatsApp service
  const result = await whatsappService.sendTextMessage(phoneNumber, message);

  if (result.success) {
    const response: ApiResponse = {
      success: true,
      message: 'Test message sent successfully via 1Confirmed',
      data: {
        phoneNumber,
        message,
        messageId: result.messageId,
        status: result.status,
        provider: '1Confirmed',
        sentAt: new Date(),
        apiResponse: result.data
      }
    };
    res.status(200).json(response);
  } else {
    throw new AppError(`Failed to send message via 1Confirmed: ${result.error}`, 500);
  }
});

// Send appointment confirmation
export const sendAppointmentConfirmation = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { phoneNumber, clientName, service, appointmentDate } = req.body;

  if (!phoneNumber || !clientName || !service || !appointmentDate) {
    throw new AppError('Phone number, client name, service, and appointment date are required', 400);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const appointmentDateObj = new Date(appointmentDate);
  
  // Send confirmation message
  const result = await whatsappService.sendAppointmentConfirmation(
    phoneNumber,
    clientName,
    service,
    appointmentDateObj,
    business.name
  );

  if (result.success) {
    const response: ApiResponse = {
      success: true,
      message: 'Appointment confirmation sent successfully',
      data: {
        phoneNumber,
        clientName,
        service,
        appointmentDate: appointmentDateObj,
        messageId: result.messageId,
        status: result.status,
        sentAt: new Date()
      }
    };
    res.status(200).json(response);
  } else {
    throw new AppError(`Failed to send confirmation: ${result.error}`, 500);
  }
});

// Send appointment reminder
export const sendAppointmentReminder = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { phoneNumber, clientName, service, appointmentDate, reminderType = '24h' } = req.body;

  if (!phoneNumber || !clientName || !service || !appointmentDate) {
    throw new AppError('Phone number, client name, service, and appointment date are required', 400);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const appointmentDateObj = new Date(appointmentDate);
  
  // Send reminder message
  const result = await whatsappService.sendAppointmentReminder(
    phoneNumber,
    clientName,
    service,
    appointmentDateObj,
    business.name,
    reminderType
  );

  if (result.success) {
    const response: ApiResponse = {
      success: true,
      message: 'Appointment reminder sent successfully',
      data: {
        phoneNumber,
        clientName,
        service,
        appointmentDate: appointmentDateObj,
        reminderType,
        messageId: result.messageId,
        status: result.status,
        sentAt: new Date()
      }
    };
    res.status(200).json(response);
  } else {
    throw new AppError(`Failed to send reminder: ${result.error}`, 500);
  }
});

// Test WhatsApp API connection
export const testWhatsAppConnection = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const result = await whatsappService.testConnection();

  const response: ApiResponse = {
    success: result.success,
    message: result.message,
    data: {
      apiConfigured: !!process.env.WHATSAPP_API_KEY,
      apiUrl: process.env.WHATSAPP_API_URL,
      timestamp: new Date()
    }
  };

  res.status(result.success ? 200 : 500).json(response);
});