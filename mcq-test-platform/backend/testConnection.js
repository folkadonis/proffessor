const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🔍 Testing MongoDB Atlas Connection...\n');

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<username>')) {
  console.error('❌ ERROR: MongoDB URI not configured properly!');
  console.log('\n📝 Please update your .env file:');
  console.log('1. Get your connection string from MongoDB Atlas');
  console.log('2. Replace <username> and <password> with your actual credentials');
  console.log('3. Update MONGODB_URI in backend/.env file\n');
  process.exit(1);
}

// Test connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('📦 Database: mcq_test_platform');
  console.log('🎉 Your database is ready for the MCQ platform!\n');

  // Close connection
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed!\n');
  console.error('Error:', err.message);

  if (err.message.includes('authentication failed')) {
    console.log('\n🔐 Authentication Issue:');
    console.log('- Check your username and password');
    console.log('- Make sure user exists in MongoDB Atlas');
  } else if (err.message.includes('ENOTFOUND')) {
    console.log('\n🌐 Network Issue:');
    console.log('- Check your internet connection');
    console.log('- Verify cluster name in connection string');
  } else if (err.message.includes('whitelist')) {
    console.log('\n🛡️ IP Whitelist Issue:');
    console.log('- Add your IP in MongoDB Atlas Network Access');
    console.log('- Or allow access from anywhere (0.0.0.0/0)');
  }

  process.exit(1);
});