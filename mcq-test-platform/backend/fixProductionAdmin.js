const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Use the production MongoDB URI
const PROD_MONGODB_URI = 'mongodb+srv://techfolksweb_db_user:admin@cluster0.ovxq1ah.mongodb.net/mcq_test_platform?retryWrites=true&w=majority&appName=Cluster0';

async function fixProductionAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(PROD_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Production MongoDB');

    // Check existing admin
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Found admin with email: admin@gmail.com');
      console.log('Admin details:', {
        id: existingAdmin._id,
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role
      });

      // Update the email to match what we documented
      existingAdmin.email = 'admin@mcqplatform.com';
      existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
      await existingAdmin.save();
      console.log('✅ Updated admin email to: admin@mcqplatform.com');
      console.log('✅ Reset password to: admin123');
    } else {
      // Create new admin if not found
      console.log('No admin found, creating new one...');
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@mcqplatform.com',
        password: 'admin123',
        role: 'admin',
        isApproved: true
      });
      await adminUser.save();
      console.log('✅ Created new admin user');
    }

    console.log('\n========================================');
    console.log('✅ ADMIN CREDENTIALS FIXED!');
    console.log('Email: admin@mcqplatform.com');
    console.log('Password: admin123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixProductionAdmin();