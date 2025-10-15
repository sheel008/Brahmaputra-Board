const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deadline: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  project: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  completionNotes: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  statusHistory: [{
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      trim: true
    }
  }],
  isOverdue: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ project: 1 });
taskSchema.index({ isOverdue: 1 });

// Update overdue status
taskSchema.pre('save', function(next) {
  if (this.isModified('deadline') || this.isModified('status')) {
    this.isOverdue = this.status !== 'done' && new Date() > this.deadline;
  }
  next();
});

// Add status change to history
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this.assignedTo, // This should be set to the actual user making the change
      changedAt: new Date()
    });
  }
  next();
});

// Static method to get tasks by user and status
taskSchema.statics.getTasksByUser = async function(userId, status = null) {
  const query = { assignedTo: userId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('assignedTo', 'name email avatar')
    .populate('assignedBy', 'name email')
    .sort({ deadline: 1 });
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = async function() {
  return this.find({
    status: { $ne: 'done' },
    deadline: { $lt: new Date() }
  })
  .populate('assignedTo', 'name email department')
  .populate('assignedBy', 'name email')
  .sort({ deadline: 1 });
};

module.exports = mongoose.model('Task', taskSchema);
