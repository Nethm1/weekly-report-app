import { useState, useEffect } from 'react'
import api from '../../utils/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { Users, FileCheck, TrendingUp, AlertTriangle, Clock, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [submissionStatus, setSubmissionStatus] = useState([])
  const [trends, setTrends] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/submission-status'),
      api.get('/dashboard/trends'),
      api.get('/dashboard/recent'),
      api.get('/dashboard/workload'),
    ]).then(([s, st, tr, rc, wl]) => {
      setStats(s.data.data)
      setSubmissionStatus(st.data.data)
      setTrends(tr.data.data)
      setRecentActivity(rc.data.data)
      setWorkload(wl.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>

  const submitted = submissionStatus.filter(s => s.status === 'submitted').length
  const pending = submissionStatus.filter(s => s.status === 'pending').length
  const late = submissionStatus.filter(s => s.status === 'late').length
  const pieData = [
    { name: 'Submitted', value: submitted },
    { name: 'Pending', value: pending },
    { name: 'Late', value: late },
  ].filter(d => d.value > 0)
  const PIE_COLORS = ['#7C3AED', '#e5e7eb', '#ef4444']

  const statCards = [
    { title: 'Team Members', value: stats?.totalMembers ?? 0, icon: <Users size={20} />, bg: 'bg-violet-50', text: 'text-violet-600' },
    { title: 'Submitted This Week', value: stats?.submittedThisWeek ?? 0, icon: <FileCheck size={20} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { title: 'Compliance Rate', value: `${stats?.complianceRate ?? 0}%`, icon: <TrendingUp size={20} />, bg: 'bg-cyan-50', text: 'text-cyan-600' },
    { title: 'Open Blockers', value: stats?.openBlockers ?? 0, icon: <AlertTriangle size={20} />, bg: 'bg-amber-50', text: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Team weekly report analytics & overview</p>
        </div>
        <button onClick={loadData} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{s.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.text}`}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Submission Trend</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Last 8 weeks</span>
          </div>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2.5} fill="url(#colorCount)" name="Reports Submitted" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-300">
              <div className="text-center"><TrendingUp size={40} className="mx-auto mb-2" /><p className="text-sm">No data yet</p></div>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">This Week Status</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload by Project Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Workload by Project</h2>
            <span className="text-xs text-gray-400">Reports submitted</span>
          </div>
          {workload.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="count" fill="#7C3AED" radius={[0, 6, 6, 0]} name="Reports">
                  {workload.map((entry, i) => <Cell key={i} fill={entry.color || '#7C3AED'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">No project data yet</div>
          )}
        </div>

        {/* Team Submission Status */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Team Submission Status</h2>
          {submissionStatus.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">No team members found</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {submissionStatus.map(member => (
                <div key={member.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {member.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.department || '—'}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-sm">No recent activity</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentActivity.map(r => (
              <div key={r._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {r.user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{r.user?.name}
                    <span className="text-gray-400 font-normal"> submitted a report</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{r.tasksCompleted}</p>
                  {r.project && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700">
                      {r.project.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock size={11} />{formatDate(r.submittedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'submitted') return <span className="badge-submitted">✓ Submitted</span>
  if (status === 'late') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">⚠ Late</span>
  if (status === 'draft') return <span className="badge-draft">✏ Draft</span>
  return <span className="badge-pending">⏳ Pending</span>
}
