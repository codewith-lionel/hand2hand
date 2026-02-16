const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Student = require('./models/Student');
const Volunteer = require('./models/Volunteer');
const connectDB = require('./config/db');

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing test users
    await User.deleteMany({ email: { $in: ['admin@test.com', 'student@test.com', 'volunteer@test.com'] } });
    console.log('Cleared existing test users');

    // Create Admin User
    const adminUser = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
      isVerified: true
    });
    console.log('✓ Admin user created');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');

    // Create Student User
    const studentUser = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'student123',
      role: 'student',
      phone: '9876543210',
      isVerified: true
    });

    // Create Student Profile
    await Student.create({
      userId: studentUser._id,
      disabilityType: 'visual',
      disabilityDetails: 'Partial vision loss',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      educationLevel: 'undergraduate',
      institution: 'Mumbai University',
      rollNumber: 'TEST123'
    });
    console.log('✓ Student user created');
    console.log('  Email: student@test.com');
    console.log('  Password: student123');

    // Create Volunteer User
    const volunteerUser = await User.create({
      name: 'Test Volunteer',
      email: 'volunteer@test.com',
      password: 'volunteer123',
      role: 'volunteer',
      phone: '9988776655',
      isVerified: true
    });

    // Create Volunteer Profile
    await Volunteer.create({
      userId: volunteerUser._id,
      education: {
        degree: 'Bachelor of Science',
        institution: 'Delhi University',
        year: 2023
      },
      subjects: ['Mathematics', 'Physics', 'Computer Science'],
      languages: ['English', 'Hindi'],
      location: {
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      availability: [
        { day: 'Monday', time: '10:00 AM - 2:00 PM' },
        { day: 'Wednesday', time: '10:00 AM - 2:00 PM' }
      ],
      experience: 'Experienced in teaching and assisted students with disabilities',
      isVerified: true
    });
    console.log('✓ Volunteer user created');
    console.log('  Email: volunteer@test.com');
    console.log('  Password: volunteer123');

    console.log('\n=================================');
    console.log('Test users created successfully!');
    console.log('=================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
