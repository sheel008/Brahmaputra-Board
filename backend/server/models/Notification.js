const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['task', 'deadline', 'achievement', 'alert', 'audit', 'kpi', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  expiresAt: {
    type: Date
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  sentVia: {
    type: String,
    enum: ['in-app', 'email', 'sms', 'push'],
    default: 'in-app'
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ createdAt: -1 });

// Update readAt when read status changes
notificationSchema.pre('save', function(next) {
  if (this.isModified('read') && this.read && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // Emit real-time notification via Socket.io
  // Note: Socket.io instance will be passed from the main app
  // This will be handled in the routes where the notification is created
  
  return notification;
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { userId, read: false },
    { 
      read: true,
      readAt: new Date()
    }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, read: false });
};

module.exports = mongoose.model('Notification', notificationSchema);
