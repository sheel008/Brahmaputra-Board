# Brahmaputra Board - Technical Architecture Overview

## Project Structure & Organization

### 🎯 **Project Type**: Full-Stack E-Office Productivity Management System
### 🏗️ **Architecture**: Monorepo with separate Frontend and Backend

---

## 📁 **File Organization**

### **Frontend (React + TypeScript)**
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui component library
│   ├── DashboardLayout.tsx
│   ├── KPICard.tsx
│   ├── NotificationBell.tsx
│   └── ...
├── pages/               # Route-based page components
│   ├── Login.tsx
│   ├── DashboardHome.tsx
│   ├── KPIManagement.tsx
│   ├── Analytics.tsx
│   └── ...
├── services/            # API integration layer
│   └── api.ts          # Centralized API service
├── types/               # TypeScript type definitions
│   ├── kpi.ts
│   └── user.ts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── data/                # Mock data and constants
└── integrations/        # External service integrations
    └── supabase/        # Supabase client setup
```

### **Backend (Node.js + Express)**
```
server/
├── models/              # MongoDB/Mongoose schemas
│   ├── User.js
│   ├── KPI.js
│   ├── Task.js
│   ├── Score.js
│   └── ...
├── routes/              # API route handlers
│   ├── auth.js
│   ├── kpis.js
│   ├── tasks.js
│   └── ...
├── middleware/          # Express middleware
│   ├── auth.js
│   └── errorHandler.js
├── utils/               # Utility functions
│   └── seeds.js
└── logs/                # Application logs
```

---

## 🛠️ **Technology Stack**

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI framework |
| **TypeScript** | 5.8.3 | Type safety and development experience |
| **Vite** | 7.1.9 | Build tool and dev server |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Component library (Radix UI based) |
| **React Query** | 5.83.0 | Server state management |
| **React Hook Form** | 7.61.1 | Form handling |
| **Zod** | 3.25.76 | Schema validation |
| **Socket.io Client** | 4.8.1 | Real-time communication |
| **Recharts** | 3.2.1 | Data visualization |
| **React Beautiful DnD** | 13.1.1 | Drag and drop functionality |
| **Supabase** | 2.75.0 | Backend-as-a-Service (optional) |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥20.0.0 | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | Latest | Primary database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **Socket.io** | 4.7.4 | Real-time communication |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Winston** | 3.11.0 | Logging framework |
| **Helmet** | 7.1.0 | Security middleware |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Joi** | 17.11.0 | Request validation |
| **Node-cron** | 3.0.3 | Scheduled tasks |

---

## 🏛️ **System Architecture**

### **High-Level Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React SPA)   │◄──►│   (Express API) │◄──►│   (MongoDB)     │
│   Port: 8080    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Socket.io     │
│   (Optional)    │    │   (Real-time)   │
└─────────────────┘    └─────────────────┘
```

### **Data Flow Architecture**
```
User Interface (React)
        ↓
API Service Layer (api.ts)
        ↓
HTTP Requests (Fetch API)
        ↓
Express.js Routes
        ↓
Middleware (Auth, Validation)
        ↓
Mongoose Models
        ↓
MongoDB Database
        ↓
Socket.io (Real-time updates)
        ↓
Frontend State Updates
```

---

## 🔧 **Key Features & Modules**

### **1. Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Employee, Division Head, Administrator)
- Two-factor authentication support
- Password reset functionality

### **2. KPI Management System**
- Dynamic KPI creation and management
- Role-specific KPI assignments
- Weight-based scoring system
- Performance tracking and analytics

### **3. Task Management**
- Kanban-style task boards
- Drag-and-drop functionality
- Task assignment and tracking
- Comment system and notifications

### **4. Real-time Features**
- Live notifications
- Real-time task updates
- Score submission notifications
- Department-wide announcements

### **5. Analytics & Reporting**
- Performance dashboards
- Trend analysis
- Department comparisons
- Export capabilities

### **6. Financial Management**
- Budget tracking
- Expense management
- Department-wise financial reports
- Budget alerts and notifications

---

## 🔒 **Security Features**

### **Backend Security**
- Helmet.js for security headers
- Rate limiting (100 requests/15 minutes)
- CORS configuration
- Input validation with Joi
- Password hashing with bcrypt
- JWT token authentication
- Audit logging

### **Frontend Security**
- Environment variable protection
- Token-based authentication
- Route protection
- Input sanitization
- XSS protection

---

## 📊 **Database Schema**

### **Core Collections**
1. **Users** - Employee information and authentication
2. **KPIs** - Key Performance Indicators configuration
3. **Scores** - Performance scores and evaluations
4. **Tasks** - Task management and tracking
5. **Notifications** - System notifications
6. **Finance** - Financial data and budgets
7. **AuditLogs** - System activity tracking

---

## 🚀 **Development & Deployment**

### **Development Scripts**
```bash
# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run dev          # Start with nodemon
npm start            # Start production server
npm run seed         # Seed database
```

### **Environment Configuration**
- Frontend: `.env` (Vite environment variables)
- Backend: `server/.env` (Node.js environment variables)
- Database: MongoDB connection strings
- Supabase: Optional integration

---

## 🔄 **API Endpoints Structure**

### **Authentication Routes** (`/api/auth`)
- POST `/login` - User authentication
- POST `/logout` - User logout
- GET `/me` - Get current user
- POST `/register` - User registration

### **KPI Routes** (`/api/kpis`)
- GET `/` - List KPIs with filtering
- POST `/` - Create new KPI
- GET `/role/:role` - Get KPIs by role
- PUT `/:id` - Update KPI

### **Task Routes** (`/api/tasks`)
- GET `/` - List tasks with filtering
- POST `/` - Create new task
- PUT `/:id` - Update task
- PUT `/:id/status` - Update task status

### **Analytics Routes** (`/api/analytics`)
- GET `/individual` - Individual performance analytics
- GET `/team` - Team performance analytics
- GET `/org` - Organization-wide analytics

---

## 📈 **Performance Optimizations**

### **Frontend**
- Vite for fast development and building
- React Query for efficient data fetching
- Component lazy loading
- Image optimization
- Bundle splitting

### **Backend**
- MongoDB indexing for query optimization
- Response compression
- Rate limiting
- Connection pooling
- Caching strategies

---

## 🔧 **Development Tools**

### **Code Quality**
- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting
- Husky for git hooks

### **Testing**
- Jest for unit testing
- Supertest for API testing
- React Testing Library (planned)

### **Monitoring**
- Winston for logging
- Health check endpoints
- Error tracking
- Performance monitoring

---

This architecture provides a robust, scalable foundation for the Brahmaputra Board e-Office Productivity Management System with modern development practices and security considerations.
