const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { chat } = require('../controllers/aiController');

router.post('/chat', protect, authorize('manager'), chat);

module.exports = router;
