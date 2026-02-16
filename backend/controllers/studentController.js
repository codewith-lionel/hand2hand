const Student = require('../models/Student');
const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');

// @desc    Create student profile
// @route   POST /api/students/profile
// @access  Private (Student)
exports.createProfile = async (req, res) => {
  try {
    const existingProfile = await Student.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists'
      });
    }

    const profile = await Student.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getProfile = async (req, res) => {
  try {
    const profile = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Student.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile = await Student.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get volunteers with filters
// @route   GET /api/students/volunteers
// @access  Private (Student)
exports.getVolunteers = async (req, res) => {
  try {
    const { city, state, subject } = req.query;
    let query = { isVerified: true };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }
    if (subject) {
      query['subjects'] = new RegExp(subject, 'i');
    }

    const volunteers = await Volunteer.find(query)
      .populate('userId', 'name email phone')
      .select('-documents');

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create exam request
// @route   POST /api/students/requests
// @access  Private (Student)
exports.createRequest = async (req, res) => {
  try {
    console.log('Creating request for user:', req.user.id);
    console.log('Request body:', req.body);
    const studentProfile = await Student.findOne({ userId: req.user.id });

    if (!studentProfile) {
      console.log('Student profile not found for user:', req.user.id);
      return res.status(400).json({
        success: false,
        message: 'Please create a student profile first'
      });
    }

    console.log('Student profile found:', studentProfile._id);
    const request = await Request.create({
      studentId: studentProfile._id,
      ...req.body
    });

    console.log('Request created successfully:', request._id);
    res.status(201).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get student's own requests
// @route   GET /api/students/requests
// @access  Private (Student)
exports.getStudentRequests = async (req, res) => {
  try {
    console.log('Fetching requests for user:', req.user.id);
    const studentProfile = await Student.findOne({ userId: req.user.id });

    if (!studentProfile) {
      console.log('Student profile not found for user:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Student profile not found. Please create a profile first.'
      });
    }

    console.log('Student profile found:', studentProfile._id);
    const requests = await Request.find({ studentId: studentProfile._id })
      .populate({
        path: 'volunteerId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

    console.log('Found', requests.length, 'requests for student:', studentProfile._id);
    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
