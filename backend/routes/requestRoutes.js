const express = require('express');
const router = express.Router();
const {
  getRequests,
  getRequest,
  cancelRequest
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRequests);
router.get('/:id', getRequest);
router.put('/:id/cancel', cancelRequest);

module.exports = router;
