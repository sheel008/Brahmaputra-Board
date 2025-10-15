const express = require('express');
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const Task = require('../models/Task');
const User = require('../models/User');
const Finance = require('../models/Finance');
const { verifyToken, requireRole } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/analytics/:level
// @desc    Get analytics by level (org/team/individual)
// @access  Private
router.get('/:level', verifyToken, asyncHandler(async (req, res) => {
  const { level } = req.params;
  const { period, year, month } = req.query;

  let matchQuery = {};
  if (period) matchQuery.period = period;
  if (year) matchQuery.year = parseInt(year);
  if (month) matchQuery.month = month;

  let analytics = {};

  switch (level) {
    case 'individual':
      if (req.user.role !== 'employee') {
        return res.status(403).json({
          success: false,
          message: 'Individual analytics only available for employees'
        });
      }
      matchQuery.userId = req.user._id;
      break;

    case 'team':
      if (req.user.role !== 'division_head') {
        return res.status(403).json({
          success: false,
          message: 'Team analytics only available for division heads'
        });
      }
      const teamUsers = await User.find({ 
        department: req.user.department 
      }).select('_id');
      matchQuery.userId = { $in: teamUsers.map(u => u._id) };
      break;

    case 'org':
      if (req.user.role !== 'administrator') {
        return res.status(403).json({
          success: false,
          message: 'Organization analytics only available for administrators'
        });
      }
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid analytics level'
      });
  }

  // Get performance analytics
  const performanceAnalytics = await Score.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'kpis',
        localField: 'kpiId',
        foreignField: '_id',
        as: 'kpi'
      }
    },
    { $unwind: '$kpi' },
    {
      $group: {
        _id: null,
        totalScores: { $sum: 1 },
        averageScore: { $avg: '$finalScore' },
        maxScore: { $max: '$finalScore' },
        minScore: { $min: '$finalScore' },
        byKPI: {
          $push: {
            kpiName: '$kpi.name',
            score: '$finalScore',
            weight: '$kpi.weight',
            type: '$kpi.type'
          }
        },
        byType: {
          $push: {
            type: '$kpi.type',
            score: '$finalScore',
            weight: '$kpi.weight'
          }
        }
      }
    }
  ]);

  // Get task analytics
  let taskMatchQuery = {};
  if (level === 'individual') {
    taskMatchQuery.assignedTo = req.user._id;
  } else if (level === 'team') {
    const teamUsers = await User.find({ 
      department: req.user.department 
    }).select('_id');
    taskMatchQuery.assignedTo = { $in: teamUsers.map(u => u._id) };
  }

  const taskAnalytics = await Task.aggregate([
    { $match: taskMatchQuery },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        inProgressTasks: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        overdueTasks: { $sum: { $cond: [{ $and: [{ $ne: ['$status', 'done'] }, { $lt: ['$deadline', new Date()] }] }, 1, 0] } },
        avgCompletionTime: { $avg: { $subtract: ['$completedAt', '$createdAt'] } }
      }
    }
  ]);

  // Get trends (last 12 months)
  const trends = await Score.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'kpis',
        localField: 'kpiId',
        foreignField: '_id',
        as: 'kpi'
      }
    },
    { $unwind: '$kpi' },
    {
      $group: {
        _id: { month: '$month', year: '$year' },
        averageScore: { $avg: '$finalScore' },
        totalScores: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  // Get high/low performers
  const performers = await Score.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$userId',
        averageScore: { $avg: '$finalScore' },
        totalScores: { $sum: 1 }
      }
    },
    { $sort: { averageScore: -1 } }
  ]);

  // Get department comparisons (for org level)
  let departmentComparisons = [];
  if (level === 'org') {
    departmentComparisons = await Score.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.department',
          averageScore: { $avg: '$finalScore' },
          totalScores: { $sum: 1 },
          userCount: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          department: '$_id',
          averageScore: 1,
          totalScores: 1,
          userCount: { $size: '$userCount' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);
  }

  // Get KPI category performance
  const categoryPerformance = await Score.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'kpis',
        localField: 'kpiId',
        foreignField: '_id',
        as: 'kpi'
      }
    },
    { $unwind: '$kpi' },
    {
      $group: {
        _id: '$kpi.category',
        averageScore: { $avg: '$finalScore' },
        totalScores: { $sum: 1 },
        kpiCount: { $addToSet: '$kpiId' }
      }
    },
    {
      $project: {
        category: '$_id',
        averageScore: 1,
        totalScores: 1,
        kpiCount: { $size: '$kpiCount' }
      }
    },
    { $sort: { averageScore: -1 } }
  ]);

  analytics = {
    performance: performanceAnalytics[0] || {
      totalScores: 0,
      averageScore: 0,
      maxScore: 0,
      minScore: 0,
      byKPI: [],
      byType: []
    },
    tasks: taskAnalytics[0] || {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      avgCompletionTime: 0
    },
    trends,
    performers: {
      highPerformers: performers.slice(0, 5),
      lowPerformers: performers.slice(-5).reverse()
    },
    departmentComparisons,
    categoryPerformance
  };

  // Calculate completion rate
  if (analytics.tasks.totalTasks > 0) {
    analytics.tasks.completionRate = (analytics.tasks.completedTasks / analytics.tasks.totalTasks) * 100;
  } else {
    analytics.tasks.completionRate = 0;
  }

  res.json({
    success: true,
    data: { analytics }
  });
}));

