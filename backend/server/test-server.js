require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Test MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brahmaputra-board';

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  
  // Simple health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      message: 'Backend is running!',
      timestamp: new Date().toISOString(),
      mongodb: 'Connected'
    });
  });

  // Test login endpoint
  app.post('/api/auth/login', (req, res) => {
    res.json({
      success: true,
      message: 'Login endpoint is working!',
      token: 'test-token-123',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      }
    });
  });

  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Test login: POST http://localhost:${PORT}/api/auth/login`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});
