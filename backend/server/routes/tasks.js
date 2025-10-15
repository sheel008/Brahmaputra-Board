const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken, requireRole, canAccessResource, auditLog } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get tasks
// @access  Private
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const { 
    status, 
    assignedTo, 
    assignedBy, 
    priority, 
    project, 
    page = 1, 
    limit = 10,
    overdue 
  } = req.query;

  let query = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    query.assignedTo = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    query.assignedTo = { $in: teamUsers.map(u => u._id) };
  }

  // Additional filters
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;
  if (assignedBy) query.assignedBy = assignedBy;
  if (priority) query.priority = priority;
  if (project) query.project = project;
  if (overdue === 'true') {
    query.status = { $ne: 'done' };
    query.deadline = { $lt: new Date() };
  }

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email avatar department')
    .populate('assignedBy', 'name email')
    .populate('comments.userId', 'name email avatar')
    .sort({ deadline: 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Task.countDocuments(query);

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
}));

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar department')
    .populate('assignedBy', 'name email')
    .populate('comments.userId', 'name email avatar')
    .populate('statusHistory.changedBy', 'name email');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  // Check access permissions
  const canAccess = req.user.role === 'administrator' ||
                   task.assignedTo._id.toString() === req.user._id.toString() ||
                   (req.user.role === 'division_head' && 
                    task.assignedTo.department === req.user.department);

  if (!canAccess) {
    return res.status(403).json({
      success: false,
      message: 'You cannot access this task'
    });
  }

  res.json({
    success: true,
    data: { task }
  });
}));

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/',
  verifyToken,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('assignedTo').isMongoId().withMessage('Valid assigned user is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('project').optional().trim(),
    body('estimatedHours').optional().isFloat({ min: 0 }).withMessage('Estimated hours must be positive')
  ],
  auditLog('Create Task', 'task'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { title, description, assignedTo, deadline, priority, project, estimatedHours } = req.body;

    // Check if assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: 'Assigned user not found'
      });
    }

    // Check permissions for assignment
    if (req.user.role === 'employee' && assignedTo !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only assign tasks to yourself'
      });
    }

    if (req.user.role === 'division_head' && assignedUser.department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: 'You can only assign tasks to your department members'
      });
    }

    const taskData = {
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      deadline: new Date(deadline),
      priority: priority || 'medium',
      project,
      estimatedHours
    };

    const task = new Task(taskData);
    await task.save();

    await task.populate('assignedTo', 'name email avatar department');
    await task.populate('assignedBy', 'name email');

    // Create notification for assigned user
    const notification = await Notification.createNotification({
      userId: assignedTo,
      type: 'task',
      title: 'New Task Assigned',
      message: `${req.user.name} assigned you a new task: ${title}`,
      priority: priority === 'high' ? 'high' : 'medium',
      link: `/tasks/${task._id}`,
      metadata: {
        taskId: task._id,
        assignedBy: req.user.name,
        deadline: deadline
      }
    });
    
    // Emit real-time notification
    if (req.io) {
      req.io.to(`user-${assignedTo}`).emit('newNotification', {
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
      message: 'Task created successfully',
      data: { task }
    });
  })
);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id',
  verifyToken,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('deadline').optional().isISO8601().withMessage('Valid deadline is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('project').optional().trim(),
    body('estimatedHours').optional().isFloat({ min: 0 }).withMessage('Estimated hours must be positive'),
    body('actualHours').optional().isFloat({ min: 0 }).withMessage('Actual hours must be positive'),
    body('completionNotes').optional().trim()
  ],
  auditLog('Update Task', 'task'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    const canEdit = req.user.role === 'administrator' ||
                   task.assignedTo.toString() === req.user._id.toString() ||
                   (req.user.role === 'division_head' && 
                    await User.findById(task.assignedTo).then(u => u?.department === req.user.department));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You cannot edit this task'
      });
    }

    const updateData = { ...req.body };
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'name email avatar department')
    .populate('assignedBy', 'name email');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask }
    });
  })
);

