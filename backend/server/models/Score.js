const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  kpiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KPI',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  target: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: String,
    required: true,
    enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  year: {
    type: Number,
    required: true,
    min: 2020,
    max: 2030
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    trim: true
  },
  finalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  isQuantitative: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['manual', 'system', 'e-office'],
    default: 'manual'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
scoreSchema.index({ userId: 1, month: 1, year: 1 });
scoreSchema.index({ kpiId: 1 });
scoreSchema.index({ period: 1 });
scoreSchema.index({ evaluatedBy: 1 });
scoreSchema.index({ verified: 1 });

// Compound index for unique constraint
scoreSchema.index({ userId: 1, kpiId: 1, month: 1, year: 1 }, { unique: true });

// Calculate final score based on KPI weight
scoreSchema.pre('save', async function(next) {
  if (this.isModified('value') || this.isNew) {
    try {
      const kpi = await mongoose.model('KPI').findById(this.kpiId);
      if (kpi) {
        // Calculate score as percentage of target
        const scorePercentage = (this.value / this.target) * 100;
        // Apply weight
        this.finalScore = Math.min(100, (scorePercentage * kpi.weight) / 100);
        this.isQuantitative = kpi.type === 'quantitative';
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to get user performance summary
scoreSchema.statics.getUserPerformanceSummary = async function(userId, period) {
  const scores = await this.find({ userId, period })
    .populate('kpiId', 'name weight type')
    .lean();
  
  const summary = {
    totalScore: 0,
    quantitativeScore: 0,
    qualitativeScore: 0,
    quantitativeWeight: 0,
    qualitativeWeight: 0,
    kpis: []
  };
  
  scores.forEach(score => {
    const kpi = score.kpiId;
    summary.totalScore += score.finalScore || 0;
    summary.kpis.push({
      name: kpi.name,
      value: score.value,
      target: score.target,
      weight: kpi.weight,
      type: kpi.type,
      finalScore: score.finalScore
    });
    
    if (kpi.type === 'quantitative') {
      summary.quantitativeScore += score.finalScore || 0;
      summary.quantitativeWeight += kpi.weight;
    } else {
      summary.qualitativeScore += score.finalScore || 0;
      summary.qualitativeWeight += kpi.weight;
    }
  });
  
  return summary;
};

module.exports = mongoose.model('Score', scoreSchema);
