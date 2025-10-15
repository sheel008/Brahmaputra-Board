require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const cron = require('node-cron');

// Import routes
const authRoutes = require('./routes/auth');
const kpiRoutes = require('./routes/kpis');
const scoreRoutes = require('./routes/scores');
const taskRoutes = require('./routes/tasks');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const financeRoutes = require('./routes/finance');
const logRoutes = require('./routes/logs');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');

// Import seed data
const seedDatabase = require('./utils/seeds');

const app = express();
const server = createServer(app);

// CORS configuration for allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://your-frontend-app.vercel.app", // Replace with your actual Vercel URL
  "http://localhost:3000", // For local development
  "http://localhost:8080"  // For local development
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  }
});

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'brahmaputra-board-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brahmaputra-board';

mongoose.connect(MONGODB_URI)
.then(() => {
  logger.info('Connected to MongoDB');
  
  // Seed database if needed
  if (process.env.SEED_DATABASE === 'true') {
    seedDatabase().then(() => {
      logger.info('Database seeded successfully');
    }).catch(err => {
      logger.error('Error seeding database:', err);
    });
  }
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join user-specific room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Join department room for division heads
  socket.on('join-department-room', (department) => {
    socket.join(`dept-${department}`);
    logger.info(`User joined department room: ${department}`);
  });

  // Join admin room
  socket.on('join-admin-room', () => {
    socket.join('admin-room');
    logger.info('User joined admin room');
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kpis', kpiRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/logs', logRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Sync endpoint for e-Office integration
app.post('/api/sync', (req, res) => {
  // Placeholder for e-Office file log import
  logger.info('e-Office sync request received');
  res.json({ message: 'Sync endpoint ready for e-Office integration' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Scheduled tasks
cron.schedule('0 0 * * *', () => {
  // Daily cleanup and maintenance tasks
  logger.info('Running daily maintenance tasks');
  // Add cleanup logic here
});

cron.schedule('0 9 * * 1', () => {
  // Weekly reports generation
  logger.info('Generating weekly reports');
  // Add report generation logic here
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
