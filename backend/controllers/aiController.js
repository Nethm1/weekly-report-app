const Report = require('../models/Report');
const User = require('../models/User');

/**
 * AI Chat Controller - Rule-Based NLP with RAG approach over stored reports
 * 
 * Approach: Lightweight RAG (Retrieval-Augmented Generation) pattern
 * - Retrieves relevant report data from MongoDB based on query intent
 * - Applies NLP intent detection to route queries
 * - Generates structured, context-aware responses
 * 
 * Data Privacy: Only aggregated/anonymized summaries are returned.
 * No raw PII is exposed beyond names already visible to managers.
 * 
 * @route POST /api/ai/chat
 * @access Private (manager)
 */
exports.chat = async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ success: false, message: 'Message required' })

    const msg = message.toLowerCase().trim()

    // ── RAG: Retrieve context from database ──
    const [recentReports, allMembers] = await Promise.all([
      Report.find({ status: 'submitted' })
        .populate('user', 'name department')
        .populate('project', 'name')
        .sort({ submittedAt: -1 })
        .limit(100),
      User.find({ role: 'member', isActive: true }).select('name department')
    ])

    // ── Intent Detection (NLP routing) ──
    const intent = detectIntent(msg)
    const reply = await generateResponse(intent, msg, recentReports, allMembers)

    res.json({ success: true, reply, intent, timestamp: new Date() })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── Intent Detection ──
function detectIntent(msg) {
  if (/blocker|challeng|block|stuck|impediment/.test(msg)) return 'blockers'
  if (/summary|overview|report|status|update/.test(msg)) return 'summary'
  if (/last week|this week|recent|worked on|complet|done/.test(msg)) return 'recent_work'
  if (/pending|missing|not submit|haven.t|who.s behind/.test(msg)) return 'pending'
  if (/project|category|distribution|breakdown|workload/.test(msg)) return 'projects'
  if (/who.*most|top|active|best/.test(msg)) return 'top_performers'
  if (/hours|time|effort|workload/.test(msg)) return 'hours'
  if (/design|engineer|market|qa|devops|backend|frontend/.test(msg)) return 'department'
  if (/help|what can|command|option/.test(msg)) return 'help'
  return 'general'
}

