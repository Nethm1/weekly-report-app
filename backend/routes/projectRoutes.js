const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

router.get('/', protect, getProjects);
router.post('/', protect, authorize('manager'), createProject);
router.put('/:id', protect, authorize('manager'), updateProject);
router.delete('/:id', protect, authorize('manager'), deleteProject);

module.exports = router;
