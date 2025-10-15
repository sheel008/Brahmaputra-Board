const express = require('express');
const { body, validationResult } = require('express-validator');
const KPI = require('../models/KPI');
const Score = require('../models/Score');
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/kpis
// @desc    Get all KPIs
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { role, category, type, page = 1, limit = 10 } = req.query;
  
  const query = { isActive: true };
  if (role) query.role = role;
  if (category) query.category = category;
  if (type) query.type = type;

  const kpis = await KPI.find(query)
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await KPI.countDocuments(query);

  res.json({
    success: true,
    data: {
      kpis,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/kpis/:id
// @desc    Get single KPI
// @access  Private
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const kpi = await KPI.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('lastModifiedBy', 'name email');

  if (!kpi) {
    return res.status(404).json({
      success: false,
      message: 'KPI not found'
    });
  }

  res.json({
    success: true,
    data: { kpi }
  });
}));

// @route   POST /api/kpis
// @desc    Create new KPI (Admin only)
// @access  Private (Admin)
router.post('/',
  verifyToken,
  requireRole('administrator'),
  [
    body('name').trim().notEmpty().withMessage('KPI name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('weight').isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
    body('type').isIn(['quantitative', 'qualitative']).withMessage('Type must be quantitative or qualitative'),
    body('unit').trim().notEmpty().withMessage('Unit is required'),
    body('targetValue').isFloat({ min: 0 }).withMessage('Target value must be positive'),
    body('role').isIn(['hq_staff', 'field_unit', 'division_head']).withMessage('Invalid role'),
    body('category').trim().notEmpty().withMessage('Category is required')
  ],
  auditLog('Create KPI', 'kpi'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const kpiData = {
      ...req.body,
      createdBy: req.user._id,
      lastModifiedBy: req.user._id
    };

    const kpi = new KPI(kpiData);
    await kpi.save();

    res.status(201).json({
      success: true,
      message: 'KPI created successfully',
      data: { kpi }
    });
  })
);

// @route   PUT /api/kpis/:id
// @desc    Update KPI (Admin only)
// @access  Private (Admin)
router.put('/:id',
  verifyToken,
  requireRole('administrator'),
  [
    body('name').optional().trim().notEmpty().withMessage('KPI name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('weight').optional().isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
    body('type').optional().isIn(['quantitative', 'qualitative']).withMessage('Type must be quantitative or qualitative'),
    body('unit').optional().trim().notEmpty().withMessage('Unit cannot be empty'),
    body('targetValue').optional().isFloat({ min: 0 }).withMessage('Target value must be positive'),
    body('role').optional().isIn(['hq_staff', 'field_unit', 'division_head']).withMessage('Invalid role'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty')
  ],
  auditLog('Update KPI', 'kpi'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({
        success: false,
        message: 'KPI not found'
      });
    }

    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const updatedKPI = await KPI.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'KPI updated successfully',
      data: { kpi: updatedKPI }
    });
  })
);

// @route   DELETE /api/kpis/:id
// @desc    Delete KPI (Admin only)
// @access  Private (Admin)
router.delete('/:id',
  verifyToken,
  requireRole('administrator'),
  auditLog('Delete KPI', 'kpi'),
  asyncHandler(async (req, res) => {
    const kpi = await KPI.findById(req.params.id);
    if (!kpi) {
      return res.status(404).json({
        success: false,
        message: 'KPI not found'
      });
    }

    // Soft delete by setting isActive to false
    kpi.isActive = false;
    kpi.lastModifiedBy = req.user._id;
    await kpi.save();

    res.json({
      success: true,
      message: 'KPI deleted successfully'
    });
  })
);

// @route   GET /api/kpis/role/:role
// @desc    Get KPIs by role
// @access  Private
router.get('/role/:role', verifyToken, asyncHandler(async (req, res) => {
  const { role } = req.params;
  const { category, type } = req.query;

  const query = { role, isActive: true };
  if (category) query.category = category;
  if (type) query.type = type;

  const kpis = await KPI.find(query).sort({ weight: -1 });

  res.json({
    success: true,
    data: { kpis }
  });
}));

// @route   GET /api/kpis/weight-validation/:role
// @desc    Validate KPI weights for a role
// @access  Private (Admin)
router.get('/weight-validation/:role',
  verifyToken,
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    const { role } = req.params;

    const totalWeight = await KPI.aggregate([
      { $match: { role, isActive: true } },
      { $group: { _id: null, total: { $sum: '$weight' } } }
    ]);

    const weight = totalWeight[0]?.total || 0;
    const isValid = weight === 100;

    res.json({
      success: true,
      data: {
        totalWeight: weight,
        isValid,
        message: isValid 
          ? 'KPI weights are valid' 
          : `KPI weights sum to ${weight}%, should be 100%`
      }
    });
  })
);

// @route   GET /api/kpis/categories
// @desc    Get all KPI categories
// @access  Private
router.get('/categories', verifyToken, asyncHandler(async (req, res) => {
  const categories = await KPI.distinct('category', { isActive: true });
  
  res.json({
    success: true,
    data: { categories }
  });
}));

// @route   GET /api/kpis/stats
// @desc    Get KPI statistics
// @access  Private (Admin)
router.get('/stats',
  verifyToken,
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    const stats = await KPI.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalKPIs: { $sum: 1 },
          byRole: {
            $push: {
              role: '$role',
              weight: '$weight',
              type: '$type'
            }
          }
        }
      }
    ]);

    const roleStats = await KPI.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          totalWeight: { $sum: '$weight' },
          quantitative: {
            $sum: { $cond: [{ $eq: ['$type', 'quantitative'] }, 1, 0] }
          },
          qualitative: {
            $sum: { $cond: [{ $eq: ['$type', 'qualitative'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalKPIs: stats[0]?.totalKPIs || 0,
        byRole: roleStats
      }
    });
  })
);

module.exports = router;
