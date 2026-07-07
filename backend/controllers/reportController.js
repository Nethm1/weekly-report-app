const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { project, weekStart, weekEnd, tasksCompleted, tasksPlanned, blockers, hoursWorked, notes } = req.body;
    if (!project || !weekStart || !weekEnd || !tasksCompleted || !tasksPlanned) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }
    const report = await Report.create({ ...req.body, user: req.user._id });
    await report.populate('project', 'name color');
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const { status, projectId, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (projectId) filter.project = projectId;
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('project', 'name color')
      .sort({ weekStart: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('project', 'name color')
      .populate('user', 'name email');
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    if (req.user.role === 'member' && report.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('project', 'name color');
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    report = await Report.findByIdAndUpdate(req.params.id,
      { status: 'submitted', submittedAt: new Date() }, { new: true })
      .populate('project', 'name color');
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await report.deleteOne();
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { userId, projectId, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (userId) filter.user = userId;
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.weekStart = {};
      if (startDate) filter.weekStart.$gte = new Date(startDate);
      if (endDate) filter.weekStart.$lte = new Date(endDate);
    }
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('user', 'name email department')
      .populate('project', 'name color')
      .sort({ weekStart: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
