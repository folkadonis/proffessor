# 🚀 ONE-CLICK DEPLOYMENT GUIDE

Your code is ready! I've prepared everything for deployment. Follow these simple steps:

## Option 1: AUTOMATIC DEPLOYMENT (Recommended - 5 minutes)

### Step 1: Deploy Backend to Render
1. **Click this link**: [Deploy to Render](https://dashboard.render.com/new)
2. **Sign up/Login** to Render
3. **Click "New +" → "Web Service"**
4. **Connect GitHub** and select `folkadonis/proffessor`
5. **Render will auto-detect** the `render.yaml` file
6. **Click "Create Web Service"**
7. **Wait 5-10 minutes** for deployment
8. **Copy your backend URL** (e.g., `https://mcq-backend-xxx.onrender.com`)

### Step 2: Deploy Frontend to Vercel
1. **Click this button to deploy**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/folkadonis/proffessor&project-name=mcq-platform&root-directory=mcq-test-platform/frontend&env=REACT_APP_API_URL&envDescription=Enter%20your%20Render%20backend%20URL&envLink=https://github.com/folkadonis/proffessor)

2. **Sign up/Login** to Vercel
3. **Set environment variable**:
   - `REACT_APP_API_URL`: Paste your Render backend URL + `/api`
   - Example: `https://mcq-backend-xxx.onrender.com/api`
4. **Click "Deploy"**
5. **Wait 2-3 minutes**

### Step 3: Update Backend CORS
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save (service will auto-redeploy)

## Option 2: COMMAND LINE DEPLOYMENT

### Deploy Frontend:
```bash
cd mcq-test-platform/frontend
vercel login  # Login with GitHub/Email
vercel --prod
```

### Deploy Backend:
Go to [Render.com](https://render.com) and follow the UI steps above.

## 🎉 YOUR LIVE URLS

After deployment:
- **Frontend**: `https://mcq-platform-[username].vercel.app`
- **Backend**: `https://mcq-backend-[id].onrender.com`
- **Admin Login**: admin@mcqplatform.com / admin123

## 📱 TEST YOUR LIVE APP

1. Open your Vercel URL
2. Login with admin credentials
3. Create questions and tests
4. Register a student account
5. Take tests!

## 🆓 COST: $0/month

Everything is FREE:
- ✅ Render.com (Free tier)
- ✅ Vercel (Free tier)
- ✅ MongoDB Atlas (Already configured)

## ⚠️ NOTES

- **Render Free Tier**: Backend sleeps after 15 mins inactivity (first request takes ~30s to wake)
- **Solution**: Upgrade to Render paid ($7/month) for always-on service

## 🐛 TROUBLESHOOTING

**Backend not connecting?**
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Verify environment variables in Render

**Frontend showing errors?**
- Check REACT_APP_API_URL in Vercel environment variables
- Must end with `/api`

**Login not working?**
- Ensure backend is running (check Render logs)
- Verify CORS settings match your frontend URL

---

Ready to deploy! Start with the Deploy button above 👆