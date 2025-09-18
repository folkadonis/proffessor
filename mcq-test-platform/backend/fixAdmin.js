const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function fixAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Delete existing admin
    await User.deleteOne({ email: 'admin@mcqplatform.com' });
    console.log('Deleted old admin user');

    // Create new admin user (password will be hashed by the model)
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@mcqplatform.com',
      password: 'admin123',  // Will be hashed automatically
      role: 'admin',
      isApproved: true
    });

    await adminUser.save();
    console.log('✅ Admin user recreated successfully!');
    console.log('Email: admin@mcqplatform.com');
    console.log('Password: admin123');

    // Test the password
    const testUser = await User.findOne({ email: 'admin@mcqplatform.com' });
    const isValid = await testUser.comparePassword('admin123');
    console.log('Password test:', isValid ? '✅ Working' : '❌ Failed');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAdmin();