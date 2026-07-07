const Report = require('../models/Report');
const User = require('../models/User');

// Helper functions
function getThisMonday() {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getThisSunday(monday) {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return sunday;
}

// @desc    Get dashboard summary stats
// @route   GET /api/dashboard/stats
// @access  Private (manager)
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const weekStart = getThisMonday();
    const weekEnd = getThisSunday(weekStart);

    const totalMembers = await User.countDocuments({ role: 'member', isActive: true });

    const submittedThisWeek = await Report.countDocuments({
      status: 'submitted',
      $or: [
        { weekStart: { $gte: weekStart, $lte: weekEnd } },
        { submittedAt: { $gte: weekStart, $lte: weekEnd } },
      ],
    });

    const complianceRate = totalMembers > 0
      ? Math.min(Math.round((submittedThisWeek / totalMembers) * 100), 100)
      : 0;

    const reportsWithBlockers = await Report.countDocuments({
      status: 'submitted',
      blockers: { $nin: ['None', 'none', 'N/A', 'n/a', '', 'No', 'no'] },
      weekStart: { $gte: weekStart, $lte: weekEnd },
    });

    const totalReports = await Report.countDocuments({ status: 'submitted' });

    res.json({
      success: true,
      data: {
        totalMembers,
        submittedThisWeek,
        complianceRate,
        openBlockers: reportsWithBlockers,
        totalReports,
        weekRange: { weekStart, weekEnd },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get submission status per team member
// @route   GET /api/dashboard/submission-status
// @access  Private (manager)
exports.getSubmissionStatus = async (req, res) => {
  try {
    const { weekStart, weekEnd } = req.query;
    const start = weekStart ? new Date(weekStart) : getThisMonday();
    const end = weekEnd ? new Date(weekEnd) : getThisSunday(start);
    const now = new Date();

    const members = await User.find({ role: 'member', isActive: true }).select('name email department');
    const reports = await Report.find({
      weekStart: { $gte: start, $lte: end },
    }).select('user status submittedAt');

    const reportMap = {};
    reports.forEach(r => { reportMap[r.user.toString()] = r; });

    const result = members.map(m => {
      const report = reportMap[m._id.toString()];
      let status = 'pending';

      if (report) {
        if (report.status === 'submitted') {
          status = report.submittedAt && new Date(report.submittedAt) > end
            ? 'late' : 'submitted';
        } else {
          status = now > end ? 'late' : 'draft';
        }
      } else {
        status = now > end ? 'late' : 'pending';
      }

      return { id: m._id, name: m.name, email: m.email, department: m.department, status };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trends (last 8 weeks)
// @route   GET /api/dashboard/trends
// @access  Private (manager)
exports.getTrends = async (req, res) => {
  try {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const reports = await Report.find({
      status: 'submitted',
      weekStart: { $gte: eightWeeksAgo },
    }).select('weekStart hoursWorked');

    const weeklyData = {};
    reports.forEach(r => {
      const week = r.weekStart.toISOString().split('T')[0];
      if (!weeklyData[week]) weeklyData[week] = { week, count: 0, hours: 0 };
      weeklyData[week].count += 1;
      weeklyData[week].hours += r.hoursWorked || 0;
    });

    const trends = Object.values(weeklyData).sort((a, b) => new Date(a.week) - new Date(b.week));
    res.json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent activity feed
// @route   GET /api/dashboard/recent
// @access  Private (manager)
exports.getRecentActivity = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'submitted' })
      .populate('user', 'name email')
      .populate('project', 'name color')
      .sort({ submittedAt: -1 })
      .limit(10)
      .select('user project weekStart submittedAt tasksCompleted');

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get workload distribution by project
// @route   GET /api/dashboard/workload
// @access  Private (manager)
exports.getWorkloadByProject = async (req, res) => {
  try {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const data = await Report.aggregate([
      { $match: { status: 'submitted', weekStart: { $gte: eightWeeksAgo } } },
      { $group: { _id: '$project', count: { $sum: 1 }, totalHours: { $sum: { $ifNull: ['$hoursWorked', 0] } } } },
      { $lookup: { from: 'projects', localField: '_id', foreignField: '_id', as: 'project' } },
      { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$project.name', 'Unknown'] },
          color: { $ifNull: ['$project.color', '#7C3AED'] },
          count: 1,
          totalHours: 1,
        }
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
