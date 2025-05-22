import { Request } from 'express';
import { Document } from 'mongoose';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    businessName: string;
    role: string;
  };
}

// User Interface
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  businessName: string;
  whatsappSenderId?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Business Interface
export interface IBusiness extends Document {
  _id: string;
  owner: string; // User ID
  name: string;
  description?: string;
  whatsappNumber: string;
  website?: string;
  address?: string;
  timeZone: string;
  businessHours: {
    monday: { open: string; close: string; isOpen: boolean };
    tuesday: { open: string; close: string; isOpen: boolean };
    wednesday: { open: string; close: string; isOpen: boolean };
    thursday: { open: string; close: string; isOpen: boolean };
    friday: { open: string; close: string; isOpen: boolean };
    saturday: { open: string; close: string; isOpen: boolean };
    sunday: { open: string; close: string; isOpen: boolean };
  };
  services: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Client Interface
export interface IClient extends Document {
  _id: string;
  business: string; // Business ID
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
}

// Appointment Interface
export interface IAppointment extends Document {
  _id: string;
  business: string; // Business ID
  client: string; // Client ID
  service: string;
  appointmentDate: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  price?: number;
  currency?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  followUpSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Message Interface
export interface IMessage extends Document {
  _id: string;
  business: string; // Business ID
  appointment: string; // Appointment ID
  client: string; // Client ID
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
  createdAt: Date;
  updatedAt: Date;
}

// WhatsApp API Response
export interface WhatsAppResponse {
  success: boolean;
  message_id?: string;
  status?: string;
  error?: string;
  details?: any;
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Pagination Query
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  messagesSent: number;
  messagesDelivered: number;
  recentAppointments: IAppointment[];
  appointmentTrends: {
    date: string;
    count: number;
  }[];
}

// Booking Form Data
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email?: string;
  whatsappNumber: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

// Message Template
export interface MessageTemplate {
  type: 'confirmation' | 'reminder' | 'follow-up';
  template: string;
  variables: string[];
}