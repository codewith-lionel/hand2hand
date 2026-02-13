const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');
const Student = require('../models/Student');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create volunteer profile
// @route   POST /api/volunteers/profile
// @access  Private (Volunteer)
exports.createProfile = async (req, res) => {
  try {
    const existingProfile = await Volunteer.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists'
      });
    }

    const profile = await Volunteer.create({
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

// @desc    Get volunteer profile
// @route   GET /api/volunteers/profile
// @access  Private (Volunteer)
exports.getProfile = async (req, res) => {
  try {
    const profile = await Volunteer.findOne({ userId: req.user.id }).populate('userId', 'name email phone');

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

// @desc    Update volunteer profile
// @route   PUT /api/volunteers/profile
// @access  Private (Volunteer)
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Volunteer.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile = await Volunteer.findOneAndUpdate(
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

// @desc    Get pending requests for volunteer
// @route   GET /api/volunteers/requests
// @access  Private (Volunteer)
exports.getRequests = async (req, res) => {
  try {
    const volunteerProfile = await Volunteer.findOne({ userId: req.user.id });

    if (!volunteerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please create a volunteer profile first'
      });
    }

    const requests = await Request.find({
      $or: [
        { volunteerId: volunteerProfile._id },
        { volunteerId: null, status: 'pending' }
      ]
    })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ createdAt: -1 });

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

// @desc    Respond to request (accept/reject)
// @route   PUT /api/volunteers/requests/:id/respond
// @access  Private (Volunteer)
exports.respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const volunteerProfile = await Volunteer.findOne({ userId: req.user.id });

    if (!volunteerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer profile not found'
      });
    }

    const request = await Request.findById(req.params.id).populate({
      path: 'studentId',
      populate: { path: 'userId' }
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been responded to'
      });
    }

    request.status = status;
    request.volunteerId = status === 'accepted' ? volunteerProfile._id : null;
    await request.save();

    if (status === 'accepted') {
      volunteerProfile.completedExams += 1;
      await volunteerProfile.save();
    }

    // Send email notification to student
    try {
      await sendEmail({
        email: request.studentId.userId.email,
        subject: `Request ${status} - Hand2Hand`,
        html: `
          <h2>Request ${status}</h2>
          <p>Your exam request for ${request.examDetails.subject} has been ${status}.</p>
          <p><strong>Exam Date:</strong> ${new Date(request.examDetails.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${request.examDetails.time}</p>
          ${status === 'accepted' ? `<p><strong>Volunteer:</strong> ${req.user.name}</p>` : ''}
        `
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.status(200).json({
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

// @desc    Get assigned exams
// @route   GET /api/volunteers/assigned-exams
// @access  Private (Volunteer)
exports.getAssignedExams = async (req, res) => {
  try {
    const volunteerProfile = await Volunteer.findOne({ userId: req.user.id });

    if (!volunteerProfile) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer profile not found'
      });
    }

    const assignedExams = await Request.find({
      volunteerId: volunteerProfile._id,
      status: { $in: ['accepted', 'completed'] }
    })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .sort({ 'examDetails.date': 1 });

    res.status(200).json({
      success: true,
      count: assignedExams.length,
      data: assignedExams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
