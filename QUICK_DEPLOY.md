# 🚀 Quick Deploy - Task Distribution System

## Free Deployment in 3 Steps

### 1. Setup Free Accounts
- [Render.com](https://render.com) - Free hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Free database

### 2. Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `task-distribution-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

### 3. Deploy Frontend
1. Create another Web Service
2. Configure:
   - **Name**: `task-distribution-frontend`
   - **Environment**: `Static Site`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

3. Add Environment Variables:
   ```
   BACKEND_URL=https://your-backend-name.onrender.com
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com/api
   ```

## 🧪 Test Your Deployment

### Health Endpoint
```
GET https://your-backend-name.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Task Distribution System Backend is running",
  "timestamp": "2025-08-30T16:03:37.068Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### Frontend Access
- URL: `https://your-frontend-name.onrender.com`
- Login: `admin@example.com` / `admin123`

## 📖 Complete Guide
See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
