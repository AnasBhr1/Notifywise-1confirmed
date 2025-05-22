import mongoose, { Schema } from 'mongoose';
import { IAppointment } from '../types';

const appointmentSchema = new Schema<IAppointment>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Business reference is required']
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
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
      validator: function(date: Date) {
        // Allow appointments to be scheduled for today or future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      message: 'Appointment date cannot be in the past'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes'],
    max: [480, 'Maximum duration is 8 hours (480 minutes)'],
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    uppercase: true,
    minlength: [3, 'Currency code must be 3 characters'],
    maxlength: [3, 'Currency code must be 3 characters'],
    default: 'USD'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  confirmationSent: {
    type: Boolean,
    default: false
  },
  followUpSent: {
    type: Boolean,
    default: false
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
appointmentSchema.index({ client: 1, appointmentDate: -1 });
appointmentSchema.index({ business: 1, status: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });
appointmentSchema.index({ business: 1, service: 1 });

// Compound index to prevent double booking
appointmentSchema.index({ 
  business: 1, 
  appointmentDate: 1, 
  status: 1 
}, { 
  partialFilterExpression: { 
    status: { $in: ['scheduled', 'confirmed'] } 
  } 
});

// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function() {
  return new Date(this.appointmentDate.getTime() + this.duration * 60000);
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString();
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  return this.appointmentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
});

// Virtual to check if appointment is upcoming
appointmentSchema.virtual('isUpcoming').get(function() {
  return this.appointmentDate > new Date() && ['scheduled', 'confirmed'].includes(this.status);
});

// Virtual to check if appointment is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const appointmentDay = new Date(this.appointmentDate);
  return today.toDateString() === appointmentDay.toDateString();
});

// Ensure virtual fields are serialized
appointmentSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to update client's last appointment
appointmentSchema.post('save', async function() {
  if (this.status === 'completed') {
    await mongoose.model('Client').findByIdAndUpdate(
      this.client,
      { 
        lastAppointment: this.appointmentDate,
        $inc: { totalAppointments: 1 }
      }
    );
  }
});

// Static method to check for conflicts
appointmentSchema.statics.checkConflict = async function(
  businessId: string, 
  appointmentDate: Date, 
  duration: number, 
  excludeId?: string
) {
  const startTime = appointmentDate;
  const endTime = new Date(appointmentDate.getTime() + duration * 60000);

  const query: any = {
    business: businessId,
    status: { $in: ['scheduled', 'confirmed'] },
    $or: [
      // New appointment starts during existing appointment
      {
        appointmentDate: { $lte: startTime },
        $expr: {
          $gte: [
            { $add: ['$appointmentDate', { $multiply: ['$duration', 60000] }] },
            startTime
          ]
        }
      },
      // New appointment ends during existing appointment
      {
        appointmentDate: { $lt: endTime },
        $expr: {
          $gt: [
            { $add: ['$appointmentDate', { $multiply: ['$duration', 60000] }] },
            startTime
          ]
        }
      }
    ]
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingAppointment = await this.findOne(query);
  return conflictingAppointment;
};

// Static method to get business stats
appointmentSchema.statics.getBusinessStats = async function(businessId: string, startDate?: Date, endDate?: Date) {
  const matchQuery: any = { business: new mongoose.Types.ObjectId(businessId) };
  
  if (startDate && endDate) {
    matchQuery.appointmentDate = { $gte: startDate, $lte: endDate };
  }

  const stats = await this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: 1 },
        completedAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        totalRevenue: { $sum: '$price' },
        avgDuration: { $avg: '$duration' }
      }
    }
  ]);

  return stats[0] || {
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalRevenue: 0,
    avgDuration: 0
  };
};

const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;