const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock users database
const mockUsers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@brahmaputra.gov.in',
    password: 'password123',
    role: 'employee',
    department: 'IT Department',
    avatar: '',
    twoFactorEnabled: false
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@brahmaputra.gov.in',
    password: 'password123',
    role: 'division_head',
    department: 'Administration',
    avatar: '',
    twoFactorEnabled: false
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@brahmaputra.gov.in',
    password: 'admin123',
    role: 'administrator',
    department: 'Administration',
    avatar: '',
    twoFactorEnabled: false
  }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  // Find user
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Generate mock token
  const token = `mock-token-${user.id}-${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled
      }
    }
  });
});

// Get current user endpoint
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  // Extract user ID from mock token
  const userId = token.split('-')[2];
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        twoFactorEnabled: user.twoFactorEnabled
      }
    }
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`Environment: development`);
  console.log(`Frontend URL: http://localhost:8080`);
});
