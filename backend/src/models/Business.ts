import mongoose, { Schema } from 'mongoose';
import { IBusiness } from '../types';

const businessHoursSchema = new Schema({
  open: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:mm format']
  },
  close: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:mm format']
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const businessSchema = new Schema<IBusiness>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Business owner is required']
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid WhatsApp number']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  timeZone: {
    type: String,
    required: [true, 'Time zone is required'],
    default: 'UTC'
  },
  businessHours: {
    monday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: true } },
    tuesday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: true } },
    wednesday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: true } },
    thursday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: true } },
    friday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: true } },
    saturday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: false } },
    sunday: { type: businessHoursSchema, default: { open: '09:00', close: '17:00', isOpen: false } }
  },
  services: [{
    type: String,
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
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
businessSchema.index({ owner: 1 });
businessSchema.index({ name: 1 });
businessSchema.index({ whatsappNumber: 1 });
businessSchema.index({ isActive: 1 });

// Virtual for business slug (for public booking URL)
businessSchema.virtual('slug').get(function() {
  return this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
});

// Ensure virtual fields are serialized
businessSchema.set('toJSON', { virtuals: true });

const Business = mongoose.model<IBusiness>('Business', businessSchema);

export default Business;