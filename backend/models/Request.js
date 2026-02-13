const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    default: null
  },
  examDetails: {
    subject: {
      type: String,
      required: [true, 'Please add exam subject']
    },
    date: {
      type: Date,
      required: [true, 'Please add exam date']
    },
    time: {
      type: String,
      required: [true, 'Please add exam time']
    },
    duration: {
      type: String,
      required: [true, 'Please add exam duration']
    },
    type: {
      type: String,
      required: [true, 'Please add exam type'],
      enum: ['written', 'practical', 'oral', 'online', 'other']
    },
    venue: {
      type: String,
      required: [true, 'Please add exam venue']
    }
  },
  requiredQualification: {
    type: String
  },
  specialRequirements: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', requestSchema);
