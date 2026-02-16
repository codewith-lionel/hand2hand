const express = require('express');
const router = express.Router();
const {
  createProfile,
  getProfile,
  updateProfile,
  getVolunteers,
  createRequest,
  getStudentRequests
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.route('/profile')
  .post(createProfile)
  .get(getProfile)
  .put(updateProfile);

router.get('/volunteers', getVolunteers);
router.route('/requests')
  .get(getStudentRequests)
  .post(createRequest);

module.exports = router;
