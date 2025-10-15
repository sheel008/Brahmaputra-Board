const express = require('express');
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const KPI = require('../models/KPI');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken, requireRole, canAccessResource, auditLog } = require('../middleware/auth');
const { asyncHandler, handleValidationError } = require('../middleware/errorHandler');

const router = express.Router();

// @route   POST /api/scores/submit
// @desc    Submit KPI score
// @access  Private
router.post('/submit',
  verifyToken,
  [
    body('kpiId').isMongoId().withMessage('Valid KPI ID is required'),
    body('value').isFloat({ min: 0 }).withMessage('Value must be positive'),
    body('month').isIn(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).withMessage('Valid month is required'),
    body('year').isInt({ min: 2020, max: 2030 }).withMessage('Valid year is required'),
    body('notes').optional().trim()
  ],
  auditLog('Submit Score', 'score'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { kpiId, value, month, year, notes } = req.body;
    const userId = req.user._id;

    // Check if KPI exists
    const kpi = await KPI.findById(kpiId);
    if (!kpi) {
      return res.status(404).json({
        success: false,
        message: 'KPI not found'
      });
    }

    // Check if user can submit for this KPI role
    const userRole = req.user.department === 'Field Unit' ? 'field_unit' : 
                    req.user.role === 'division_head' ? 'division_head' : 'hq_staff';
    
    if (kpi.role !== userRole) {
      return res.status(403).json({
        success: false,
        message: 'You cannot submit scores for this KPI role'
      });
    }

    // Check if score already exists for this period
    const existingScore = await Score.findOne({
      userId,
      kpiId,
      month,
      year
    });

    if (existingScore) {
      return res.status(400).json({
        success: false,
        message: 'Score already exists for this period'
      });
    }

    // Create score
    const scoreData = {
      userId,
      kpiId,
      value,
      target: kpi.targetValue,
      month,
      year,
      period: `${month} ${year}`,
      evaluatedBy: req.user._id,
      notes,
      source: 'manual'
    };

    const score = new Score(scoreData);
    await score.save();

    // Populate the score with KPI details
    await score.populate('kpiId', 'name weight type');

    // Create notification for evaluator if different from user
    if (req.user.role === 'employee') {
      const divisionHead = await User.findOne({ 
        department: req.user.department, 
        role: 'division_head' 
      });
      
      if (divisionHead) {
        const notification = await Notification.createNotification({
          userId: divisionHead._id,
          type: 'kpi',
          title: 'New KPI Score Submitted',
          message: `${req.user.name} submitted a score for ${kpi.name}`,
          priority: 'medium',
          link: `/scores/${userId}/${month}-${year}`,
          metadata: {
            scoreId: score._id,
            kpiName: kpi.name,
            value: value
          }
        });
        
        // Emit real-time notification
        if (req.io) {
          req.io.to(`user-${divisionHead._id}`).emit('newNotification', {
            id: notification._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            createdAt: notification.createdAt
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Score submitted successfully',
      data: { score }
    });
  })
);

// @route   GET /api/scores/:userId/:period
// @desc    Get user scores for a period
// @access  Private
router.get('/:userId/:period',
  verifyToken,
  canAccessResource('score'),
  asyncHandler(async (req, res) => {
    const { userId, period } = req.params;
    const [month, year] = period.split('-');

    // Validate period format
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period format. Use MM-YYYY'
      });
    }

    const scores = await Score.find({
      userId,
      month,
      year: parseInt(year)
    })
    .populate('kpiId', 'name weight type category unit')
    .populate('evaluatedBy', 'name email')
    .populate('verifiedBy', 'name email')
    .sort({ 'kpiId.weight': -1 });

    // Get performance summary
    const summary = await Score.getUserPerformanceSummary(userId, `${month} ${year}`);

    // Get trends (last 6 months)
    const trends = await Score.find({
      userId,
      year: parseInt(year)
    })
    .populate('kpiId', 'name weight type')
    .sort({ month: 1 });

    // Calculate distributions
    const distributions = {
      average: summary.totalScore / summary.kpis.length || 0,
      variance: 0,
      percentiles: {
        p25: 0,
        p50: 0,
        p75: 0,
        p90: 0
      }
    };

    if (summary.kpis.length > 0) {
      const scores = summary.kpis.map(k => k.finalScore).sort((a, b) => a - b);
      const n = scores.length;
      
      distributions.variance = scores.reduce((sum, score) => 
        sum + Math.pow(score - distributions.average, 2), 0) / n;
      
      distributions.percentiles.p25 = scores[Math.floor(n * 0.25)] || 0;
      distributions.percentiles.p50 = scores[Math.floor(n * 0.5)] || 0;
      distributions.percentiles.p75 = scores[Math.floor(n * 0.75)] || 0;
      distributions.percentiles.p90 = scores[Math.floor(n * 0.9)] || 0;
    }

    res.json({
      success: true,
      data: {
        scores,
        summary,
        trends,
        distributions
      }
    });
  })
);

