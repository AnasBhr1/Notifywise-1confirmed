import { Response } from 'express';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import Appointment from '../models/Appointment';
import Business from '../models/Business';
import Client from '../models/Client';

// Get all appointments for a business
export const getAppointments = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { 
    page = 1, 
    limit = 50, 
    status, 
    startDate, 
    endDate, 
    clientId,
    sort = 'appointmentDate',
    order = 'asc'
  } = req.query;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Build query
  const query: any = { business: business._id, isActive: true };
  
  if (status) {
    query.status = status;
  }

  if (clientId) {
    query.client = clientId;
  }

  if (startDate || endDate) {
    query.appointmentDate = {};
    if (startDate) query.appointmentDate.$gte = new Date(startDate as string);
    if (endDate) query.appointmentDate.$lte = new Date(endDate as string);
  }

  // Build sort
  const sortObj: any = {};
  sortObj[sort as string] = order === 'desc' ? -1 : 1;

  const skip = (Number(page) - 1) * Number(limit);
  
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('client', 'firstName lastName whatsappNumber email')
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Appointment.countDocuments(query)
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Appointments retrieved successfully',
    data: appointments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  };

  res.status(200).json(response);
});

// Get single appointment
export const getAppointment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const appointment = await Appointment.findOne({ 
    _id: id, 
    business: business._id, 
    isActive: true 
  }).populate('client', 'firstName lastName whatsappNumber email');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Appointment retrieved successfully',
    data: appointment
  };

  res.status(200).json(response);
});

// Create new appointment
export const createAppointment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { 
    service, 
    appointmentDate, 
    duration, 
    client: clientId, 
    price, 
    currency, 
    notes 
  } = req.body;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Validate client if provided
  if (clientId) {
    const client = await Client.findOne({
      _id: clientId,
      business: business._id,
      isActive: true
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }
  }

  // Check for conflicting appointments (optional - business logic)
  const appointmentDateTime = new Date(appointmentDate);
  const endTime = new Date(appointmentDateTime.getTime() + duration * 60000);

  const conflictingAppointment = await Appointment.findOne({
    business: business._id,
    isActive: true,
    status: { $nin: ['cancelled', 'completed'] },
    $or: [
      {
        appointmentDate: { $lt: endTime },
        $expr: {
          $gt: [
            { $add: ['$appointmentDate', { $multiply: ['$duration', 60000] }] },
            appointmentDateTime
          ]
        }
      }
    ]
  });

  if (conflictingAppointment) {
    throw new AppError('Time slot conflicts with existing appointment', 400);
  }

  // Create appointment
  const appointment = await Appointment.create({
    business: business._id,
    client: clientId || undefined,
    service,
    appointmentDate: appointmentDateTime,
    duration,
    price,
    currency,
    notes
  });

  // Populate client data
  await appointment.populate('client', 'firstName lastName whatsappNumber email');

  const response: ApiResponse = {
    success: true,
    message: 'Appointment created successfully',
    data: appointment
  };

  res.status(201).json(response);
});

// Update appointment
export const updateAppointment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const updateData = req.body;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Check if appointment exists and belongs to user's business
  const existingAppointment = await Appointment.findOne({
    _id: id,
    business: business._id,
    isActive: true
  });

  if (!existingAppointment) {
    throw new AppError('Appointment not found', 404);
  }

  // Validate client if being updated
  if (updateData.client) {
    const client = await Client.findOne({
      _id: updateData.client,
      business: business._id,
      isActive: true
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }
  }

  // Convert appointmentDate if provided
  if (updateData.appointmentDate) {
    updateData.appointmentDate = new Date(updateData.appointmentDate);
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('client', 'firstName lastName whatsappNumber email');

  const response: ApiResponse = {
    success: true,
    message: 'Appointment updated successfully',
    data: appointment
  };

  res.status(200).json(response);
});

// Delete appointment (soft delete)
export const deleteAppointment = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const appointment = await Appointment.findOneAndUpdate(
    { 
      _id: id, 
      business: business._id, 
      isActive: true 
    },
    { isActive: false },
    { new: true }
  );

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Appointment deleted successfully'
  };

  res.status(200).json(response);
});

// Get appointment statistics
export const getAppointmentStats = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const [
    totalAppointments,
    todayAppointments,
    thisMonthAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments
  ] = await Promise.all([
    Appointment.countDocuments({ business: business._id, isActive: true }),
    Appointment.countDocuments({
      business: business._id,
      isActive: true,
      appointmentDate: { $gte: today, $lt: tomorrow }
    }),
    Appointment.countDocuments({
      business: business._id,
      isActive: true,
      appointmentDate: { $gte: thisMonth, $lt: nextMonth }
    }),
    Appointment.countDocuments({
      business: business._id,
      isActive: true,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: today }
    }),
    Appointment.countDocuments({
      business: business._id,
      isActive: true,
      status: 'completed'
    }),
    Appointment.countDocuments({
      business: business._id,
      isActive: true,
      status: 'cancelled'
    })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Appointment statistics retrieved successfully',
    data: {
      totalAppointments,
      todayAppointments,
      thisMonthAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments
    }
  };

  res.status(200).json(response);
});

// Update appointment status
export const updateAppointmentStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const appointment = await Appointment.findOneAndUpdate(
    { 
      _id: id, 
      business: business._id, 
      isActive: true 
    },
    { status },
    { new: true, runValidators: true }
  ).populate('client', 'firstName lastName whatsappNumber email');

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Appointment status updated successfully',
    data: appointment
  };

  res.status(200).json(response);
});