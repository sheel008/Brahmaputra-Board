const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.use(express.json());

// Handle preflight requests
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Mock users
const users = [
  { id: '1', email: 'rajesh.kumar@brahmaputra.gov.in', password: 'password123', name: 'Rajesh Kumar', role: 'employee', department: 'IT Department' },
  { id: '2', email: 'priya.sharma@brahmaputra.gov.in', password: 'password123', name: 'Priya Sharma', role: 'division_head', department: 'Administration' },
  { id: '3', email: 'admin@brahmaputra.gov.in', password: 'admin123', name: 'Admin User', role: 'administrator', department: 'Administration' }
];

// Health check
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  const token = `token-${user.id}-${Date.now()}`;
  
  console.log('Login successful for:', user.email);
  
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
        avatar: '',
        twoFactorEnabled: false
      }
    }
  });
});

// Get current user
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  const userId = token.split('-')[1];
  const user = users.find(u => u.id === userId);
  
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
        avatar: '',
        twoFactorEnabled: false
      }
    }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Simple server running on http://localhost:${PORT}`);
  console.log(`🌐 CORS enabled for frontend`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/auth/me`);
  console.log(`   POST /api/auth/logout`);
  console.log(`\n👤 Demo credentials:`);
  console.log(`   Employee: rajesh.kumar@brahmaputra.gov.in / password123`);
  console.log(`   Division Head: priya.sharma@brahmaputra.gov.in / password123`);
  console.log(`   Administrator: admin@brahmaputra.gov.in / admin123`);
});
