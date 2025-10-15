# Brahmaputra Board - File Organization Summary

## 📁 **Complete File Structure & Organization**

### **🎯 Project Overview**
- **Type**: Full-Stack E-Office Productivity Management System
- **Architecture**: Monorepo with separate Frontend and Backend
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB

---

## 🎨 **FRONTEND FILES** (React + TypeScript)

### **📦 Core Application Files**
```
├── src/
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles
│   ├── App.css                    # Application-specific styles
│   └── vite-env.d.ts             # Vite environment types
```

### **🧩 Components Directory**
```
├── src/components/
│   ├── ui/                        # shadcn/ui component library
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ... (30+ UI components)
│   │
│   ├── DashboardLayout.tsx        # Main dashboard layout
│   ├── DraggableWorkflowBoard.tsx # Kanban-style task board
│   ├── KPIAnalytics.tsx          # KPI analytics component
│   ├── KPICalculator.tsx         # KPI calculation component
│   ├── KPICard.tsx               # Individual KPI display
│   ├── NotificationBell.tsx      # Notification system
│   └── CoreConceptsCard.tsx      # Core concepts display
```

### **📄 Pages Directory**
```
├── src/pages/
│   ├── Login.tsx                  # Authentication page
│   ├── DashboardHome.tsx          # Main dashboard
│   ├── KPIManagement.tsx          # KPI management interface
│   ├── Analytics.tsx              # Analytics and reporting
│   ├── Finance.tsx                # Financial management
│   ├── Monitoring.tsx             # System monitoring
│   ├── Tracking.tsx               # Performance tracking
│   ├── Engagement.tsx             # Employee engagement
│   ├── Index.tsx                  # Landing page
│   └── NotFound.tsx               # 404 error page
```

### **🔧 Services & Integration**
```
├── src/services/
│   └── api.ts                     # Centralized API service
│
├── src/integrations/
│   └── supabase/
│       ├── client.ts              # Supabase client setup
│       └── types.ts               # Supabase type definitions
```

### **📊 Data & Types**
```
├── src/data/
│   ├── comprehensiveKPIData.ts    # Comprehensive KPI dataset
│   ├── expandedKPIData.ts         # Expanded KPI data
│   ├── mockData.ts                # Mock data for development
│   └── mockProjects.ts            # Mock project data
│
├── src/types/
│   ├── kpi.ts                     # KPI type definitions
│   └── user.ts                    # User type definitions
```

### **🎣 Custom Hooks**
```
├── src/hooks/
│   ├── use-mobile.tsx             # Mobile detection hook
│   └── use-toast.ts               # Toast notification hook
```

### **🛠️ Utilities**
```
├── src/lib/
│   └── utils.ts                   # Utility functions
```

### **🎨 Assets**
```
├── src/assets/
│   ├── brahmaputra-logo.png       # Main logo
│   └── brahmaputra-logo-new.png   # Updated logo
```

---

## ⚙️ **BACKEND FILES** (Node.js + Express)

### **🚀 Server Entry Points**
```
├── server/
│   ├── index.js                   # Main server file
│   ├── simple-server.js           # Simplified server for testing
│   └── test-server.js             # Test server configuration
```

### **📊 Database Models**
```
├── server/models/
│   ├── User.js                    # User schema and authentication
│   ├── KPI.js                     # KPI definition schema
│   ├── Task.js                    # Task management schema
│   ├── Score.js                   # Performance scoring schema
│   ├── Notification.js            # Notification system schema
│   ├── Finance.js                 # Financial data schema
│   └── AuditLog.js                # Audit logging schema
```

### **🛣️ API Routes**
```
├── server/routes/
│   ├── auth.js                    # Authentication endpoints
│   ├── kpis.js                    # KPI management endpoints
│   ├── tasks.js                   # Task management endpoints
│   ├── scores.js                  # Performance scoring endpoints
│   ├── notifications.js           # Notification endpoints
│   ├── analytics.js               # Analytics and reporting endpoints
│   ├── finance.js                 # Financial management endpoints
│   └── logs.js                    # Audit log endpoints
```