// @route   PUT /api/scores/:id
// @desc    Update score
// @access  Private
router.put('/:id',
  verifyToken,
  [
    body('value').optional().isFloat({ min: 0 }).withMessage('Value must be positive'),
    body('notes').optional().trim()
  ],
  auditLog('Update Score', 'score'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    // Check permissions
    const canEdit = req.user.role === 'administrator' || 
                   req.user._id.toString() === score.userId.toString() ||
                   (req.user.role === 'division_head' && 
                    await User.findById(score.userId).then(u => u?.department === req.user.department));

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'You cannot edit this score'
      });
    }

    const updateData = {
      ...req.body,
      lastModifiedBy: req.user._id
    };

    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('kpiId', 'name weight type')
    .populate('evaluatedBy', 'name email');

    res.json({
      success: true,
      message: 'Score updated successfully',
      data: { score: updatedScore }
    });
  })
);

// @route   POST /api/scores/:id/verify
// @desc    Verify score (Division Head/Admin only)
// @access  Private
router.post('/:id/verify',
  verifyToken,
  requireRole('division_head', 'administrator'),
  auditLog('Verify Score', 'score'),
  asyncHandler(async (req, res) => {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({
        success: false,
        message: 'Score not found'
      });
    }

    // Check if user can verify this score
    if (req.user.role === 'division_head') {
      const scoreUser = await User.findById(score.userId);
      if (scoreUser.department !== req.user.department) {
        return res.status(403).json({
          success: false,
          message: 'You can only verify scores from your department'
        });
      }
    }

    score.verified = true;
    score.verifiedBy = req.user._id;
    score.verifiedAt = new Date();
    await score.save();

    // Notify the user whose score was verified
    const notification = await Notification.createNotification({
      userId: score.userId,
      type: 'kpi',
      title: 'Score Verified',
      message: `Your ${score.kpiId.name} score has been verified by ${req.user.name}`,
      priority: 'low',
      link: `/scores/${score.userId}/${score.period}`
    });
    
    // Emit real-time notification
    if (req.io) {
      req.io.to(`user-${score.userId}`).emit('newNotification', {
        id: notification._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    }

    res.json({
      success: true,
      message: 'Score verified successfully'
    });
  })
);

// @route   GET /api/scores/user/:userId
// @desc    Get all scores for a user
// @access  Private
router.get('/user/:userId',
  verifyToken,
  canAccessResource('score'),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, year, month } = req.query;

    const query = { userId };
    if (year) query.year = parseInt(year);
    if (month) query.month = month;

    const scores = await Score.find(query)
      .populate('kpiId', 'name weight type category')
      .populate('evaluatedBy', 'name email')
      .sort({ year: -1, month: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Score.countDocuments(query);

    res.json({
      success: true,
      data: {
        scores,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  })
);

// @route   GET /api/scores/analytics/:level
// @desc    Get score analytics by level
// @access  Private
router.get('/analytics/:level',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { level } = req.params;
    const { period, year } = req.query;

    let matchQuery = {};
    if (period) matchQuery.period = period;
    if (year) matchQuery.year = parseInt(year);

    let analytics = {};

    switch (level) {
      case 'individual':
        if (req.user.role === 'employee') {
          matchQuery.userId = req.user._id;
        } else {
          return res.status(403).json({
            success: false,
            message: 'Individual analytics only available for employees'
          });
        }
        break;

      case 'team':
        if (req.user.role === 'division_head') {
          const teamUsers = await User.find({ 
            department: req.user.department 
          }).select('_id');
          matchQuery.userId = { $in: teamUsers.map(u => u._id) };
        } else {
          return res.status(403).json({
            success: false,
            message: 'Team analytics only available for division heads'
          });
        }
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

    // Get aggregated analytics
    const pipeline = [
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
          }
        }
      }
    ];

    const result = await Score.aggregate(pipeline);
    analytics = result[0] || {
      totalScores: 0,
      averageScore: 0,
      maxScore: 0,
      minScore: 0,
      byKPI: []
    };

    // Calculate high/low performers
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

    analytics.highPerformers = performers.slice(0, 5);
    analytics.lowPerformers = performers.slice(-5).reverse();

    res.json({
      success: true,
      data: { analytics }
    });
  })
);

module.exports = router;
