const express = require('express');
const { body, validationResult } = require('express-validator');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/logs
// @desc    Get audit logs
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    userId, 
    action, 
    entityType, 
    category, 
    severity, 
    startDate, 
    endDate,
    page = 1, 
    limit = 50 
  } = req.query;

  const query = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    query.userId = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    query.userId = { $in: teamUsers.map(u => u._id) };
  }

  // Additional filters
  if (userId) query.userId = userId;
  if (action) query.action = { $regex: action, $options: 'i' };
  if (entityType) query.entityType = entityType;
  if (category) query.category = category;
  if (severity) query.severity = severity;
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const logs = await AuditLog.find(query)
    .populate('userId', 'name email role department')
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await AuditLog.countDocuments(query);

  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/logs/user/:userId
// @desc    Get user activity logs
// @access  Private
router.get('/user/:userId', 
  verifyToken, 
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    // Check permissions
    if (req.user.role === 'employee' && userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own activity logs'
      });
    }

    if (req.user.role === 'division_head') {
      const targetUser = await User.findById(userId);
      if (targetUser.department !== req.user.department) {
        return res.status(403).json({
          success: false,
          message: 'You can only view logs from your department members'
        });
      }
    }

    const logs = await AuditLog.getUserActivity(userId, parseInt(limit));

    res.json({
      success: true,
      data: { logs }
    });
  })
);

// @route   GET /api/logs/system
// @desc    Get system logs
// @access  Private (Admin)
router.get('/system',
  verifyToken,
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    const { severity, limit = 100 } = req.query;

    const logs = await AuditLog.getSystemLogs(severity, parseInt(limit));

    res.json({
      success: true,
      data: { logs }
    });
  })
);

// @route   GET /api/logs/security
// @desc    Get security events
// @access  Private (Admin)
router.get('/security',
  verifyToken,
  requireRole('administrator'),
  asyncHandler(async (req, res) => {
    const { limit = 50 } = req.query;

    const securityEvents = await AuditLog.getSecurityEvents(parseInt(limit));

    res.json({
      success: true,
      data: { securityEvents }
    });
  })
);

// @route   GET /api/logs/entity/:entityType/:entityId
// @desc    Get audit trail for entity
// @access  Private
router.get('/entity/:entityType/:entityId',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { entityType, entityId } = req.params;

    // Check permissions based on entity type
    if (entityType === 'user') {
      if (req.user.role === 'employee' && entityId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own audit trail'
        });
      }

      if (req.user.role === 'division_head') {
        const targetUser = await User.findById(entityId);
        if (targetUser.department !== req.user.department) {
          return res.status(403).json({
            success: false,
            message: 'You can only view audit trails from your department'
          });
        }
      }
    }

    const auditTrail = await AuditLog.getEntityAuditTrail(entityType, entityId);

    res.json({
      success: true,
      data: { auditTrail }
    });
  })
);

// @route   GET /api/logs/stats
// @desc    Get log statistics
// @access  Private
router.get('/stats', verifyToken, asyncHandler(async (req, res) => {
  let matchQuery = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    matchQuery.userId = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    matchQuery.userId = { $in: teamUsers.map(u => u._id) };
  }

  const stats = await AuditLog.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalLogs: { $sum: 1 },
        byCategory: {
          $push: {
            category: '$category',
            action: '$action'
          }
        },
        byEntityType: {
          $push: {
            entityType: '$entityType',
            action: '$action'
          }
        },
        bySeverity: {
          $push: {
            severity: '$severity',
            action: '$action'
          }
        }
      }
    }
  ]);

  // Process category stats
  const categoryStats = {};
  const entityTypeStats = {};
  const severityStats = {};

  if (stats[0]) {
    stats[0].byCategory.forEach(item => {
      categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
    });

    stats[0].byEntityType.forEach(item => {
      entityTypeStats[item.entityType] = (entityTypeStats[item.entityType] || 0) + 1;
    });

    stats[0].bySeverity.forEach(item => {
      severityStats[item.severity] = (severityStats[item.severity] || 0) + 1;
    });
  }

  res.json({
    success: true,
    data: {
      totalLogs: stats[0]?.totalLogs || 0,
      categoryStats,
      entityTypeStats,
      severityStats
    }
  });
}));

// @route   GET /api/logs/export
// @desc    Export logs
// @access  Private
router.get('/export', verifyToken, asyncHandler(async (req, res) => {
  const { format, startDate, endDate, entityType, category } = req.query;

  if (!['csv', 'json', 'pdf'].includes(format)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid export format'
    });
  }

  const query = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    query.userId = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    query.userId = { $in: teamUsers.map(u => u._id) };
  }

  // Additional filters
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  if (entityType) query.entityType = entityType;
  if (category) query.category = category;

  const logs = await AuditLog.find(query)
    .populate('userId', 'name email role department')
    .sort({ timestamp: -1 })
    .limit(10000); // Limit for export

  // This is a placeholder for export functionality
  // In a real implementation, you would generate the appropriate file format
  
  res.json({
    success: true,
    message: `Export functionality for ${format} format will be implemented`,
    data: {
      format,
      recordCount: logs.length,
      downloadUrl: `/api/logs/download/${Date.now()}.${format}`
    }
  });
}));

// @route   GET /api/logs/recent-activity
// @desc    Get recent activity
// @access  Private
router.get('/recent-activity', verifyToken, asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  let matchQuery = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    matchQuery.userId = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    matchQuery.userId = { $in: teamUsers.map(u => u._id) };
  }

  const recentActivity = await AuditLog.find(matchQuery)
    .populate('userId', 'name email avatar role')
    .sort({ timestamp: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { recentActivity }
  });
}));

// @route   GET /api/logs/search
// @desc    Search logs
// @access  Private
router.get('/search', verifyToken, asyncHandler(async (req, res) => {
  const { 
    q, 
    startDate, 
    endDate, 
    page = 1, 
    limit = 20 
  } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const query = {
    $or: [
      { action: { $regex: q, $options: 'i' } },
      { details: { $regex: q, $options: 'i' } },
      { userName: { $regex: q, $options: 'i' } }
    ]
  };

  // Role-based filtering
  if (req.user.role === 'employee') {
    query.userId = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    query.userId = { $in: teamUsers.map(u => u._id) };
  }

  // Date filtering
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const logs = await AuditLog.find(query)
    .populate('userId', 'name email role department')
    .sort({ timestamp: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await AuditLog.countDocuments(query);

  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

module.exports = router;
