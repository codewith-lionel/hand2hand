const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getRequests,
  respondToRequest,
  getAssignedExams
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('volunteer'));

router.route('/profile')
  .post(createProfile)
  .get(getProfile)
  .put(updateProfile);

router.get('/requests', getRequests);
router.put('/requests/:id/respond', respondToRequest);
router.get('/assigned-exams', getAssignedExams);

module.exports = router;
