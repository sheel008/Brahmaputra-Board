# Brahmaputra Board e-Office - Complete Deployment Guide

## Overview

This guide will help you deploy the complete Brahmaputra Board e-Office Productivity Management Module with both frontend and backend components.

## Prerequisites

- Node.js v20+ installed
- MongoDB installed and running
- Git installed
- Basic knowledge of command line operations

## Quick Start

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env file with your configuration
# Key variables to set:
# - MONGODB_URI (default: mongodb://localhost:27017/brahmaputra-board)
# - JWT_SECRET (generate a secure secret)
# - PORT (default: 5000)

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install frontend dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the frontend development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Demo Credentials

After seeding the database, you can use these credentials:

- **Administrator**: admin@brahmaputra.gov.in / admin123
- **Division Head**: priya.sharma@brahmaputra.gov.in / password123
- **Employee**: rajesh.kumar@brahmaputra.gov.in / password123
- **Field Unit**: amit.patel@brahmaputra.gov.in / password123

## Production Deployment

### Using Docker

1. **Create Dockerfile for Backend**

```dockerfile
# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml**

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: brahmaputra-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./server
    container_name: brahmaputra-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:password@mongodb:27017/brahmaputra-board?authSource=admin
      JWT_SECRET: your-production-jwt-secret
      FRONTEND_URL: https://your-frontend-domain.com
    depends_on:
      - mongodb

  frontend:
    build: .
    container_name: brahmaputra-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:5000/api

volumes:
  mongodb_data:
```

3. **Deploy with Docker Compose**

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using PM2 (Process Manager)

1. **Install PM2 globally**

```bash
npm install -g pm2
```

2. **Create ecosystem file**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'brahmaputra-backend',
      script: './server/index.js',
      cwd: './server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        MONGODB_URI: 'mongodb://localhost:27017/brahmaputra-board',
        JWT_SECRET: 'your-production-jwt-secret'
      }
    }
  ]
};
```

3. **Start with PM2**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Using Vercel (Frontend) + Railway/Heroku (Backend)

1. **Deploy Backend to Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd server
railway deploy
```

2. **Deploy Frontend to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
vercel --prod

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-backend-url.railway.app/api
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brahmaputra-board
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
BCRYPT_ROUNDS=12
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SEED_DATABASE=false
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Brahmaputra Board e-Office
VITE_APP_VERSION=1.0.0
```

## Database Management

### Backup Database

```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/brahmaputra-board" --out=./backup

# Restore backup
mongorestore --uri="mongodb://localhost:27017/brahmaputra-board" ./backup/brahmaputra-board
```

### Reset Database

```bash
cd server
npm run seed
```

## Monitoring & Maintenance

### Health Checks

- Backend Health: `GET /api/health`
- Database Connection: Check MongoDB status
- Frontend: Check if React app loads

### Logs

```bash
# Backend logs
cd server
npm run dev  # Development
pm2 logs brahmaputra-backend  # Production with PM2
docker-compose logs backend  # Production with Docker

# Frontend logs
npm run dev  # Development
vercel logs  # Production with Vercel
```

### Performance Monitoring

- Monitor API response times
- Check database query performance
- Monitor memory usage
- Set up alerts for downtime

## Security Considerations

1. **Change default passwords**
2. **Use strong JWT secrets**
3. **Enable HTTPS in production**
4. **Set up proper CORS policies**
5. **Implement rate limiting**
6. **Regular security updates**
7. **Database access controls**

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Authentication Errors**
   - Verify JWT secret
   - Check token expiration
   - Ensure proper headers

3. **CORS Issues**
   - Update FRONTEND_URL in backend
   - Check CORS configuration

4. **Socket.io Connection Issues**
   - Verify WebSocket support
   - Check firewall settings
   - Ensure proper URL configuration

### Debug Mode

```bash
# Backend debug
DEBUG=* npm run dev

# Frontend debug
VITE_DEBUG=true npm run dev
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer for multiple backend instances
- Implement Redis for session storage
- Use MongoDB replica sets
- Consider microservices architecture

### Performance Optimization

- Enable MongoDB indexes
- Implement caching strategies
- Use CDN for static assets
- Optimize database queries

## Support & Maintenance

### Regular Tasks

- Monitor system performance
- Update dependencies
- Backup database
- Review security logs
- Update documentation

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix security issues
npm audit fix
```

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Brahmaputra Board e-Office system. Follow the steps carefully and adapt them to your specific infrastructure requirements.

For additional support or questions, refer to the project documentation or contact the development team.
