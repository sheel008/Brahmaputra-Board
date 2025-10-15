const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  estimation: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['under', 'on-track', 'over'],
    default: 'on-track'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  budgetBreakdown: [{
    category: String,
    amount: Number,
    spent: {
      type: Number,
      default: 0
    }
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['budget_exceeded', 'budget_warning', 'milestone_delay', 'cost_overrun']
    },
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
financeSchema.index({ status: 1 });
financeSchema.index({ category: 1 });
financeSchema.index({ department: 1 });
financeSchema.index({ endDate: 1 });

// Calculate status based on spent vs budget
financeSchema.pre('save', function(next) {
  if (this.isModified('spent') || this.isModified('budget')) {
    const utilizationPercentage = (this.spent / this.budget) * 100;
    
    if (utilizationPercentage > 100) {
      this.status = 'over';
    } else if (utilizationPercentage > 90) {
      this.status = 'on-track';
    } else {
      this.status = 'under';
    }
    
    this.lastUpdated = new Date();
  }
  next();
});

// Static method to get budget summary
financeSchema.statics.getBudgetSummary = async function() {
  const summary = await this.aggregate([
    {
      $group: {
        _id: null,
        totalBudget: { $sum: '$budget' },
        totalSpent: { $sum: '$spent' },
        totalEstimation: { $sum: '$estimation' },
        projectCount: { $sum: 1 },
        overBudgetCount: {
          $sum: {
            $cond: [{ $gt: ['$spent', '$budget'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  const result = summary[0] || {
    totalBudget: 0,
    totalSpent: 0,
    totalEstimation: 0,
    projectCount: 0,
    overBudgetCount: 0
  };
  
  result.utilizationPercentage = result.totalBudget > 0 
    ? (result.totalSpent / result.totalBudget) * 100 
    : 0;
  
  return result;
};

// Static method to get department-wise budget
financeSchema.statics.getDepartmentBudget = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$department',
        totalBudget: { $sum: '$budget' },
        totalSpent: { $sum: '$spent' },
        projectCount: { $sum: 1 },
        avgUtilization: {
          $avg: {
            $multiply: [
              { $divide: ['$spent', '$budget'] },
              100
            ]
          }
        }
      }
    },
    {
      $sort: { totalBudget: -1 }
    }
  ]);
};

module.exports = mongoose.model('Finance', financeSchema);
