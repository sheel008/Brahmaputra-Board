# Brahmaputra Board e-Office Backend

A comprehensive backend system for the Brahmaputra Board e-Office Productivity Management Module, built with Node.js, Express.js, MongoDB, and Socket.io.

## Features

- **Authentication & Authorization**: JWT-based authentication with 2FA support and role-based access control
- **KPI Management**: Complete KPI definition, scoring, and tracking system
- **Task Management**: Kanban-style task management with real-time updates
- **Real-time Notifications**: Socket.io-powered notifications and updates
- **Analytics & Reporting**: Comprehensive analytics for individual, team, and organizational levels
- **Financial Management**: Budget tracking and financial oversight
- **Audit Logging**: Complete audit trail for all system activities
- **Security**: Helmet, CORS, rate limiting, and input validation

## Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT with Speakeasy for 2FA
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: Joi and express-validator
- **Logging**: Winston
- **Testing**: Jest

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bramhaputraboard/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or install MongoDB locally
   # Follow MongoDB installation guide for your OS
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/setup-2fa` - Setup 2FA
- `POST /api/auth/verify-2fa` - Verify 2FA token
- `POST /api/auth/logout` - User logout

### KPIs
- `GET /api/kpis` - Get all KPIs
- `POST /api/kpis` - Create KPI (Admin only)
- `PUT /api/kpis/:id` - Update KPI (Admin only)
- `DELETE /api/kpis/:id` - Delete KPI (Admin only)
- `GET /api/kpis/role/:role` - Get KPIs by role

### Scores
- `POST /api/scores/submit` - Submit KPI score
- `GET /api/scores/:userId/:period` - Get user scores for period
- `PUT /api/scores/:id` - Update score
- `POST /api/scores/:id/verify` - Verify score (Division Head/Admin)

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/status` - Update task status
- `POST /api/tasks/:id/comments` - Add comment to task
- `PUT /api/tasks/reorder` - Reorder tasks (drag & drop)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications` - Create notification (Admin/Division Head)
- `POST /api/notifications/broadcast` - Broadcast notification (Admin)

### Analytics
- `GET /api/analytics/:level` - Get analytics by level (org/team/individual)
- `GET /api/analytics/comparisons/:type` - Get comparison analytics
- `GET /api/analytics/trends/:metric` - Get trend analytics

### Finance
- `GET /api/finance` - Get financial data
- `POST /api/finance` - Create financial record (Admin)
- `PUT /api/finance/:id` - Update financial record
- `POST /api/finance/:id/spend` - Record expenditure
- `GET /api/finance/alerts` - Get budget alerts

### Audit Logs
- `GET /api/logs` - Get audit logs
- `GET /api/logs/user/:userId` - Get user activity logs
- `GET /api/logs/system` - Get system logs (Admin)
- `GET /api/logs/security` - Get security events (Admin)

## Database Models

### User
- Basic user information with role-based access
- 2FA support with Speakeasy
- Department and role management

### KPI
- KPI definitions with weights and targets
- Role-specific KPIs (HQ Staff, Field Unit, Division Head)
- Weight validation (must sum to 100%)

### Score
- KPI performance scores
- Automatic final score calculation
- Verification system for scores

### Task
- Task management with status tracking
- Comments and status history
- Drag-and-drop reordering support

### Notification
- Real-time notifications
- Priority-based notification system
- Read/unread status tracking

### Finance
- Project budget tracking
- Expenditure recording
- Budget alerts and warnings

### AuditLog
- Complete audit trail
- Immutable log entries
- Security event tracking

## Real-time Features

The backend uses Socket.io for real-time features:

- **Task Updates**: Real-time task status changes
- **Notifications**: Instant notification delivery
- **Score Updates**: Live score submission notifications
- **User Presence**: Track user activity

### Socket Events

- `join-user-room` - Join user-specific room
- `join-department-room` - Join department room
- `join-admin-room` - Join admin room
- `taskUpdated` - Task status change
- `scoreUpdated` - Score submission
- `newNotification` - New notification

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **2FA Support**: Two-factor authentication with TOTP
- **Role-Based Access Control**: Granular permissions system
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Input Validation**: Joi and express-validator
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured CORS policies
- **Audit Logging**: Complete activity tracking

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Using Docker

1. **Build Docker image**
   ```bash
   docker build -t brahmaputra-backend .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start application**
   ```bash
   pm2 start index.js --name brahmaputra-backend
   ```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## Monitoring & Logging

- **Winston Logging**: Structured logging with multiple transports
- **Error Handling**: Comprehensive error handling middleware
- **Health Checks**: `/api/health` endpoint for monitoring
- **Audit Logs**: Complete activity tracking

## API Documentation

The API documentation is available at `/api-docs` when `ENABLE_SWAGGER=true` in environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
