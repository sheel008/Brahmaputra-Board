# Deployment Checklist - Brahmaputra Board

## Pre-Deployment Checklist

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Connection string obtained
- [ ] IP addresses whitelisted (0.0.0.0/0 for production)

### Code Preparation
- [ ] All code committed to GitHub repository
- [ ] No sensitive data in code (passwords, API keys, etc.)
- [ ] Environment files created with production values
- [ ] CORS configuration updated for production URLs

### Backend (Render) Setup
- [ ] Render account created
- [ ] New web service created
- [ ] Root directory set to `backend/server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
  - [ ] `FRONTEND_URL=https://your-frontend-app.vercel.app`
  - [ ] `MONGODB_URI=mongodb+srv://...` (your actual connection string)
  - [ ] `JWT_SECRET=your-secure-secret-key` (minimum 32 characters)
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `BCRYPT_ROUNDS=12`
  - [ ] `SEED_DATABASE=false`

### Frontend (Vercel) Setup
- [ ] Vercel account created
- [ ] New project created from GitHub repository
- [ ] Framework preset: `Vite`
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL=https://your-backend-app.onrender.com/api`
  - [ ] `VITE_NODE_ENV=production`
  - [ ] `VITE_ENABLE_ANALYTICS=true`
  - [ ] `VITE_ENABLE_NOTIFICATIONS=true`

## Deployment Steps

### Backend Deployment
- [ ] Deploy backend service on Render
- [ ] Wait for successful deployment
- [ ] Note backend URL (e.g., `https://brahmaputra-board-backend.onrender.com`)
- [ ] Test health check endpoint: `https://your-backend.onrender.com/api/health`

### Frontend Deployment
- [ ] Deploy frontend on Vercel
- [ ] Wait for successful deployment
- [ ] Note frontend URL (e.g., `https://your-app.vercel.app`)

### Configuration Updates
- [ ] Update backend `FRONTEND_URL` with actual Vercel URL
- [ ] Update frontend `VITE_API_URL` with actual Render URL
- [ ] Redeploy both services with updated URLs

## Post-Deployment Testing

### Backend Testing
- [ ] Health check endpoint responds correctly
- [ ] API endpoints are accessible
- [ ] Database connection working
- [ ] CORS headers properly set

### Frontend Testing
- [ ] Frontend loads without errors
- [ ] Login functionality works
- [ ] API calls to backend successful
- [ ] All pages and features accessible

### Integration Testing
- [ ] User can log in successfully
- [ ] Dashboard loads with data
- [ ] KPI management works
- [ ] Task management works
- [ ] Real-time features (notifications) work
- [ ] File uploads work (if applicable)

## Security Verification
- [ ] HTTPS enabled on both frontend and backend
- [ ] JWT secret is secure and not exposed
- [ ] Database credentials are secure
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code

## Performance Verification
- [ ] Frontend loads quickly
- [ ] Backend responds within acceptable time
- [ ] Database queries are optimized
- [ ] Static assets are cached properly

## Monitoring Setup
- [ ] Backend logs are accessible in Render
- [ ] Frontend logs are accessible in Vercel
- [ ] Database monitoring enabled in MongoDB Atlas
- [ ] Error tracking configured (optional)

## Documentation
- [ ] Deployment guide updated with actual URLs
- [ ] Environment variables documented
- [ ] Team members have access to deployment platforms
- [ ] Backup and recovery procedures documented

## Final Verification
- [ ] All tests pass
- [ ] Application is fully functional
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Monitoring is working
- [ ] Documentation is complete

---

## Quick Reference URLs

### After Deployment, Update These Files:
1. `backend/server/index.js` - Update CORS allowedOrigins array
2. `frontend/src/services/api.ts` - Verify API_BASE_URL is correct

### Test Credentials:
- **Admin**: `admin@brahmaputra.gov.in` / `admin123`
- **Division Head**: `priya.sharma@brahmaputra.gov.in` / `password123`
- **Employee**: `rajesh.kumar@brahmaputra.gov.in` / `password123`

### Important Endpoints:
- **Health Check**: `https://your-backend.onrender.com/api/health`
- **API Base**: `https://your-backend.onrender.com/api`
- **Frontend**: `https://your-app.vercel.app`
