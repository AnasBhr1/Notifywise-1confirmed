import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: [true, 'Business reference is required']
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: [true, 'Appointment reference is required']
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  type: {
    type: String,
    enum: ['confirmation', 'reminder', 'follow-up', 'custom'],
    required: [true, 'Message type is required']
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message content cannot exceed 1000 characters']
  },
  whatsappMessageId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  readAt: {
    type: Date
  },
  errorMessage: {
    type: String,
    trim: true
  },
  retryCount: {
    type: Number,
    default: 0,
    min: [0, 'Retry count cannot be negative']
  },
  maxRetries: {
    type: Number,
    default: 3,
    min: [1, 'Max retries must be at least 1'],
    max: [10, 'Max retries cannot exceed 10']
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
messageSchema.index({ business: 1, createdAt: -1 });
messageSchema.index({ appointment: 1, type: 1 });
messageSchema.index({ client: 1, createdAt: -1 });
messageSchema.index({ status: 1, scheduledFor: 1 });
messageSchema.index({ business: 1, status: 1 });
messageSchema.index({ type: 1, status: 1 });

// Virtual for delivery time (time between sent and delivered)
messageSchema.virtual('deliveryTime').get(function() {
  if (this.sentAt && this.deliveredAt) {
    return this.deliveredAt.getTime() - this.sentAt.getTime();
  }
  return null;
});

// Virtual for read time (time between delivered and read)
messageSchema.virtual('readTime').get(function() {
  if (this.deliveredAt && this.readAt) {
    return this.readAt.getTime() - this.deliveredAt.getTime();
  }
  return null;
});

// Virtual to check if message is overdue
messageSchema.virtual('isOverdue').get(function() {
  if (this.status === 'pending' && this.scheduledFor) {
    return new Date() > this.scheduledFor;
  }
  return false;
});

// Virtual to check if message can be retried
messageSchema.virtual('canRetry').get(function() {
  return this.status === 'failed' && this.retryCount < this.maxRetries;
});

// Ensure virtual fields are serialized
messageSchema.set('toJSON', { virtuals: true });

// Pre-save middleware to set sentAt when status changes to sent
messageSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'sent':
        if (!this.sentAt) this.sentAt = now;
        break;
      case 'delivered':
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case 'read':
        if (!this.readAt) this.readAt = now;
        break;
    }
  }
  next();
});

// Static method to get message stats for business
messageSchema.statics.getBusinessMessageStats = async function(businessId: string, startDate?: Date, endDate?: Date) {
  const matchQuery: any = { business: new mongoose.Types.ObjectId(businessId) };
  
  if (startDate && endDate) {
    matchQuery.createdAt = { $gte: startDate, $lte: endDate };
  }

  const stats = await this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    pending: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0
  };

  stats.forEach(stat => {
    result[stat._id as keyof typeof result] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Static method to get messages by type
messageSchema.statics.getMessagesByType = async function(businessId: string) {
  return await this.aggregate([
    { $match: { business: new mongoose.Types.ObjectId(businessId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        successRate: {
          $avg: {
            $cond: [
              { $in: ['$status', ['sent', 'delivered', 'read']] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

// Static method to get pending messages
messageSchema.statics.getPendingMessages = async function() {
  return await this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() }
  }).populate('business appointment client');
};

// Static method to get failed messages that can be retried
messageSchema.statics.getRetryableMessages = async function() {
  return await this.find({
    status: 'failed',
    $expr: { $lt: ['$retryCount', '$maxRetries'] }
  }).populate('business appointment client');
};

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;