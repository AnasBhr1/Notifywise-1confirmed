import { Response } from 'express';
import { catchAsync, AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import Client from '../models/Client';
import Business from '../models/Business';

// Get all clients for a business
export const getClients = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { page = 1, limit = 50, search, sort = 'createdAt', order = 'desc' } = req.query;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Build query
  const query: any = { business: business._id, isActive: true };
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort
  const sortObj: any = {};
  sortObj[sort as string] = order === 'desc' ? -1 : 1;

  const skip = (Number(page) - 1) * Number(limit);
  
  const [clients, total] = await Promise.all([
    Client.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit)),
    Client.countDocuments(query)
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Clients retrieved successfully',
    data: clients,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  };

  res.status(200).json(response);
});

// Get single client
export const getClient = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const client = await Client.findOne({ 
    _id: id, 
    business: business._id, 
    isActive: true 
  });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Client retrieved successfully',
    data: client
  };

  res.status(200).json(response);
});

// Create new client
export const createClient = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  console.log('Creating client with data:', req.body); // Debug log

  const { firstName, lastName, email, whatsappNumber, dateOfBirth, notes } = req.body;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  // Check if client with same WhatsApp number already exists
  const existingClient = await Client.findOne({
    business: business._id,
    whatsappNumber,
    isActive: true
  });

  if (existingClient) {
    throw new AppError('Client with this WhatsApp number already exists', 400);
  }

  // Create client
  const clientData = {
    business: business._id,
    firstName,
    lastName,
    whatsappNumber,
    email: email || undefined,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    notes: notes || undefined
  };

  console.log('Creating client with processed data:', clientData); // Debug log

  const client = await Client.create(clientData);

  const response: ApiResponse = {
    success: true,
    message: 'Client created successfully',
    data: client
  };

  console.log('Client created successfully:', client._id); // Debug log

  res.status(201).json(response);
});

// Update client
export const updateClient = catchAsync(async (req: AuthRequest, res: Response) => {
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

  // Check if client exists and belongs to user's business
  const existingClient = await Client.findOne({
    _id: id,
    business: business._id,
    isActive: true
  });

  if (!existingClient) {
    throw new AppError('Client not found', 404);
  }

  // If updating WhatsApp number, check for duplicates
  if (updateData.whatsappNumber && updateData.whatsappNumber !== existingClient.whatsappNumber) {
    const duplicateClient = await Client.findOne({
      business: business._id,
      whatsappNumber: updateData.whatsappNumber,
      isActive: true,
      _id: { $ne: id }
    });

    if (duplicateClient) {
      throw new AppError('Client with this WhatsApp number already exists', 400);
    }
  }

  // Convert dateOfBirth to Date if provided
  if (updateData.dateOfBirth) {
    updateData.dateOfBirth = new Date(updateData.dateOfBirth);
  }

  const client = await Client.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  const response: ApiResponse = {
    success: true,
    message: 'Client updated successfully',
    data: client
  };

  res.status(200).json(response);
});

// Delete client (soft delete)
export const deleteClient = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  const { id } = req.params;

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const client = await Client.findOneAndUpdate(
    { 
      _id: id, 
      business: business._id, 
      isActive: true 
    },
    { isActive: false },
    { new: true }
  );

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Client deleted successfully'
  };

  res.status(200).json(response);
});

// Get client statistics
export const getClientStats = catchAsync(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401);
  }

  // Get user's business
  const business = await Business.findOne({ owner: req.user.id, isActive: true });
  if (!business) {
    throw new AppError('Business not found', 404);
  }

  const [totalClients, newThisMonth, newThisWeek] = await Promise.all([
    Client.countDocuments({ business: business._id, isActive: true }),
    Client.countDocuments({
      business: business._id,
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    }),
    Client.countDocuments({
      business: business._id,
      isActive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Client statistics retrieved successfully',
    data: {
      totalClients,
      newThisMonth,
      newThisWeek
    }
  };

  res.status(200).json(response);
});