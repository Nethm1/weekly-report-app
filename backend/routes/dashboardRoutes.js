const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getSubmissionStatus,
  getTrends,
  getRecentActivity,
  getWorkloadByProject,
} = require('../controllers/dashboardController');

router.get('/stats', protect, authorize('manager'), getDashboardStats);
router.get('/submission-status', protect, authorize('manager'), getSubmissionStatus);
router.get('/trends', protect, authorize('manager'), getTrends);
router.get('/recent', protect, authorize('manager'), getRecentActivity);
router.get('/workload', protect, authorize('manager'), getWorkloadByProject);

module.exports = router;
