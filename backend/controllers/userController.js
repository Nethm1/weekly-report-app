const User = require('../models/User');

// @desc    Get all users (manager only)
// @route   GET /api/users
// @access  Private (manager)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password').sort({ name: 1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (manager only)
// @route   PATCH /api/users/:id/role
// @access  Private (manager)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['member', 'manager'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (department !== undefined) updateData.department = department;

    // If password provided, let mongoose pre-save hook hash it
    if (password) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      user.name = name || user.name;
      user.department = department !== undefined ? department : user.department;
      user.password = password;
      await user.save();
      return res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }

    const user = await require('../models/User').findByIdAndUpdate(
      req.user._id, updateData, { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
