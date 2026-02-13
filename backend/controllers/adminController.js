const User = require('../models/User');
const Student = require('../models/Student');
const Volunteer = require('../models/Volunteer');
const Request = require('../models/Request');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify volunteer
// @route   PUT /api/admin/volunteers/:id/verify
// @access  Private (Admin)
exports.verifyVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    volunteer.isVerified = true;
    await volunteer.save();

    // Update user verification status
    const user = await User.findById(volunteer.userId);
    if (user) {
      user.isVerified = true;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all requests
// @route   GET /api/admin/requests
// @access  Private (Admin)
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
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

// @desc    Get dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const verifiedVolunteers = await Volunteer.countDocuments({ isVerified: true });
    
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const acceptedRequests = await Request.countDocuments({ status: 'accepted' });
    const completedRequests = await Request.countDocuments({ status: 'completed' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
    const cancelledRequests = await Request.countDocuments({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          volunteers: totalVolunteers,
          verifiedVolunteers
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          rejected: rejectedRequests,
          cancelled: cancelledRequests
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete associated profile
    if (user.role === 'student') {
      await Student.findOneAndDelete({ userId: user._id });
    } else if (user.role === 'volunteer') {
      await Volunteer.findOneAndDelete({ userId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
