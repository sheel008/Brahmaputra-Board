#!/usr/bin/env node

/**
 * Deployment Setup Script for Brahmaputra Board
 * This script helps prepare the project for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Brahmaputra Board Deployment Setup');
console.log('=====================================\n');

// Check if required files exist
const requiredFiles = [
  'frontend/package.json',
  'backend/server/package.json',
  'frontend/vite.config.ts',
  'backend/server/index.js'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n📁 Checking deployment files...');
const deploymentFiles = [
  'frontend/vercel.json',
  'backend/server/render.yaml',
  'frontend/env.example',
  'backend/server/env.production',
  'DEPLOYMENT_GUIDE.md',
  'DEPLOYMENT_CHECKLIST.md'
];

deploymentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n🔧 Environment Variables Checklist:');
console.log('Backend (Render) - Required:');
console.log('  - NODE_ENV=production');
console.log('  - PORT=10000');
console.log('  - FRONTEND_URL=https://your-frontend-app.vercel.app');
console.log('  - MONGODB_URI=mongodb+srv://...');
console.log('  - JWT_SECRET=your-secure-secret-key');
console.log('  - JWT_EXPIRE=7d');
console.log('  - SEED_DATABASE=false');

console.log('\nFrontend (Vercel) - Required:');
console.log('  - VITE_API_URL=https://your-backend-app.onrender.com/api');
console.log('  - VITE_NODE_ENV=production');

console.log('\n📝 Next Steps:');
console.log('1. Set up MongoDB Atlas database');
console.log('2. Deploy backend to Render');
console.log('3. Deploy frontend to Vercel');
console.log('4. Update CORS configuration with actual URLs');
console.log('5. Test the deployed application');

console.log('\n📚 Documentation:');
console.log('- Read DEPLOYMENT_GUIDE.md for detailed instructions');
console.log('- Use DEPLOYMENT_CHECKLIST.md to track progress');

console.log('\n🎯 Quick Test Commands:');
console.log('Backend health check: curl https://your-backend.onrender.com/api/health');
console.log('Frontend: Visit https://your-app.vercel.app');

console.log('\n✨ Setup complete! Happy deploying! 🚀');
