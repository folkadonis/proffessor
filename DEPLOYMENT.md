# MCQ Test Platform - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Deploy with Render (Recommended - FREE)

#### Backend Deployment on Render:
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select `folkadonis/proffessor`
4. Configure:
   - **Name**: `mcq-backend`
   - **Root Directory**: `mcq-test-platform/backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a random string
   - `FRONTEND_URL`: Your frontend URL (will add after deploying frontend)
   - `NODE_ENV`: production

#### Frontend Deployment on Vercel:
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Import Project"
3. Import from GitHub: `folkadonis/proffessor`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `mcq-test-platform/frontend`
5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., https://mcq-backend.onrender.com/api)
6. Deploy!

### Option 2: Deploy with Railway (Easy, $5/month)

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select `folkadonis/proffessor`
5. Railway will auto-detect and deploy both frontend and backend
6. Add environment variables in Railway dashboard

### Option 3: Deploy with Heroku (Professional, $7/month)

#### Prepare for Heroku:
```bash
cd mcq-test-platform/backend
echo "web: node server.js" > Procfile
```

#### Deploy Backend:
```bash
heroku create mcq-backend-app
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set FRONTEND_URL="your-frontend-url"
git push heroku main
```

#### Deploy Frontend to Netlify:
1. Build the frontend:
   ```bash
   cd mcq-test-platform/frontend
   npm run build
   ```
2. Drag and drop `build` folder to [netlify.com](https://netlify.com)

## 🗄️ Database Setup (MongoDB Atlas - FREE)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user:
   - Username: `mcqadmin`
   - Password: Generate secure password
4. Network Access → Add IP: `0.0.0.0/0` (allows all IPs)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://mcqadmin:yourpassword@cluster0.xxxxx.mongodb.net/mcq-platform`

## 📝 Environment Variables Setup

### Backend (.env):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mcq-platform
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### Frontend (.env):
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## 🔧 Local Testing Before Deployment

1. **Test Backend:**
   ```bash
   cd mcq-test-platform/backend
   npm install
   npm start
   ```

2. **Test Frontend:**
   ```bash
   cd mcq-test-platform/frontend
   npm install
   npm start
   ```

## 📱 Post-Deployment Setup

1. **Create Admin User:**
   - Register first user at your-app-url/register
   - First user automatically becomes admin
   - Admin can approve other users

2. **Test the deployment:**
   - Register a new user
   - Login as admin
   - Create questions and test modules
   - Take a test as student

## 🆓 Completely FREE Hosting Stack

- **Frontend**: Vercel (free tier)
- **Backend**: Render.com (free tier - may sleep after 15 min inactivity)
- **Database**: MongoDB Atlas (512MB free)
- **Total Cost**: $0/month

## 💰 Production Stack ($5-10/month)

- **Frontend**: Vercel (free)
- **Backend**: Railway.app ($5/month)
- **Database**: MongoDB Atlas (free or $9/month for better performance)
- **Total Cost**: $5-14/month

## 🚨 Important Security Notes

1. Never commit `.env` files to GitHub
2. Use strong JWT_SECRET (minimum 32 characters)
3. Enable MongoDB IP whitelist in production
4. Use HTTPS for all production URLs
5. Regularly update dependencies

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in your hosting platform
3. Verify environment variables are set correctly
4. Ensure MongoDB connection string is correct

## 🎉 Your App URLs After Deployment

- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com/api`
- MongoDB: MongoDB Atlas Dashboard

---
Ready to deploy! Choose Option 1 (Render + Vercel) for completely free hosting.