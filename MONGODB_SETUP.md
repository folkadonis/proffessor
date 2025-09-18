# MongoDB Atlas Setup Guide

## 🔗 Getting Your Connection String

### Step 1: In MongoDB Atlas Dashboard
1. Click **"Connect"** button on your Cluster0
2. Choose **"Drivers"**
3. Select:
   - Driver: **Node.js**
   - Version: **4.1 or later**

### Step 2: Copy Your Connection String
It will look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 3: Set Up Database Access
1. Go to **Security → Database Access**
2. Click **"Add New Database User"**
3. Create user:
   - Username: `mcqadmin` (or your choice)
   - Password: Click "Autogenerate Secure Password"
   - **SAVE THIS PASSWORD!**
4. Database User Privileges: Select **"Atlas Admin"**

### Step 4: Set Up Network Access
1. Go to **Security → Network Access**
2. Click **"Add IP Address"**
3. For development: Click **"Add Current IP Address"**
4. For production: Click **"Allow Access from Anywhere"** and enter `0.0.0.0/0`

## 📝 Update Your .env File

Replace the placeholders in `/mcq-test-platform/backend/.env`:

```env
# Replace with your actual connection string
MONGODB_URI=mongodb+srv://mcqadmin:YourActualPassword@cluster0.abcdef.mongodb.net/mcq_test_platform?retryWrites=true&w=majority

PORT=5000
JWT_SECRET=generate_a_long_random_string_here_32_chars_minimum
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## ✅ Test Your Connection

1. **Install dependencies:**
```bash
cd mcq-test-platform/backend
npm install
```

2. **Start the server:**
```bash
npm start
```

3. **Check console output:**
You should see:
```
Server running on port 5000
MongoDB connected
```

## 🚨 Common Issues & Solutions

### "Authentication Failed"
- Double-check username and password
- Ensure no special characters in password or URL-encode them
- Password with @ symbol? Replace with %40

### "Network Error"
- Add your IP address in Network Access
- For cloud deployment, use 0.0.0.0/0

### "Cannot connect to cluster"
- Check if cluster is active (not paused)
- Verify connection string format
- Ensure database name is included in URI

## 🎯 Quick Connection String Examples

**Development (Local IP):**
```
mongodb+srv://mcqadmin:MyPass123@cluster0.abc123.mongodb.net/mcq_test_platform?retryWrites=true&w=majority
```

**Production (Any IP):**
```
mongodb+srv://mcqadmin:MyPass123@cluster0.abc123.mongodb.net/mcq_production?retryWrites=true&w=majority
```

## 📱 Next Steps After Connection

1. **Test locally:**
```bash
cd mcq-test-platform/backend
npm start
```

2. **Create admin user:**
- Start backend: `npm start`
- Start frontend: `cd ../frontend && npm start`
- Register first user at http://localhost:3000/register
- First user becomes admin automatically

3. **Deploy to cloud:**
- Follow DEPLOYMENT.md guide
- Use same MongoDB URI in cloud environment variables

---
Need help? Check MongoDB Atlas logs: Cluster0 → Metrics → Logs