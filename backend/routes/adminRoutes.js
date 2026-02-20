const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllVolunteers,
  verifyVolunteer,
  getAllRequests,
  getStatistics,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/volunteers', getAllVolunteers);
router.put('/volunteers/:id/verify', verifyVolunteer);
router.get('/requests', getAllRequests);
router.get('/statistics', getStatistics);
router.delete('/users/:id', deleteUser);

module.exports = router;
