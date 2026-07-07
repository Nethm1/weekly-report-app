const Report = require('../models/Report');
const User = require('../models/User');

// @desc    AI Chat - query team reports using rule-based responses
// @route   POST /api/ai/chat
// @access  Private (manager)
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const msg = message.toLowerCase();
    let reply = '';

    // Fetch recent data for context
    const recentReports = await Report.find({ status: 'submitted' })
      .populate('user', 'name department')
      .populate('project', 'name')
      .sort({ submittedAt: -1 })
      .limit(50);

    const members = await User.find({ role: 'member', isActive: true }).select('name department');

    // Rule-based AI responses
    if (msg.includes('blocker') || msg.includes('challenge') || msg.includes('blocked')) {
      const reportWithBlockers = recentReports.filter(r =>
        r.blockers && !['none', 'n/a', '', 'no'].includes(r.blockers.toLowerCase())
      );
      if (reportWithBlockers.length === 0) {
        reply = '✅ Great news! No open blockers found in recent reports. The team seems to be working smoothly.';
      } else {
        const list = reportWithBlockers.slice(0, 5).map(r =>
          `• **${r.user?.name}** (${r.project?.name || 'Unknown'}): ${r.blockers}`
        ).join('\n');
        reply = `⚠️ Found **${reportWithBlockers.length}** report(s) with blockers:\n\n${list}`;
      }
    } else if (msg.includes('last week') || msg.includes('this week') || msg.includes('worked on') || msg.includes('completed')) {
      const now = new Date();
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      const weekReports = recentReports.filter(r => new Date(r.submittedAt) >= weekAgo);

      if (weekReports.length === 0) {
        reply = '📭 No reports submitted in the last week.';
      } else {
        const summary = weekReports.slice(0, 5).map(r =>
          `• **${r.user?.name}** [${r.project?.name || 'Unknown'}]: ${r.tasksCompleted?.substring(0, 100)}...`
        ).join('\n');
        reply = `📋 **${weekReports.length}** reports submitted recently:\n\n${summary}`;
      }
    } else if (msg.includes('team') && (msg.includes('summary') || msg.includes('overview'))) {
      const totalMembers = members.length;
      const submitted = recentReports.length;
      const blockers = recentReports.filter(r =>
        r.blockers && !['none', 'n/a', ''].includes(r.blockers.toLowerCase())
      ).length;

      reply = `📊 **Team Summary**\n\n👥 Total members: ${totalMembers}\n📝 Total reports submitted: ${submitted}\n⚠️ Reports with blockers: ${blockers}\n\n${blockers > 0 ? '⚡ Action needed: Review open blockers!' : '✅ No critical blockers found.'}`;
    } else if (msg.includes('pending') || msg.includes('missing') || msg.includes('not submitted')) {
      const now = new Date();
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);

      const submittedUserIds = recentReports
        .filter(r => new Date(r.submittedAt) >= weekStart)
        .map(r => r.user?._id?.toString());

      const missing = members.filter(m => !submittedUserIds.includes(m._id.toString()));

      if (missing.length === 0) {
        reply = '✅ All team members have submitted their reports this week!';
      } else {
        const list = missing.map(m => `• ${m.name}`).join('\n');
        reply = `⏳ **${missing.length}** member(s) haven't submitted this week:\n\n${list}`;
      }
    } else if (msg.includes('who') && msg.includes('most')) {
      const userCounts = {};
      recentReports.forEach(r => {
        const name = r.user?.name || 'Unknown';
        userCounts[name] = (userCounts[name] || 0) + 1;
      });
      const sorted = Object.entries(userCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      if (sorted.length === 0) {
        reply = 'No report data available yet.';
      } else {
        const list = sorted.map(([name, count]) => `• **${name}**: ${count} reports`).join('\n');
        reply = `🏆 **Most active team members:**\n\n${list}`;
      }
    } else if (msg.includes('project') || msg.includes('category')) {
      const projectCounts = {};
      recentReports.forEach(r => {
        const name = r.project?.name || 'Unknown';
        projectCounts[name] = (projectCounts[name] || 0) + 1;
      });
      const sorted = Object.entries(projectCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) {
        reply = 'No project data available yet.';
      } else {
        const list = sorted.map(([name, count]) => `• **${name}**: ${count} reports`).join('\n');
        reply = `📁 **Reports by project:**\n\n${list}`;
      }
    } else if (msg.includes('help') || msg.includes('what can') || msg.includes('?')) {
      reply = `🤖 **I can help you with:**\n\n• "Show blockers" — View open blockers\n• "What did the team work on last week?" — Recent activity\n• "Team summary" — Overview stats\n• "Who hasn't submitted?" — Pending members\n• "Who submitted the most?" — Top contributors\n• "Report by project" — Project breakdown`;
    } else {
      reply = `🤖 I can answer questions about your team's reports. Try:\n\n• "Show me current blockers"\n• "Team summary"\n• "Who hasn't submitted this week?"\n• "What did the team work on last week?"`;
    }

    res.json({ success: true, reply, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
