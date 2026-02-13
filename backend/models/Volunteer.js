const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  education: {
    degree: {
      type: String,
      required: [true, 'Please add degree']
    },
    institution: {
      type: String,
      required: [true, 'Please add institution']
    },
    year: {
      type: Number,
      required: [true, 'Please add graduation year']
    }
  },
  subjects: [{
    type: String,
    required: true
  }],
  languages: [{
    type: String,
    required: true
  }],
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
  availability: [{
    day: String,
    time: String
  }],
  experience: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  completedExams: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
