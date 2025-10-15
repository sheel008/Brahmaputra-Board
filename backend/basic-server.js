const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Mock users
const users = [
  { id: '1', email: 'rajesh.kumar@brahmaputra.gov.in', password: 'password123', name: 'Rajesh Kumar', role: 'employee', department: 'IT Department' },
  { id: '2', email: 'priya.sharma@brahmaputra.gov.in', password: 'password123', name: 'Priya Sharma', role: 'division_head', department: 'Administration' },
  { id: '3', email: 'admin@brahmaputra.gov.in', password: 'admin123', name: 'Admin User', role: 'administrator', department: 'Administration' }
];

// Health check
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
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  const token = `token-${user.id}-${Date.now()}`;
  
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`👤 Demo credentials:`);
  console.log(`   Employee: rajesh.kumar@brahmaputra.gov.in / password123`);
  console.log(`   Division Head: priya.sharma@brahmaputra.gov.in / password123`);
  console.log(`   Administrator: admin@brahmaputra.gov.in / admin123`);
});


