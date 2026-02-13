const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  disabilityType: {
    type: String,
    required: [true, 'Please specify disability type'],
    enum: ['visual', 'hearing', 'mobility', 'learning', 'other']
  },
  disabilityDetails: {
    type: String,
    required: [true, 'Please provide disability details']
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please add city']
    },
    state: {
      type: String,
      required: [true, 'Please add state']
    },
    pincode: {
      type: String,
      required: [true, 'Please add pincode']
    }
  },
  educationLevel: {
    type: String,
    required: [true, 'Please add education level'],
    enum: ['high_school', 'undergraduate', 'postgraduate', 'doctorate', 'other']
  },
  institution: {
    type: String,
    required: [true, 'Please add institution name']
  },
  rollNumber: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
