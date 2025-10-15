const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Role-based access control
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user can access resource
const canAccessResource = (resourceType) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user;

      // Admin can access everything
      if (currentUser.role === 'administrator') {
        return next();
      }

      // Division heads can access their department's resources
      if (currentUser.role === 'division_head') {
        if (resourceType === 'user') {
          const targetUser = await User.findById(userId);
          if (targetUser && targetUser.department === currentUser.department) {
            return next();
          }
        } else if (resourceType === 'task' || resourceType === 'score') {
          // Check if the resource belongs to someone in their department
          const resource = await mongoose.model(resourceType === 'task' ? 'Task' : 'Score').findById(req.params.id);
          if (resource) {
            const resourceUser = await User.findById(resource.userId || resource.assignedTo);
            if (resourceUser && resourceUser.department === currentUser.department) {
              return next();
            }
          }
        }
      }

      // Employees can only access their own resources
      if (currentUser.role === 'employee') {
        if (userId && userId !== currentUser._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'You can only access your own resources.'
          });
        }
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking resource access.'
      });
    }
  };
};

// Audit logging middleware
const auditLog = (action, entityType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      setImmediate(async () => {
        try {
          await AuditLog.logAction({
            userId: req.user?._id,
            userName: req.user?.name || 'Anonymous',
            action,
            entityType,
            entityId: req.params.id || req.body.id,
            details: `${action} ${entityType}`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            category: action.toLowerCase(),
            metadata: {
              method: req.method,
              url: req.originalUrl,
              statusCode: res.statusCode
            }
          });
        } catch (error) {
          console.error('Audit logging error:', error);
        }
      });
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.user?._id || req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old attempts
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key).filter(time => time > windowStart);
      attempts.set(key, userAttempts);
    } else {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    if (userAttempts.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many sensitive operations. Please try again later.'
      });
    }
    
    userAttempts.push(now);
    next();
  };
};

// Validate 2FA if enabled
const require2FA = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.twoFactorEnabled) {
      const token = req.header('X-2FA-Token');
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: '2FA token required.',
          requires2FA: true
        });
      }
      
      // Verify 2FA token (implementation depends on your 2FA method)
      // This is a placeholder - implement actual 2FA verification
      const isValid2FA = true; // Replace with actual 2FA verification
      
      if (!isValid2FA) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA token.'
        });
      }
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '2FA verification error.'
    });
  }
};

module.exports = {
  verifyToken,
  requireRole,
  canAccessResource,
  auditLog,
  sensitiveOperationLimit,
  require2FA
};
