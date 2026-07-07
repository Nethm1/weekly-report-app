const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllUsers, updateUserRole, updateProfile } = require('../controllers/userController');

router.get('/', protect, authorize('manager'), getAllUsers);
router.patch('/:id/role', protect, authorize('manager'), updateUserRole);
router.put('/profile', protect, updateProfile);

module.exports = router;
