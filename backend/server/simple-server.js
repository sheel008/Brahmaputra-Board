const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:8081",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock data for demo
const mockUsers = [
  {
    id: '1',
    name: 'Administrator',
    email: 'admin@brahmaputra.gov.in',
    role: 'admin',
    department: 'Administration',
    avatar: null,
    twoFactorEnabled: false
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@brahmaputra.gov.in',
    role: 'division_head',
    department: 'Water Resources',
    avatar: null,
    twoFactorEnabled: false
  },
  {
    id: '3',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@brahmaputra.gov.in',
    role: 'employee',
    department: 'Water Resources',
    avatar: null,
    twoFactorEnabled: false
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    mongodb: 'Mock Mode'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', email);
  
  // Simple mock authentication
  const user = mockUsers.find(u => u.email === email);
  
  if (user && (password === 'admin123' || password === 'password123')) {
    const token = 'mock-jwt-token-' + Date.now();
    
    res.json({
      success: true,
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && token.startsWith('mock-jwt-token-')) {
    // Return first user as current user for demo
    res.json({
      success: true,
      user: mockUsers[0]
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Mock KPI data endpoint
app.get('/api/kpis', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Project Completion Rate',
        target: 85,
        current: 78,
        unit: '%',
        status: 'on_track'
      },
      {
        id: '2',
        name: 'Budget Utilization',
        target: 90,
        current: 95,
        unit: '%',
        status: 'exceeding'
      }
    ]
  });
});

// Mock tasks endpoint
app.get('/api/tasks', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Complete project documentation',
        status: 'in_progress',
        priority: 'high',
        assignee: 'Rajesh Kumar',
        dueDate: '2024-01-15'
      },
      {
        id: '2',
        title: 'Review budget allocation',
        status: 'pending',
        priority: 'medium',
        assignee: 'Priya Sharma',
        dueDate: '2024-01-20'
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📊 Mock data endpoints available`);
  console.log(`\nDemo credentials:`);
  console.log(`- admin@brahmaputra.gov.in / admin123`);
  console.log(`- priya.sharma@brahmaputra.gov.in / password123`);
  console.log(`- rajesh.kumar@brahmaputra.gov.in / password123`);
});
