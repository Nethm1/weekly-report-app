import { useState, useEffect } from 'react'
import api from '../../utils/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate } from '../../utils/helpers'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Users, FileCheck, TrendingUp, AlertTriangle, Clock, RefreshCw } from 'lucide-react'

const PIE_COLORS = ['#7C3AED', '#c4b5fd', '#ef4444']
const LINE_COLORS = ['#7C3AED', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

function StatusBadge({ status }) {
  if (status === 'submitted') return <span className="badge-submitted">✓ Submitted</span>
  if (status === 'late') return <span className="badge-late">⚠ Late</span>
  if (status === 'draft') return <span className="badge-draft">✏ Draft</span>
  return <span className="badge-pending">⏳ Pending</span>
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [submissionStatus, setSubmissionStatus] = useState([])
  const [trends, setTrends] = useState([])
  const [perPersonTrends, setPerPersonTrends] = useState([])
  const [people, setPeople] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(true)
  const [trendView, setTrendView] = useState('team') // 'team' | 'person'

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
      setPerPersonTrends(tr.data.perPerson || [])
      setPeople(tr.data.people || [])
      setRecentActivity(rc.data.data)
      setWorkload(wl.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  )

  const submitted = submissionStatus.filter(s => s.status === 'submitted').length
  const pending = submissionStatus.filter(s => s.status === 'pending').length
  const late = submissionStatus.filter(s => s.status === 'late').length
  const pieData = [
    { name: 'Submitted', value: submitted },
    { name: 'Pending', value: pending },
    { name: 'Late', value: late },
  ].filter(d => d.value > 0)

  const statCards = [
    {
      title: 'Team Members', value: stats?.totalMembers ?? 0,
      icon: <Users size={19} className="text-violet-600" />,
      gradient: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    },
    {
      title: 'Submitted This Week', value: stats?.submittedThisWeek ?? 0,
      icon: <FileCheck size={19} className="text-emerald-600" />,
      gradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    },
    {
      title: 'Compliance Rate', value: `${stats?.complianceRate ?? 0}%`,
      subtitle: 'Submitted vs total members',
      icon: <TrendingUp size={19} className="text-blue-600" />,
      gradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    },
    {
      title: 'Open Blockers', value: stats?.openBlockers ?? 0,
      subtitle: 'Reports with blockers this week',
      icon: <AlertTriangle size={19} className="text-amber-600" />,
      gradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Team weekly report analytics & overview</p>
        </div>
        <button onClick={loadData} className="btn-secondary text-sm">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.title}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.gradient }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            {s.subtitle && <p className="text-xs text-gray-400 mt-1">{s.subtitle}</p>}
          </div>
        ))}
      </div>

      {/* ── VISUAL INSIGHT 1: Tasks Completed Trend ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Tasks Completed Trend</h2>
            <p className="text-xs text-gray-400 mt-0.5">Report submissions over time</p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button onClick={() => setTrendView('team')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                trendView === 'team' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              Team-wide
            </button>
            <button onClick={() => setTrendView('person')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                trendView === 'person' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              Per Person
            </button>
          </div>
        </div>

        {trendView === 'team' ? (
          trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.1)', fontSize: 12 }} />
                <Area type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2.5}
                  fill="url(#grad)" name="Reports Submitted" dot={{ r: 3, fill: '#7C3AED' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart icon={<TrendingUp />} text="No trend data yet" />
          )
        ) : (
          perPersonTrends.length > 0 && people.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={perPersonTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {people.map((p, i) => (
                  <Line key={p} type="monotone" dataKey={p} stroke={LINE_COLORS[i % LINE_COLORS.length]}
                    strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart icon={<TrendingUp />} text="No per-person data yet" />
          )
        )}
      </div>

      {/* ── VISUAL INSIGHT 2 & 3: Submission Status + Workload ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pie - This Week Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-1">Submission Status</h2>
          <p className="text-xs text-gray-400 mb-4">This week breakdown</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={75}
                  dataKey="value" paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="No status data yet" />
          )}
        </div>

        {/* Bar - Workload by Project */}
        <div className="bg-white rounded-2xl p-5 shadow-sm lg:col-span-2">
          <h2 className="font-bold text-gray-900 mb-1">Workload / Task Distribution by Project</h2>
          <p className="text-xs text-gray-400 mb-4">Reports submitted per project (last 8 weeks)</p>
          {workload.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f3ff" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: 12 }}
                  formatter={(v, n) => [v, 'Reports']} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} name="Reports">
                  {workload.map((e, i) => <Cell key={i} fill={e.color || '#7C3AED'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart text="No project data yet" />
          )}
        </div>
      </div>

      {/* ── VISUAL INSIGHT 4: Submission Status by Team Member ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-1">Report Submission Status by Team Member</h2>
        <p className="text-xs text-gray-400 mb-4">Current week submission tracking</p>
        {submissionStatus.length === 0 ? (
          <p className="text-center text-gray-300 py-8 text-sm">No team members found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {submissionStatus.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: '#F8F5FF' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                    {m.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.department || '—'}</p>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── VISUAL INSIGHT 5: Recent Activity Feed ── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-1">Recent Reports / Activity Feed</h2>
        <p className="text-xs text-gray-400 mb-4">Latest submitted reports across the team</p>
        {recentActivity.length === 0 ? (
          <p className="text-center text-gray-300 py-8 text-sm">No recent activity</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentActivity.map(r => (
              <div key={r._id} className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ backgroundColor: '#F8F5FF' }}>
                <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                  {r.user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {r.user?.name}
                    <span className="text-gray-400 font-normal"> submitted a report</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{r.tasksCompleted}</p>
                  {r.project && (
                    <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-violet-100 text-violet-700">
                      {r.project.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 mt-0.5">
                  <Clock size={10} />{formatDate(r.submittedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyChart({ icon, text }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-gray-200 gap-2">
      {icon && <span className="text-4xl opacity-30">{icon}</span>}
      <p className="text-sm">{text}</p>
    </div>
  )
}
