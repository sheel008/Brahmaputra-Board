const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  entityType: {
    type: String,
    enum: ['user', 'kpi', 'score', 'task', 'notification', 'finance', 'system'],
    required: true
  },
  entityId: {
    type: String,
    trim: true
  },
  project: {
    type: String,
    trim: true
  },
  siteInfo: {
    type: String,
    trim: true
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  category: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'export', 'import', 'system'],
    required: true
  },
  oldValues: {
    type: mongoose.Schema.Types.Mixed
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: false // We use custom timestamp field
});

// Indexes for performance and querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1 });
auditLogSchema.index({ category: 1 });
auditLogSchema.index({ severity: 1 });
auditLogSchema.index({ project: 1 });

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ category: 1, timestamp: -1 });

// Static method to log action
auditLogSchema.statics.logAction = async function(data) {
  const log = new this({
    ...data,
    timestamp: new Date()
  });
  
  await log.save();
  return log;
};

// Static method to get user activity
auditLogSchema.statics.getUserActivity = async function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'name email role');
};

// Static method to get system logs
auditLogSchema.statics.getSystemLogs = async function(severity = null, limit = 100) {
  const query = { category: 'system' };
  if (severity) {
    query.severity = severity;
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to get audit trail for entity
auditLogSchema.statics.getEntityAuditTrail = async function(entityType, entityId) {
  return this.find({ entityType, entityId })
    .sort({ timestamp: -1 })
    .populate('userId', 'name email role');
};

// Static method to get security events
auditLogSchema.statics.getSecurityEvents = async function(limit = 50) {
  return this.find({
    category: { $in: ['login', 'logout'] },
    severity: { $in: ['medium', 'high', 'critical'] }
  })
  .sort({ timestamp: -1 })
  .limit(limit)
  .populate('userId', 'name email role');
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
