import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  _id: string;
  business: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  service: string;
  appointmentDate: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  price?: number;
  currency?: string;
  notes?: string;
  remindersSent: {
    type: '24h' | '2h' | '30m';
    sentAt: Date;
    status: 'sent' | 'delivered' | 'failed';
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(this: IAppointment, value: Date) {
        const now = new Date();
        return value > now;
      },
      message: 'Appointment date must be in the future'
    }
  },
  duration: {
    type: Number,
    required: true,
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'scheduled'
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    minlength: [3, 'Currency must be 3 characters'],
    maxlength: [3, 'Currency must be 3 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  remindersSent: [{
    type: {
      type: String,
      enum: ['24h', '2h', '30m'],
      required: true
    },
    sentAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      required: true
    }
  }],
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
appointmentSchema.index({ business: 1, appointmentDate: 1 });
appointmentSchema.index({ business: 1, status: 1 });
appointmentSchema.index({ client: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;