### **🔒 Middleware**
```
├── server/middleware/
│   ├── auth.js                    # Authentication middleware
│   └── errorHandler.js            # Error handling middleware
```

### **🛠️ Utilities**
```
├── server/utils/
│   └── seeds.js                   # Database seeding utilities
```

### **📝 Logs**
```
├── server/logs/
│   ├── combined.log               # Combined application logs
│   └── error.log                  # Error-specific logs
```

---

## ⚙️ **CONFIGURATION FILES**

### **📦 Package Management**
```
├── package.json                   # Frontend dependencies
├── package-lock.json              # Frontend dependency lock
├── bun.lockb                      # Bun package manager lock
├── server/package.json            # Backend dependencies
└── server/package-lock.json       # Backend dependency lock
```

### **🔧 Build & Development**
```
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # App-specific TypeScript config
├── tsconfig.node.json             # Node-specific TypeScript config
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
└── eslint.config.js               # ESLint configuration
```

### **🎨 UI Configuration**
```
├── components.json                # shadcn/ui configuration
```

### **🗄️ Database Configuration**
```
├── supabase/
│   └── config.toml                # Supabase configuration
```

---

## 📚 **DOCUMENTATION FILES**

### **📖 Project Documentation**
```
├── README.md                      # Main project documentation
├── DEPLOYMENT.md                  # Deployment instructions
├── TECHNICAL_ARCHITECTURE.md      # Technical architecture overview
├── ARCHITECTURE_DIAGRAM.md        # System architecture diagrams
└── FILE_ORGANIZATION.md           # This file - file organization
```

### **📋 Server Documentation**
```
├── server/README.md               # Backend-specific documentation
```

---

## 🌐 **PUBLIC ASSETS**

### **📁 Static Files**
```
├── public/
│   ├── favicon.ico                # Website favicon
│   ├── placeholder.svg            # Placeholder image
│   └── robots.txt                 # Search engine directives
```

---

## 🧪 **TESTING & DEVELOPMENT**

### **🔍 Test Files**
```
├── test-connection.html           # Connection testing utility
```

### **🌍 Environment Files**
```
├── .env                           # Frontend environment variables
└── server/env.example             # Backend environment template
```

---

## 📊 **TECHNOLOGY STACK SUMMARY**

### **Frontend Technologies Used:**
- **React 18.3.1** - Core UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.9** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Styling framework
- **shadcn/ui** - Component library (Radix UI based)
- **React Router DOM 6.30.1** - Client-side routing
- **React Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Form handling
- **Socket.io Client 4.8.1** - Real-time communication
- **Recharts 3.2.1** - Data visualization
- **React Beautiful DnD 13.1.1** - Drag and drop
- **Supabase 2.75.0** - Backend-as-a-Service (optional)

### **Backend Technologies Used:**
- **Node.js ≥20.0.0** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - Primary database
- **Mongoose 8.0.3** - MongoDB ODM
- **Socket.io 4.7.4** - Real-time communication
- **JWT 9.0.2** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **Winston 3.11.0** - Logging
- **Helmet 7.1.0** - Security
- **CORS 2.8.5** - Cross-origin requests
- **Joi 17.11.0** - Validation
- **Node-cron 3.0.3** - Scheduled tasks

---

## 🎯 **KEY FEATURES IMPLEMENTED**

### **✅ Core Features:**
1. **User Authentication & Authorization**
2. **KPI Management System**
3. **Task Management with Kanban Boards**
4. **Performance Scoring & Analytics**
5. **Real-time Notifications**
6. **Financial Management**
7. **Audit Logging**
8. **Responsive Design**

### **🔧 Development Features:**
1. **TypeScript for Type Safety**
2. **Component-based Architecture**
3. **API Service Layer**
4. **Real-time Communication**
5. **Form Validation**
6. **Error Handling**
7. **Logging System**
8. **Security Middleware**

This organization provides a clear, maintainable structure for the Brahmaputra Board e-Office Productivity Management System with modern development practices and scalable architecture.
