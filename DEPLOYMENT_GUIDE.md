# 🚀 Free Deployment Guide - Task Distribution System

This guide will help you deploy your MERN stack Task Distribution System for free using Render.com.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render.com Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - For free cloud database

## 🗄️ Step 1: Set up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with password
5. Get your connection string
6. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)

**Connection string format:**
```
mongodb+srv://username:password@cluster.mongodb.net/task_distribution?retryWrites=true&w=majority
```

## 🌐 Step 2: Deploy Backend to Render.com

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Connect your GitHub account
   - Select your repository

3. **Configure Backend Service**
   - **Name**: `task-distribution-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**
   Add these environment variables in Render:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-backend-name.onrender.com`

## 🎨 Step 3: Deploy Frontend to Render.com

1. **Create Another Web Service**
   - Click "New +" → "Web Service"
   - Connect the same GitHub repository

2. **Configure Frontend Service**
   - **Name**: `task-distribution-frontend`
   - **Environment**: `Static Site`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

3. **Environment Variables**
   Add these environment variables:
   ```
   BACKEND_URL=https://your-backend-name.onrender.com
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your frontend URL: `https://your-frontend-name.onrender.com`

## 🔧 Step 4: Initialize Admin User

After backend deployment, you need to create the admin user:

1. **Option A: Using Render Shell**
   - Go to your backend service in Render
   - Click "Shell" tab
   - Run: `node createAdmin.js`

2. **Option B: Using the API**
   - The admin user should be created automatically on first deployment
   - Default credentials: `admin@example.com` / `admin123`

## 🧪 Step 5: Test Your Deployment

1. **Test Health Endpoint**
   ```
   GET https://your-backend-name.onrender.com/health
   ```

2. **Test Frontend**
   - Visit your frontend URL
   - Login with admin credentials
   - Test all features

## 🔒 Step 6: Security Considerations

1. **Change Default Passwords**
   - Update admin password after first login
   - Use strong JWT_SECRET

2. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Render's environment variable system

3. **CORS Configuration**
   - Backend is already configured for CORS
   - Update if needed for your domain

## 📊 Monitoring & Maintenance

1. **Render Dashboard**
   - Monitor service health
   - View logs for debugging
   - Check resource usage

2. **MongoDB Atlas**
   - Monitor database performance
   - Set up alerts for storage usage

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render
   - Ensure all dependencies are in package.json

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings

3. **CORS Errors**
   - Verify frontend URL is allowed in backend CORS config
   - Check environment variables

4. **File Upload Issues**
   - Render free tier has limitations
   - Consider using cloud storage (AWS S3, Cloudinary)

## 🎯 Success!

Your Task Distribution System is now deployed for free on:
- **Backend**: `https://your-backend-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`
- **Health Check**: `https://your-backend-name.onrender.com/health`

## 📈 Scaling (When Needed)

When you outgrow the free tier:
1. **Render Paid Plans** - More resources, custom domains
2. **Vercel** - Great for Next.js frontend
3. **Railway** - Alternative to Render
4. **AWS/GCP/Azure** - Enterprise solutions

---

**Note**: Free tiers have limitations:
- Render: 750 hours/month, sleep after inactivity
- MongoDB Atlas: 512MB storage, shared resources
- Consider upgrading when you have active users
