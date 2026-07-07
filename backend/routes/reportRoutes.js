const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createReport,
  getMyReports,
  getReport,
  updateReport,
  submitReport,
  deleteReport,
  getAllReports,
} = require('../controllers/reportController');

// Manager - get all reports
router.get('/', protect, authorize('manager'), getAllReports);

// Member routes
router.post('/', protect, authorize('member'), createReport);
router.get('/my', protect, getMyReports);
router.get('/:id', protect, getReport);
router.put('/:id', protect, authorize('member'), updateReport);
router.patch('/:id/submit', protect, authorize('member'), submitReport);
router.delete('/:id', protect, authorize('member'), deleteReport);

module.exports = router;
