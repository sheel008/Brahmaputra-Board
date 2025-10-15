# Deployment Guide - Brahmaputra Board

This guide will help you deploy your Brahmaputra Board application to Vercel (frontend) and Render (backend).

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **MongoDB Atlas Account**: For database hosting
3. **Vercel Account**: For frontend deployment
4. **Render Account**: For backend deployment

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user with read/write permissions
4. Get your connection string (it will look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/brahmaputra-board?retryWrites=true&w=majority
   ```
5. Whitelist your IP addresses (for production, add 0.0.0.0/0 to allow all IPs)

## Step 2: Backend Deployment (Render)

### 2.1 Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `brahmaputra-board-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend/server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brahmaputra-board?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
SEED_DATABASE=false
ENABLE_METRICS=true
ENABLE_SWAGGER=true
```

**Important**: Replace the following values:
- `your-frontend-app.vercel.app` with your actual Vercel URL
- `mongodb+srv://username:password@cluster.mongodb.net/...` with your actual MongoDB connection string
- `your-super-secret-jwt-key-change-this-in-production-min-32-chars` with a secure random string (minimum 32 characters)

### 2.3 Deploy Backend

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://brahmaputra-board-backend.onrender.com`)

## Step 3: Frontend Deployment (Vercel)

### 3.1 Create a New Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Environment Variables

Add these environment variables in Vercel:

```
VITE_API_URL=https://your-backend-app.onrender.com/api
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

**Important**: Replace `your-backend-app.onrender.com` with your actual Render backend URL.

### 3.3 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update Configuration

### 4.1 Update Backend CORS

After getting your Vercel URL, update the backend:

1. Go to Render dashboard → Your backend service → Environment
2. Update `FRONTEND_URL` with your actual Vercel URL
3. Redeploy the backend service

### 4.2 Update Frontend API URL

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Update `VITE_API_URL` with your actual Render backend URL
3. Redeploy the frontend

## Step 5: Testing

### 5.1 Test Backend

Visit your backend health check endpoint:
```
https://your-backend-app.onrender.com/api/health
```

You should see a response like:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Try logging in with test credentials:
   - **Admin**: `admin@brahmaputra.gov.in` / `admin123`
   - **Division Head**: `priya.sharma@brahmaputra.gov.in` / `password123`
   - **Employee**: `rajesh.kumar@brahmaputra.gov.in` / `password123`

## Step 6: Custom Domain (Optional)

### 6.1 Frontend Custom Domain

1. In Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6.2 Backend Custom Domain

1. In Render dashboard → Your service → Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your actual frontend URL
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **Build Failures**: Check that all dependencies are in `package.json`
4. **Environment Variables**: Ensure all required variables are set in both services

### Logs

- **Backend Logs**: Render dashboard → Your service → Logs
- **Frontend Logs**: Vercel dashboard → Your project → Functions → Logs

### Performance Optimization

1. **Backend**: Consider upgrading to a paid plan for better performance
2. **Frontend**: Enable Vercel's edge functions for better global performance
3. **Database**: Monitor MongoDB Atlas performance and consider scaling

## Security Considerations

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
2. **MongoDB**: Use strong passwords and enable authentication
3. **CORS**: Only allow necessary origins
4. **Rate Limiting**: Adjust based on your usage patterns
5. **HTTPS**: Both Vercel and Render provide HTTPS by default

## Monitoring

1. **Backend**: Use Render's built-in monitoring
2. **Database**: Monitor MongoDB Atlas metrics
3. **Frontend**: Use Vercel Analytics (if enabled)

## Backup Strategy

1. **Code**: Your GitHub repository serves as code backup
2. **Database**: MongoDB Atlas provides automatic backups
3. **Environment Variables**: Keep a secure record of all environment variables

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/

---

**Note**: Replace all placeholder URLs and credentials with your actual values before deployment.
