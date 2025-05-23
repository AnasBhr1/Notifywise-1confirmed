import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

// Extended Request interface for authenticated routes
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    businessName: string;
    role: string;
  };
}

// Standard API Response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: string[];
}

// JWT Payload interface
export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  businessName: string;
  role: string;
}

// Model Interfaces
export interface IClient extends Document {
  _id: string;
  business: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  whatsappNumber: string;
  dateOfBirth?: Date;
  notes?: string;
  totalAppointments: number;
  lastAppointment?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  initials: string;
}

export interface IAppointment extends Document {
  _id: string;
  business: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  service: string;
  appointmentDate: Date;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  price?: number;
  currency?: string;
  notes?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  followUpSent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  endTime: Date;
  formattedDate: string;
  formattedTime: string;
  isUpcoming: boolean;
  isToday: boolean;
}

export interface IMessage extends Document {
  _id: string;
  business: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  type: 'confirmation' | 'reminder' | 'follow-up' | 'custom';
  content: string;
  whatsappMessageId?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deliveryTime?: number;
  readTime?: number;
  isOverdue: boolean;
  canRetry: boolean;
}

// Validation Error interface
export interface ValidationError {
  field: string;
  message: string;
}

// Request interfaces
export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  email?: string;
  whatsappNumber: string;
  dateOfBirth?: string;
  notes?: string;
}

export interface ClientUpdateRequest extends Partial<ClientCreateRequest> {}

export interface AppointmentCreateRequest {
  service: string;
  appointmentDate: string;
  duration: number;
  client?: string;
  price?: number;
  currency?: string;
  notes?: string;
}

export interface AppointmentUpdateRequest extends Partial<AppointmentCreateRequest> {
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
}

export interface BusinessUpdateRequest {
  name?: string;
  description?: string;
  whatsappNumber?: string;
  website?: string;
  address?: string;
  timeZone?: string;
  services?: string[];
}

export interface MessageSendRequest {
  phoneNumber: string;
  message: string;
  type?: 'confirmation' | 'reminder' | 'follow-up' | 'custom';
  scheduledFor?: string;
}