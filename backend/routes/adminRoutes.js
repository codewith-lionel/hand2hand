const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  verifyVolunteer,
  getAllRequests,
  getStatistics,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/volunteers/:id/verify', verifyVolunteer);
router.get('/requests', getAllRequests);
router.get('/statistics', getStatistics);
router.delete('/users/:id', deleteUser);

module.exports = router;
