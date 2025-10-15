const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  type: {
    type: String,
    enum: ['quantitative', 'qualitative'],
    required: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  targetValue: {
    type: Number,
    required: true,
    min: 0
  },
  role: {
    type: String,
    enum: ['hq_staff', 'field_unit', 'division_head'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for performance
kpiSchema.index({ role: 1 });
kpiSchema.index({ category: 1 });
kpiSchema.index({ isActive: 1 });
kpiSchema.index({ type: 1 });

// Validation to ensure weights sum to 100% for each role
kpiSchema.pre('save', async function(next) {
  if (this.isModified('weight') || this.isNew) {
    const totalWeight = await mongoose.model('KPI').aggregate([
      { $match: { role: this.role, isActive: true, _id: { $ne: this._id } } },
      { $group: { _id: null, total: { $sum: '$weight' } } }
    ]);
    
    const currentTotal = (totalWeight[0]?.total || 0) + this.weight;
    
    if (currentTotal > 100) {
      return next(new Error(`Total weight for ${this.role} role cannot exceed 100%. Current total would be ${currentTotal}%`));
    }
  }
  next();
});

module.exports = mongoose.model('KPI', kpiSchema);