// @route   PUT /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.put('/:id/status',
  verifyToken,
  [
    body('status').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
    body('reason').optional().trim()
  ],
  auditLog('Update Task Status', 'task'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { status, reason } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    const canUpdateStatus = req.user.role === 'administrator' ||
                           task.assignedTo.toString() === req.user._id.toString() ||
                           (req.user.role === 'division_head' && 
                            await User.findById(task.assignedTo).then(u => u?.department === req.user.department));

    if (!canUpdateStatus) {
      return res.status(403).json({
        success: false,
        message: 'You cannot update this task status'
      });
    }

    const oldStatus = task.status;
    task.status = status;
    
    if (reason) {
      task.statusHistory.push({
        status,
        changedBy: req.user._id,
        reason
      });
    }

    if (status === 'done') {
      task.completedAt = new Date();
    }

    await task.save();
    await task.populate('assignedTo', 'name email avatar department');

    // Create notification for status change
    if (oldStatus !== status) {
      const notification = await Notification.createNotification({
        userId: task.assignedTo._id,
        type: 'task',
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed from ${oldStatus} to ${status}`,
        priority: 'low',
        link: `/tasks/${task._id}`,
        metadata: {
          taskId: task._id,
          oldStatus,
          newStatus: status,
          changedBy: req.user.name
        }
      });
      
      // Emit real-time notification
      if (req.io) {
        req.io.to(`user-${task.assignedTo._id}`).emit('newNotification', {
          id: notification._id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority,
          createdAt: notification.createdAt
        });
      }
    }

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: { task }
    });
  })
);

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
router.post('/:id/comments',
  verifyToken,
  [
    body('comment').trim().notEmpty().withMessage('Comment is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { comment } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check access permissions
    const canAccess = req.user.role === 'administrator' ||
                     task.assignedTo.toString() === req.user._id.toString() ||
                     (req.user.role === 'division_head' && 
                      await User.findById(task.assignedTo).then(u => u?.department === req.user.department));

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'You cannot comment on this task'
      });
    }

    task.comments.push({
      userId: req.user._id,
      comment
    });

    await task.save();
    await task.populate('comments.userId', 'name email avatar');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { task }
    });
  })
);

// @route   PUT /api/tasks/reorder
// @desc    Reorder tasks (drag and drop)
// @access  Private
router.put('/reorder',
  verifyToken,
  [
    body('taskId').isMongoId().withMessage('Valid task ID is required'),
    body('newStatus').isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status'),
    body('newOrder').isInt({ min: 0 }).withMessage('Valid order is required')
  ],
  auditLog('Reorder Task', 'task'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { taskId, newStatus, newOrder } = req.body;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    const canReorder = req.user.role === 'administrator' ||
                      task.assignedTo.toString() === req.user._id.toString() ||
                      (req.user.role === 'division_head' && 
                       await User.findById(task.assignedTo).then(u => u?.department === req.user.department));

    if (!canReorder) {
      return res.status(403).json({
        success: false,
        message: 'You cannot reorder this task'
      });
    }

    // Update task status and add to history
    const oldStatus = task.status;
    task.status = newStatus;
    
    task.statusHistory.push({
      status: newStatus,
      changedBy: req.user._id,
      reason: 'Task reordered via drag and drop'
    });

    await task.save();

    // Emit real-time update
    if (req.io) {
      req.io.emit('taskUpdated', {
        taskId: task._id,
        newStatus,
        changedBy: req.user.name,
        timestamp: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Task reordered successfully',
      data: { task }
    });
  })
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id',
  verifyToken,
  requireRole('administrator', 'division_head'),
  auditLog('Delete Task', 'task'),
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check permissions
    if (req.user.role === 'division_head') {
      const assignedUser = await User.findById(task.assignedTo);
      if (assignedUser.department !== req.user.department) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete tasks from your department'
        });
      }
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  })
);

// @route   GET /api/tasks/overdue
// @desc    Get overdue tasks
// @access  Private
router.get('/overdue', verifyToken, asyncHandler(async (req, res) => {
  const overdueTasks = await Task.getOverdueTasks();
  
  res.json({
    success: true,
    data: { tasks: overdueTasks }
  });
}));

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', verifyToken, asyncHandler(async (req, res) => {
  let matchQuery = {};

  // Role-based filtering
  if (req.user.role === 'employee') {
    matchQuery.assignedTo = req.user._id;
  } else if (req.user.role === 'division_head') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    matchQuery.assignedTo = { $in: teamUsers.map(u => u._id) };
  }

  const stats = await Task.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
        inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        overdue: { $sum: { $cond: [{ $and: [{ $ne: ['$status', 'done'] }, { $lt: ['$deadline', new Date()] }] }, 1, 0] } }
      }
    }
  ]);

  const result = stats[0] || {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0
  };

  res.json({
    success: true,
    data: { stats: result }
  });
}));

module.exports = router;
