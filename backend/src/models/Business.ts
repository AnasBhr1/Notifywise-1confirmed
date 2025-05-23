import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  _id: string;
  owner: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  whatsappNumber?: string;
  website?: string;
  address?: string;
  timeZone?: string;
  services: string[];
  settings: {
    reminderTimes: string[];
    messageTemplates: {
      confirmation: string;
      reminder24h: string;
      reminder2h: string;
      reminder30m: string;
    };
    businessHours: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  whatsappNumber: {
    type: String,
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid WhatsApp number']
  },
  website: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  timeZone: {
    type: String,
    default: 'UTC'
  },
  services: [{
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  }],
  settings: {
    reminderTimes: {
      type: [String],
      default: ['24h', '2h', '30m']
    },
    messageTemplates: {
      confirmation: {
        type: String,
        default: 'Hi {clientName}, your appointment for {service} is confirmed for {date} at {time}. See you then!'
      },
      reminder24h: {
        type: String,
        default: 'Hi {clientName}, this is a reminder that you have an appointment for {service} tomorrow at {time}.'
      },
      reminder2h: {
        type: String,
        default: 'Hi {clientName}, your appointment for {service} is in 2 hours at {time}.'
      },
      reminder30m: {
        type: String,
        default: 'Hi {clientName}, your appointment for {service} starts in 30 minutes!'
      }
    },
    businessHours: {
      monday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
      tuesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
      wednesday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
      thursday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
      friday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: false } },
      saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: true } },
      sunday: { open: { type: String, default: '09:00' }, close: { type: String, default: '17:00' }, closed: { type: Boolean, default: true } }
    }
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
businessSchema.index({ owner: 1 });
businessSchema.index({ name: 1 });
businessSchema.index({ isActive: 1 });

const Business = mongoose.model<IBusiness>('Business', businessSchema);

export default Business;