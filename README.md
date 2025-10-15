# Brahmaputra Board e-Office Productivity Management Module

A comprehensive e-office productivity management system built with React, Node.js, and MongoDB.

## Project Structure

This project is organized into separate frontend and backend folders:

```
├── frontend/              # Frontend React application
│   ├── src/              # React source code
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
├── backend/              # Backend Node.js application
│   ├── server/           # Express server code
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
└── package.json          # Root package.json for workspace management
```

## Features

- **KPI Management**: Track and manage Key Performance Indicators
- **Task Management**: Organize and track tasks with drag-and-drop functionality
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **User Management**: Role-based access control
- **Real-time Notifications**: Socket.io powered notifications
- **Financial Tracking**: Budget and expense management
- **Audit Logging**: Complete audit trail of all activities

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui components
- React Router for navigation
- React Query for state management
- Socket.io client for real-time features

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Socket.io for real-time communication
- Winston for logging
- Joi for validation

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```

4. Start both frontend and backend:
   ```bash
   npm run dev
   ```

### Individual Commands

- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`
- **Build frontend**: `npm run build:frontend`
- **Start backend**: `npm run start:backend`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `GET /api/kpis` - Get KPIs
- `POST /api/kpis` - Create KPI
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License