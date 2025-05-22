import mongoose, { Schema } from 'mongoose';
import { IClient } from '../types';

const clientSchema = new Schema<IClient>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Business reference is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    sparse: true // Allow multiple null values but unique non-null values
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid WhatsApp number']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(date: Date) {
        return date <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  totalAppointments: {
    type: Number,
    default: 0,
    min: [0, 'Total appointments cannot be negative']
  },
  lastAppointment: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for better performance
clientSchema.index({ business: 1, whatsappNumber: 1 }, { unique: true });
clientSchema.index({ business: 1, email: 1 }, { unique: true, sparse: true });
clientSchema.index({ business: 1, firstName: 1, lastName: 1 });
clientSchema.index({ business: 1, isActive: 1 });
clientSchema.index({ business: 1, lastAppointment: -1 });

// Virtual for full name
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for initials
clientSchema.virtual('initials').get(function() {
  return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
});

// Ensure virtual fields are serialized
clientSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to ensure unique WhatsApp number per business
clientSchema.pre('save', async function(next) {
  if (this.isModified('whatsappNumber') || this.isNew) {
    const existingClient = await mongoose.model('Client').findOne({
      business: this.business,
      whatsappNumber: this.whatsappNumber,
      _id: { $ne: this._id },
      isActive: true
    });

    if (existingClient) {
      const error = new Error('WhatsApp number already exists for this business');
      return next(error);
    }
  }
  next();
});

// Static method to find or create client
clientSchema.statics.findOrCreate = async function(businessId: string, clientData: Partial<IClient>) {
  let client = await this.findOne({
    business: businessId,
    whatsappNumber: clientData.whatsappNumber,
    isActive: true
  });

  if (!client) {
    client = new this({
      ...clientData,
      business: businessId
    });
    await client.save();
  }

  return client;
};

const Client = mongoose.model<IClient>('Client', clientSchema);

export default Client;