// @route   GET /api/analytics/comparisons/:type
// @desc    Get comparison analytics
// @access  Private
router.get('/comparisons/:type', verifyToken, asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { period, year } = req.query;

  let matchQuery = {};
  if (period) matchQuery.period = period;
  if (year) matchQuery.year = parseInt(year);

  let comparisons = {};

  switch (type) {
    case 'departments':
      if (req.user.role !== 'administrator') {
        return res.status(403).json({
          success: false,
          message: 'Department comparisons only available for administrators'
        });
      }

      comparisons = await Score.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $group: {
            _id: '$user.department',
            averageScore: { $avg: '$finalScore' },
            totalScores: { $sum: 1 },
            userCount: { $addToSet: '$userId' },
            maxScore: { $max: '$finalScore' },
            minScore: { $min: '$finalScore' }
          }
        },
        {
          $project: {
            department: '$_id',
            averageScore: 1,
            totalScores: 1,
            userCount: { $size: '$userCount' },
            maxScore: 1,
            minScore: 1
          }
        },
        { $sort: { averageScore: -1 } }
      ]);
      break;

    case 'roles':
      if (req.user.role !== 'administrator') {
        return res.status(403).json({
          success: false,
          message: 'Role comparisons only available for administrators'
        });
      }

      comparisons = await Score.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $group: {
            _id: '$user.role',
            averageScore: { $avg: '$finalScore' },
            totalScores: { $sum: 1 },
            userCount: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            role: '$_id',
            averageScore: 1,
            totalScores: 1,
            userCount: { $size: '$userCount' }
          }
        },
        { $sort: { averageScore: -1 } }
      ]);
      break;

    case 'time-periods':
      comparisons = await Score.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            averageScore: { $avg: '$finalScore' },
            totalScores: { $sum: 1 },
            period: { $first: '$period' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid comparison type'
      });
  }

  res.json({
    success: true,
    data: { comparisons }
  });
}));

// @route   GET /api/analytics/trends/:metric
// @desc    Get trend analytics for specific metric
// @access  Private
router.get('/trends/:metric', verifyToken, asyncHandler(async (req, res) => {
  const { metric } = req.params;
  const { period, year, limit = 12 } = req.query;

  let matchQuery = {};
  if (period) matchQuery.period = period;
  if (year) matchQuery.year = parseInt(year);

  let trends = {};

  switch (metric) {
    case 'performance':
      trends = await Score.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: { month: '$month', year: '$year' },
            averageScore: { $avg: '$finalScore' },
            totalScores: { $sum: 1 },
            period: { $first: '$period' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: parseInt(limit) }
      ]);
      break;

    case 'task-completion':
      let taskMatchQuery = {};
      if (req.user.role === 'employee') {
        taskMatchQuery.assignedTo = req.user._id;
      } else if (req.user.role === 'division_head') {
        const teamUsers = await User.find({ 
          department: req.user.department 
        }).select('_id');
        taskMatchQuery.assignedTo = { $in: teamUsers.map(u => u._id) };
      }

      trends = await Task.aggregate([
        { $match: taskMatchQuery },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            totalTasks: { $sum: 1 },
            completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } }
          }
        },
        {
          $project: {
            month: '$_id.month',
            year: '$_id.year',
            totalTasks: 1,
            completedTasks: 1,
            completionRate: {
              $multiply: [
                { $divide: ['$completedTasks', '$totalTasks'] },
                100
              ]
            }
          }
        },
        { $sort: { year: 1, month: 1 } },
        { $limit: parseInt(limit) }
      ]);
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid metric type'
      });
  }

  res.json({
    success: true,
    data: { trends }
  });
}));

// @route   GET /api/analytics/export/:format
// @desc    Export analytics data
// @access  Private
router.get('/export/:format', verifyToken, asyncHandler(async (req, res) => {
  const { format } = req.params;
  const { level, period, year } = req.query;

  if (!['csv', 'json', 'pdf'].includes(format)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid export format'
    });
  }

  // This is a placeholder for export functionality
  // In a real implementation, you would generate the appropriate file format
  
  res.json({
    success: true,
    message: `Export functionality for ${format} format will be implemented`,
    data: {
      format,
      level,
      period,
      year,
      downloadUrl: `/api/analytics/download/${Date.now()}.${format}`
    }
  });
}));

module.exports = router;
