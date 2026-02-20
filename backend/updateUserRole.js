const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Update user role
const updateRole = async (email, newRole) => {
  try {
    if (!email || !newRole) {
      console.log('❌ Usage: node updateUserRole.js <email> <role>');
      console.log('   Valid roles: student, volunteer, admin');
      process.exit(1);
    }

    if (!['student', 'volunteer', 'admin'].includes(newRole)) {
      console.log('❌ Invalid role. Must be: student, volunteer, or admin');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    const oldRole = user.role;
    user.role = newRole;
    await user.save();

    console.log('\n✅ User role updated successfully!');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Old Role: ${oldRole}`);
    console.log(`New Role: ${newRole}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get arguments from command line
const email = process.argv[2];
const role = process.argv[3];
updateRole(email, role);
