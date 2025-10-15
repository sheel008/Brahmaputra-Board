const express = require('express');
const { body, validationResult } = require('express-validator');
const Finance = require('../models/Finance');
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/finance
// @desc    Get financial data
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    status, 
    category, 
    department, 
    page = 1, 
    limit = 10 
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (department) query.department = department;

  const finances = await Finance.find(query)
    .populate('updatedBy', 'name email')
    .sort({ lastUpdated: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Finance.countDocuments(query);

  res.json({
    success: true,
    data: {
      finances,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/finance/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', verifyToken, asyncHandler(async (req, res) => {
  const summary = await Finance.getBudgetSummary();
  
  res.json({
    success: true,
    data: { summary }
  });
}));

// @route   GET /api/finance/department
// @desc    Get department-wise budget
// @access  Private
router.get('/department', verifyToken, asyncHandler(async (req, res) => {
  const departmentBudget = await Finance.getDepartmentBudget();
  
  res.json({
    success: true,
    data: { departmentBudget }
  });
}));

// @route   GET /api/finance/:id
// @desc    Get single financial record
// @access  Private
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const finance = await Finance.findById(req.params.id)
    .populate('updatedBy', 'name email');

  if (!finance) {
    return res.status(404).json({
      success: false,
      message: 'Financial record not found'
    });
  }

  res.json({
    success: true,
    data: { finance }
  });
}));

// @route   POST /api/finance
// @desc    Create financial record (Admin only)
// @access  Private (Admin)
router.post('/',
  verifyToken,
  requireRole('administrator'),
  [
    body('projectId').trim().notEmpty().withMessage('Project ID is required'),
    body('projectName').trim().notEmpty().withMessage('Project name is required'),
    body('budget').isFloat({ min: 0 }).withMessage('Budget must be positive'),
    body('spent').optional().isFloat({ min: 0 }).withMessage('Spent amount must be positive'),
    body('estimation').isFloat({ min: 0 }).withMessage('Estimation must be positive'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('currency').optional().trim()
  ],
  auditLog('Create Finance Record', 'finance'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const financeData = {
      ...req.body,
      spent: req.body.spent || 0,
      currency: req.body.currency || 'INR',
      updatedBy: req.user._id
    };

    const finance = new Finance(financeData);
    await finance.save();

    res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: { finance }
    });
  })
);

// @route   PUT /api/finance/:id
// @desc    Update financial record
// @access  Private
router.put('/:id',
  verifyToken,
  [
    body('projectName').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
    body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be positive'),
    body('spent').optional().isFloat({ min: 0 }).withMessage('Spent amount must be positive'),
    body('estimation').optional().isFloat({ min: 0 }).withMessage('Estimation must be positive'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
    body('progress').optional().isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required')
  ],
  auditLog('Update Finance Record', 'finance'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found'
      });
    }

    // Check permissions
    const canEdit = req.user.role === 'administrator' ||
                   (req.user.role === 'division_head' && finance.department === req.user.department);

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You cannot edit this financial record'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user._id
    };

    const updatedFinance = await Finance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('updatedBy', 'name email');

    res.json({
      success: true,
      message: 'Financial record updated successfully',
      data: { finance: updatedFinance }
    });
  })
);

// @route   POST /api/finance/:id/spend
// @desc    Record expenditure
// @access  Private
router.post('/:id/spend',
  verifyToken,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').optional().trim()
  ],
  auditLog('Record Expenditure', 'finance'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { amount, description, category } = req.body;
    const finance = await Finance.findById(req.params.id);
    
    if (!finance) {
      return res.status(404).json({
        success: false,
        message: 'Financial record not found'
      });
    }

    // Check permissions
    const canSpend = req.user.role === 'administrator' ||
                    (req.user.role === 'division_head' && finance.department === req.user.department);

    if (!canSpend) {
      return res.status(403).json({
        success: false,
        message: 'You cannot record expenditure for this project'
      });
    }

    // Update spent amount
    finance.spent += amount;
    finance.updatedBy = req.user._id;

    // Add to budget breakdown if category provided
    if (category) {
      const existingBreakdown = finance.budgetBreakdown.find(b => b.category === category);
      if (existingBreakdown) {
        existingBreakdown.spent += amount;
      } else {
        finance.budgetBreakdown.push({
          category,
          amount: 0,
          spent: amount
        });
      }
    }

    await finance.save();

    // Check for budget alerts
    const utilizationPercentage = (finance.spent / finance.budget) * 100;
    
    if (utilizationPercentage > 100) {
      finance.alerts.push({
        type: 'budget_exceeded',
        message: `Budget exceeded by ${(utilizationPercentage - 100).toFixed(2)}%`,
        severity: 'critical'
      });
    } else if (utilizationPercentage > 90) {
      finance.alerts.push({
        type: 'budget_warning',
        message: `Budget utilization at ${utilizationPercentage.toFixed(2)}%`,
        severity: 'high'
      });
    }

    await finance.save();

    res.json({
      success: true,
      message: 'Expenditure recorded successfully',
      data: { finance }
    });
  })
);

// @route   GET /api/finance/alerts
// @desc    Get budget alerts
// @access  Private
router.get('/alerts', verifyToken, asyncHandler(async (req, res) => {
  const { severity, resolved } = req.query;
  
  const query = { 'alerts.0': { $exists: true } };
  if (severity) query['alerts.severity'] = severity;
  if (resolved !== undefined) query['alerts.resolved'] = resolved === 'true';

  const finances = await Finance.find(query)
    .populate('updatedBy', 'name email')
    .sort({ 'alerts.createdAt': -1 });

  // Extract alerts
  const alerts = [];
  finances.forEach(finance => {
    finance.alerts.forEach(alert => {
      alerts.push({
        id: alert._id,
        projectId: finance.projectId,
        projectName: finance.projectName,
        department: finance.department,
        type: alert.type,
        message: alert.message,
        severity: alert.severity,
        createdAt: alert.createdAt,
        resolved: alert.resolved,
        resolvedAt: alert.resolvedAt
      });
    });
  });

  res.json({
    success: true,
    data: { alerts }
  });
}));

// @route   PUT /api/finance/alerts/:alertId/resolve
// @desc    Resolve budget alert
// @access  Private
router.put('/alerts/:alertId/resolve',
  verifyToken,
  requireRole('administrator', 'division_head'),
  auditLog('Resolve Budget Alert', 'finance'),
  asyncHandler(async (req, res) => {
    const finance = await Finance.findOne({
      'alerts._id': req.params.alertId
    });

    if (!finance) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const alert = finance.alerts.id(req.params.alertId);
    alert.resolved = true;
    alert.resolvedAt = new Date();

    await finance.save();

    res.json({
      success: true,
      message: 'Alert resolved successfully'
    });
  })
);

// @route   GET /api/finance/categories
// @desc    Get financial categories
// @access  Private
router.get('/categories', verifyToken, asyncHandler(async (req, res) => {
  const categories = await Finance.distinct('category');
  
  res.json({
    success: true,
    data: { categories }
  });
}));

// @route   GET /api/finance/status-summary
// @desc    Get status summary
// @access  Private
router.get('/status-summary', verifyToken, asyncHandler(async (req, res) => {
  const statusSummary = await Finance.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
        totalSpent: { $sum: '$spent' }
      }
    }
  ]);

  res.json({
    success: true,
    data: { statusSummary }
  });
}));

// @route   GET /api/finance/trends
// @desc    Get financial trends
// @access  Private
router.get('/trends', verifyToken, asyncHandler(async (req, res) => {
  const { period = 12 } = req.query;

  const trends = await Finance.aggregate([
    {
      $group: {
        _id: {
          month: { $month: '$lastUpdated' },
          year: { $year: '$lastUpdated' }
        },
        totalBudget: { $sum: '$budget' },
        totalSpent: { $sum: '$spent' },
        projectCount: { $sum: 1 }
      }
    },
    {
      $project: {
        month: '$_id.month',
        year: '$_id.year',
        totalBudget: 1,
        totalSpent: 1,
        projectCount: 1,
        utilizationRate: {
          $multiply: [
            { $divide: ['$totalSpent', '$totalBudget'] },
            100
          ]
        }
      }
    },
    { $sort: { year: 1, month: 1 } },
    { $limit: parseInt(period) }
  ]);

  res.json({
    success: true,
    data: { trends }
  });
}));

module.exports = router;
