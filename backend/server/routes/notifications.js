const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { verifyToken, requireRole, auditLog } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    type, 
    read, 
    priority, 
    page = 1, 
    limit = 20 
  } = req.query;

  const query = { userId: req.user._id };
  if (type) query.type = type;
  if (read !== undefined) query.read = read === 'true';
  if (priority) query.priority = priority;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.getUnreadCount(req.user._id);

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', verifyToken, asyncHandler(async (req, res) => {
  const unreadCount = await Notification.getUnreadCount(req.user._id);
  
  res.json({
    success: true,
    data: { unreadCount }
  });
}));

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', verifyToken, asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', verifyToken, asyncHandler(async (req, res) => {
  await Notification.markAllAsRead(req.user._id);

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// @route   POST /api/notifications
// @desc    Create notification (Admin/Division Head only)
// @access  Private
router.post('/',
  verifyToken,
  requireRole('administrator', 'division_head'),
  [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('type').isIn(['task', 'deadline', 'achievement', 'alert', 'audit', 'kpi', 'system']).withMessage('Invalid notification type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('link').optional().trim(),
    body('actionRequired').optional().isBoolean().withMessage('Action required must be boolean')
  ],
  auditLog('Create Notification', 'notification'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { userId, type, title, message, priority, link, actionRequired } = req.body;

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // Check permissions for division heads
    if (req.user.role === 'division_head' && targetUser.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'You can only send notifications to your department members'
      });
    }

    const notificationData = {
      userId,
      type,
      title,
      message,
      priority: priority || 'medium',
      link,
      actionRequired: actionRequired || false
    };

    const notification = await Notification.createNotification(notificationData);

    // Emit real-time notification
    if (req.io) {
      req.io.to(`user-${userId}`).emit('newNotification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    }

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  })
);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  await Notification.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
}));

// @route   GET /api/notifications/types
// @desc    Get notification types
// @access  Private
router.get('/types', verifyToken, asyncHandler(async (req, res) => {
  const types = await Notification.distinct('type', { userId: req.user._id });
  
  res.json({
    success: true,
    data: { types }
  });
}));

// @route   GET /api/notifications/priority-stats
// @desc    Get notification priority statistics
// @access  Private
router.get('/priority-stats', verifyToken, asyncHandler(async (req, res) => {
  const stats = await Notification.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
      }
    }
  ]);

  res.json({
    success: true,
    data: { stats }
  });
}));

// @route   POST /api/notifications/broadcast
// @desc    Broadcast notification to multiple users (Admin only)
// @access  Private (Admin)
router.post('/broadcast',
  verifyToken,
  requireRole('administrator'),
  [
    body('userIds').isArray({ min: 1 }).withMessage('At least one user ID is required'),
    body('type').isIn(['task', 'deadline', 'achievement', 'alert', 'audit', 'kpi', 'system']).withMessage('Invalid notification type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
  ],
  auditLog('Broadcast Notification', 'notification'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { userIds, type, title, message, priority } = req.body;

    // Verify all users exist
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more users not found'
      });
    }

    // Create notifications for all users
    const notifications = [];
    for (const userId of userIds) {
      const notification = await Notification.createNotification({
        userId,
        type,
        title,
        message,
        priority: priority || 'medium'
      });
      
      // Emit real-time notification
      if (req.io) {
        req.io.to(`user-${userId}`).emit('newNotification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      }
      
      notifications.push(notification);
    }

    res.status(201).json({
      success: true,
      message: `Notification broadcasted to ${notifications.length} users`,
      data: { notifications }
    });
  })
);

// @route   POST /api/notifications/department-broadcast
// @desc    Broadcast notification to department (Division Head/Admin)
// @access  Private
router.post('/department-broadcast',
  verifyToken,
  requireRole('administrator', 'division_head'),
  [
    body('type').isIn(['task', 'deadline', 'achievement', 'alert', 'audit', 'kpi', 'system']).withMessage('Invalid notification type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('department').optional().trim()
  ],
  auditLog('Department Broadcast', 'notification'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { type, title, message, priority, department } = req.body;
    
    // Determine target department
    const targetDepartment = department || req.user.department;
    
    // Check permissions
    if (req.user.role === 'division_head' && targetDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'You can only broadcast to your own department'
      });
    }

    // Get department users
    const users = await User.find({ 
      department: targetDepartment,
      isActive: true 
    }).select('_id');

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found in the specified department'
      });
    }

    // Create notifications for all department users
    const notifications = [];
    for (const user of users) {
      const notification = await Notification.createNotification({
        userId: user._id,
        type,
        title,
        message,
        priority: priority || 'medium'
      });
      
      // Emit real-time notification
      if (req.io) {
        req.io.to(`user-${user._id}`).emit('newNotification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      }
      
      notifications.push(notification);
    }

    res.status(201).json({
      success: true,
      message: `Notification broadcasted to ${notifications.length} users in ${targetDepartment}`,
      data: { notifications }
    });
  })
);

module.exports = router;
