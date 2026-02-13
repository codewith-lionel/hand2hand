const Request = require('../models/Request');
const Student = require('../models/Student');

// @desc    Get user's requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ userId: req.user.id });
      if (!studentProfile) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }
      query.studentId = studentProfile._id;
    }

    const requests = await Request.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'volunteerId',
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

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email phone' }
      })
      .populate({
        path: 'volunteerId',
        populate: { path: 'userId', select: 'name email phone' }
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
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

// @desc    Cancel request
// @route   PUT /api/requests/:id/cancel
// @access  Private (Student)
exports.cancelRequest = async (req, res) => {
  try {
    const studentProfile = await Student.findOne({ userId: req.user.id });

    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.studentId.toString() !== studentProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }

    if (request.status === 'completed' || request.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this request'
      });
    }

    request.status = 'cancelled';
    await request.save();

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
