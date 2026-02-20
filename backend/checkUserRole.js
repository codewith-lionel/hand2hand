const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Check user role by email
const checkRole = async (email) => {
  try {
    if (!email) {
      console.log('\n📋 Listing all users:\n');
      const users = await User.find({}, 'name email role isVerified');
      if (users.length === 0) {
        console.log('No users found in database.');
      } else {
        users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email})`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Verified: ${user.isVerified}`);
          console.log('');
        });
      }
    } else {
      const user = await User.findOne({ email }, 'name email role phone isVerified');
      if (!user) {
        console.log(`❌ User not found with email: ${email}`);
      } else {
        console.log('\n✅ User found:');
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Phone: ${user.phone}`);
        console.log(`Verified: ${user.isVerified}`);
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];
checkRole(email);
