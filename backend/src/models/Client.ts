import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  _id: string;
  business: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  whatsappNumber: string;
  dateOfBirth?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
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
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
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
      validator: function(value: Date) {
        return !value || value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
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

// Indexes for better performance
clientSchema.index({ business: 1, isActive: 1 });
clientSchema.index({ business: 1, firstName: 1, lastName: 1 });
clientSchema.index({ whatsappNumber: 1 });

const Client = mongoose.model<IClient>('Client', clientSchema);

export default Client;