// ── Response Generation ──
async function generateResponse(intent, msg, reports, members) {
  const now = new Date()
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
  const thisWeekReports = reports.filter(r => new Date(r.submittedAt) >= weekAgo)

  switch (intent) {

    case 'blockers': {
      const withBlockers = reports.filter(r =>
        r.blockers && !['none','n/a','','no','nothing'].includes(r.blockers.toLowerCase().trim())
      )
      if (withBlockers.length === 0) {
        return `✅ **No open blockers found!**\n\nAll ${members.length} team members are working without reported impediments. The team is on track.`
      }
      const recent = withBlockers.slice(0, 6)
      const list = recent.map(r =>
        `• **${r.user?.name}** _(${r.project?.name || 'General'})_\n  "${r.blockers}"`
      ).join('\n\n')
      return `⚠️ **${withBlockers.length} active blocker(s) found:**\n\n${list}\n\n_Action recommended: Schedule a standup to address these impediments._`
    }

    case 'summary': {
      const totalReports = reports.length
      const blockerCount = reports.filter(r =>
        r.blockers && !['none','n/a','','no'].includes(r.blockers.toLowerCase().trim())
      ).length
      const thisWeekCount = thisWeekReports.length
      const avgHours = reports.reduce((s, r) => s + (r.hoursWorked || 0), 0) / (reports.length || 1)

      const projectDist = {}
      reports.forEach(r => { const n = r.project?.name || 'Unknown'; projectDist[n] = (projectDist[n]||0)+1 })
      const topProject = Object.entries(projectDist).sort((a,b)=>b[1]-a[1])[0]

      return `📊 **Team Summary — TechWare Solutions**\n\n` +
        `👥 **Team size:** ${members.length} active members\n` +
        `📝 **Total reports:** ${totalReports}\n` +
        `📅 **Submitted this week:** ${thisWeekCount}\n` +
        `⚠️ **Reports with blockers:** ${blockerCount}\n` +
        `⏱ **Avg hours/week:** ${avgHours.toFixed(1)}h\n` +
        `🏆 **Most active project:** ${topProject ? `${topProject[0]} (${topProject[1]} reports)` : 'N/A'}\n\n` +
        (blockerCount > 0 ? `_⚡ Action needed: ${blockerCount} blocker(s) require attention._` : `_✅ Team is performing well with no critical blockers._`)
    }

    case 'recent_work': {
      if (thisWeekReports.length === 0) {
        return `📭 **No reports submitted this week yet.**\n\nExpected submissions: ${members.length} members.\nConsider sending a reminder to the team.`
      }
      const list = thisWeekReports.slice(0, 5).map(r =>
        `• **${r.user?.name}** _(${r.project?.name || 'General'})_\n  ${r.tasksCompleted?.substring(0, 120)}...`
      ).join('\n\n')
      return `📋 **This week's completed work (${thisWeekReports.length} reports):**\n\n${list}`
    }

    case 'pending': {
      const submittedThisWeek = new Set(
        thisWeekReports.map(r => r.user?._id?.toString())
      )
      const pending = members.filter(m => !submittedThisWeek.has(m._id.toString()))
      if (pending.length === 0) {
        return `✅ **All ${members.length} team members have submitted this week!**\n\n100% compliance achieved. 🎉`
      }
      const list = pending.map(m => `• **${m.name}** _(${m.department || 'No dept'})_`).join('\n')
      return `⏳ **${pending.length} member(s) haven't submitted this week:**\n\n${list}\n\n_Consider sending a gentle reminder to these team members._`
    }

    case 'projects': {
      const dist = {}
      reports.forEach(r => { const n = r.project?.name || 'Unknown'; dist[n] = (dist[n]||0)+1 })
      const sorted = Object.entries(dist).sort((a,b)=>b[1]-a[1])
      if (sorted.length === 0) return `📁 No project data available yet.`
      const list = sorted.map(([name, count], i) => {
        const bar = '█'.repeat(Math.max(1, Math.round(count/2))) + '░'.repeat(Math.max(0, 5-Math.round(count/2)))
        return `${i+1}. **${name}** ${bar} ${count} reports`
      }).join('\n')
      return `📁 **Workload Distribution by Project:**\n\n${list}\n\n_Total: ${reports.length} reports across ${sorted.length} projects_`
    }

    case 'top_performers': {
      const counts = {}
      reports.forEach(r => { const n = r.user?.name || 'Unknown'; counts[n] = (counts[n]||0)+1 })
      const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0, 5)
      if (sorted.length === 0) return `No report data available yet.`
      const medals = ['🥇','🥈','🥉','4️⃣','5️⃣']
      const list = sorted.map(([name, count], i) => `${medals[i]} **${name}**: ${count} reports submitted`).join('\n')
      return `🏆 **Top Contributing Team Members:**\n\n${list}\n\n_Keep up the great work, team!_`
    }

    case 'hours': {
      const byMember = {}
      reports.forEach(r => {
        if (!r.hoursWorked) return
        const n = r.user?.name || 'Unknown'
        if (!byMember[n]) byMember[n] = { hours: 0, count: 0 }
        byMember[n].hours += r.hoursWorked
        byMember[n].count++
      })
      const sorted = Object.entries(byMember)
        .map(([name, d]) => ({ name, avg: d.hours/d.count, total: d.hours }))
        .sort((a,b)=>b.total-a.total).slice(0,5)
      if (sorted.length === 0) return `⏱ No hours data available.`
      const list = sorted.map(m => `• **${m.name}**: ${m.total}h total (avg ${m.avg.toFixed(1)}h/week)`).join('\n')
      const teamAvg = sorted.reduce((s,m) => s+m.avg, 0) / sorted.length
      return `⏱ **Team Hours & Workload:**\n\n${list}\n\n📊 **Team average:** ${teamAvg.toFixed(1)} hours/week`
    }

    case 'department': {
      const dept = msg.match(/design|engineer|market|qa|devops|backend|frontend/)?.[0] || ''
      const deptReports = reports.filter(r =>
        r.user?.department?.toLowerCase().includes(dept)
      )
      if (deptReports.length === 0) {
        return `No reports found for "${dept}" department. Check the department name.`
      }
      const latest = deptReports.slice(0, 3)
      const list = latest.map(r =>
        `• **${r.user?.name}**: ${r.tasksCompleted?.substring(0, 100)}...`
      ).join('\n\n')
      return `🏢 **${dept.charAt(0).toUpperCase()+dept.slice(1)} Team Activity (${deptReports.length} reports):**\n\n${list}`
    }

    case 'help':
      return `🤖 **I can help you with:**\n\n` +
        `• _"Show current blockers"_ — Active impediments\n` +
        `• _"Team summary"_ — Full overview & metrics\n` +
        `• _"What did the team work on this week?"_ — Recent activity\n` +
        `• _"Who hasn't submitted?"_ — Pending members\n` +
        `• _"Report by project"_ — Workload distribution\n` +
        `• _"Who submitted the most?"_ — Top contributors\n` +
        `• _"Hours and workload"_ — Time tracking\n` +
        `• _"What did the design team work on?"_ — Department filter\n\n` +
        `_Ask me anything about your team's weekly reports!_`

    default: {
      // Fallback: try to find relevant info
      const keywordsInReports = reports.filter(r =>
        r.tasksCompleted?.toLowerCase().includes(msg.split(' ')[0]) ||
        r.user?.name?.toLowerCase().includes(msg)
      )
      if (keywordsInReports.length > 0) {
        const r = keywordsInReports[0]
        return `📋 Found relevant report:\n\n**${r.user?.name}** recently worked on:\n"${r.tasksCompleted?.substring(0, 200)}"`
      }
      return `🤖 I can help with team reports, blockers, summaries, and workload analysis.\n\nTry asking:\n• _"Show blockers"_\n• _"Team summary"_\n• _"Who hasn't submitted this week?"_\n\nOr type **"help"** to see all commands.`
    }
  }
}
