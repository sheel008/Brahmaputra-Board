const express = require('express');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { verifyToken, requireRole, auditLog, sensitiveOperationLimit } = require('../middleware/auth');
const { asyncHandler, handleValidationError, AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user (Admin only)
// @access  Private (Admin)
router.post('/register', 
  verifyToken,
  requireRole('administrator'),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['employee', 'division_head', 'administrator']).withMessage('Invalid role'),
    body('department').trim().notEmpty().withMessage('Department is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { name, email, password, role, department, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      department,
      gender: gender || 'other'
    });

    await user.save();

    // Log registration
    await AuditLog.logAction({
      userId: req.user._id,
      userName: req.user.name,
      action: 'User Registration',
      entityType: 'user',
      entityId: user._id,
      details: `Registered new ${role} user: ${name}`,
      category: 'create',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department
        }
      }
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Log login
    await AuditLog.logAction({
      userId: user._id,
      userName: user.name,
      action: 'User Login',
      entityType: 'user',
      entityId: user._id,
      details: `User logged in from ${req.ip}`,
      category: 'login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          twoFactorEnabled: user.twoFactorEnabled
        }
      }
    });
  })
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', verifyToken, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

// @route   POST /api/auth/setup-2fa
// @desc    Setup 2FA for user
// @access  Private
router.post('/setup-2fa', 
  verifyToken,
  sensitiveOperationLimit(),
  asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is already enabled'
      });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Brahmaputra Board (${user.email})`,
      issuer: 'Brahmaputra Board'
    });

    // Save secret to user (temporarily)
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.json({
      success: true,
      message: '2FA setup initiated',
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32
      }
    });
  })
);

// @route   POST /api/auth/verify-2fa
// @desc    Verify 2FA token and enable 2FA
// @access  Private
router.post('/verify-2fa',
  verifyToken,
  [
    body('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { token } = req.body;
    const user = req.user;

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA setup not initiated'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save();

    // Log 2FA enablement
    await AuditLog.logAction({
      userId: user._id,
      userName: user.name,
      action: '2FA Enabled',
      entityType: 'user',
      entityId: user._id,
      details: 'Two-factor authentication enabled',
      category: 'update',
      severity: 'medium',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: '2FA enabled successfully'
    });
  })
);

// @route   POST /api/auth/disable-2fa
// @desc    Disable 2FA for user
// @access  Private
router.post('/disable-2fa',
  verifyToken,
  sensitiveOperationLimit(),
  [
    body('token').isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { token } = req.body;
    const user = req.user;

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: '2FA is not enabled'
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 2FA token'
      });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    // Log 2FA disablement
    await AuditLog.logAction({
      userId: user._id,
      userName: user.name,
      action: '2FA Disabled',
      entityType: 'user',
      entityId: user._id,
      details: 'Two-factor authentication disabled',
      category: 'update',
      severity: 'high',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', verifyToken, asyncHandler(async (req, res) => {
  // Log logout
  await AuditLog.logAction({
    userId: req.user._id,
    userName: req.user.name,
    action: 'User Logout',
    entityType: 'user',
    entityId: req.user._id,
    details: `User logged out from ${req.ip}`,
    category: 'logout',
    ipAddress: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
}));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile',
  verifyToken,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(handleValidationError(errors.array()));
    }

    const { name, email, avatar } = req.body;
    const user = req.user;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
    }

    // Update user
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar
        }
      }
    });
  })
);

module.exports = router;
