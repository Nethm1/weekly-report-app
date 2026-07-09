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

function StatusBadge({ status }) {
  if (status === 'submitted') return <span className="badge-submitted">✓ Submitted</span>
  if (status === 'late') return <span className="badge-late">⚠ Late</span>
  if (status === 'draft') return <span className="badge-draft">✏ Draft</span>
  return <span className="badge-pending">⏳ Pending</span>
}

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs shadow-2xl"
      style={{ background: 'rgba(8,5,30,0.96)', border: '1px solid rgba(139,92,246,0.35)', color: '#e2d9ff' }}>
      <p className="font-bold text-white/80 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong className="text-white">{p.value}</strong></p>
      ))}
    </div>
  )
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
  const [trendView, setTrendView] = useState('team')
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    setRefreshing(true)
    try {
      const [s, st, tr, rc, wl] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/submission-status'),
        api.get('/dashboard/trends'),
        api.get('/dashboard/recent'),
        api.get('/dashboard/workload'),
      ])
      setStats(s.data.data)
      setSubmissionStatus(st.data.data)
      setTrends(tr.data.data)
      setPerPersonTrends(tr.data.perPerson || [])
      setPeople(tr.data.people || [])
      setRecentActivity(rc.data.data)
      setWorkload(wl.data.data)
    } catch {}
    setRefreshing(false)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>

  const submitted = submissionStatus.filter(s => s.status === 'submitted').length
  const pending   = submissionStatus.filter(s => s.status === 'pending').length
  const late      = submissionStatus.filter(s => s.status === 'late').length
  const pieData   = [
    { name: 'Submitted', value: submitted },
    { name: 'Pending',   value: pending },
    { name: 'Late',      value: late },
  ].filter(d => d.value > 0)
  const PIE_COLORS = ['#7c3aed', '#a78bfa', '#ef4444']

  const MEMBER_GRADIENTS = [
    ['#7c3aed','#5b21b6'], ['#0284c7','#0369a1'],
    ['#059669','#047857'], ['#d97706','#b45309'],
    ['#db2777','#be185d'], ['#6366f1','#4f46e5'],
  ]

  const statCards = [
    { title:'Team Members',       value:stats?.totalMembers??0,       sub:'Active members',       icon:<Users size={16} className="text-white"/>,         gradient:'linear-gradient(135deg,#7c3aed,#a78bfa)', shadow:'rgba(124,58,237,0.40)' },
    { title:'Submitted This Week', value:stats?.submittedThisWeek??0,  sub:'Reports this week',    icon:<FileCheck size={16} className="text-white"/>,     gradient:'linear-gradient(135deg,#059669,#34d399)', shadow:'rgba(5,150,105,0.40)' },
    { title:'Compliance Rate',     value:`${stats?.complianceRate??0}%`, sub:'Submission rate',    icon:<TrendingUp size={16} className="text-white"/>,    gradient:'linear-gradient(135deg,#0284c7,#38bdf8)', shadow:'rgba(2,132,199,0.40)' },
    { title:'Open Blockers',       value:stats?.openBlockers??0,       sub:'Reports with blockers',icon:<AlertTriangle size={16} className="text-white"/>, gradient:'linear-gradient(135deg,#d97706,#fbbf24)', shadow:'rgba(217,119,6,0.40)' },
  ]

  return (
    <>
      <style>{`
        @keyframes cardSlide { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes numCount  { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        .cs { animation: cardSlide 0.45s ease both; }
        .nc { animation: numCount  0.5s ease both; }
        @keyframes spin1 { to{transform:rotate(360deg)} }
        .spinning { animation: spin1 1s linear infinite; }
      `}</style>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-slideUp">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">TechWare Solutions · Analytics Overview</p>
          </div>
          <button onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-all">
            <RefreshCw size={12} className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        {/* ── Large Gradient Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((s, i) => (
            <div key={i} className="cs relative overflow-hidden rounded-2xl p-6 cursor-pointer"
              style={{ animationDelay:`${i*0.08}s`, background:s.gradient, boxShadow:`0 8px 28px ${s.shadow}`, minHeight:148 }}>

              {/* Subtle decoration - soft glows only */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                style={{ background:'rgba(255,255,255,0.10)' }} />
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background:'rgba(255,255,255,0.06)', transform:'translate(30%,-30%)' }} />

              <div className="relative z-10 flex flex-col h-full">
                {/* Top: small icon + label */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-xl" style={{ background:'rgba(255,255,255,0.20)' }}>
                    {s.icon}
                  </div>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest">{s.title}</p>
                </div>

                {/* Big number */}
                <p className="nc text-5xl font-black text-white leading-none mb-1.5"
                  style={{ animationDelay:`${0.3+i*0.08}s` }}>
                  {s.value}
                </p>

                {/* Sub text */}
                <p className="text-white/60 text-xs font-medium mt-auto">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Trend Chart ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cs" style={{ animationDelay: '0.38s' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-gray-900 dark:text-white">Tasks Completed Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Report submissions over time</p>
            </div>
            <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-700">
              {[['team','Team-wide'], ['person','Per Person']].map(([v,l]) => (
                <button key={v} onClick={() => setTrendView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    trendView === v
                      ? 'bg-white dark:bg-gray-600 shadow-sm text-violet-700 dark:text-violet-300'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}>{l}</button>
              ))}
            </div>
          </div>

          {trendView === 'team' ? (
            trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={trends} margin={{ top:10, right:10, left:-10, bottom:0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.07)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize:10, fill:'#9ca3af' }} tickFormatter={v=>v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} allowDecimals={false} axisLine={false} tickLine={false} domain={[0,'dataMax+1']} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[6,6,0,0]} name="Reports Submitted" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState />
          ) : (
            perPersonTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={perPersonTrends} margin={{ top:10, right:10, left:-10, bottom:0 }}>
                  <defs>
                    {['#7c3aed','#0284c7','#059669','#d97706','#db2777','#6366f1'].map((c,i) => (
                      <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity={0.15}/>
                        <stop offset="100%" stopColor={c} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.07)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize:10, fill:'#9ca3af' }} tickFormatter={v=>v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} allowDecimals={false} axisLine={false} tickLine={false} domain={[0,'dataMax+1']} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize:11 }} iconType="circle" iconSize={8} />
                  {people.map((p, i) => {
                    const colors = ['#7c3aed','#0284c7','#059669','#d97706','#db2777','#6366f1']
                    return (
                      <Line key={p} type="monotone" dataKey={p}
                        stroke={colors[i%6]} strokeWidth={2.5}
                        dot={{ r:4, fill:colors[i%6], stroke:'#fff', strokeWidth:2 }}
                        activeDot={{ r:6, stroke:'#fff', strokeWidth:2 }} />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyState />
          )}
        </div>

        {/* ── Pie + Bar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Pie */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 cs" style={{ animationDelay:'0.43s' }}>
            <h2 className="font-black text-gray-900 dark:text-white">This Week Status</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">Submitted · Pending · Late</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="42%" innerRadius={48} outerRadius={70}
                    dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </div>

          {/* Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-3 cs" style={{ animationDelay:'0.48s' }}>
            <h2 className="font-black text-gray-900 dark:text-white">Workload by Project</h2>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">Reports submitted per project</p>
            {workload.length > 0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={workload} layout="vertical" margin={{ top:0, right:10, left:0, bottom:0 }}>
                  <defs>
                    {workload.map((e, i) => (
                      <linearGradient key={i} id={`wg${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={e.color || '#7c3aed'} stopOpacity={1}/>
                        <stop offset="100%" stopColor={e.color || '#7c3aed'} stopOpacity={0.55}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize:10, fill:'#9ca3af' }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:'#9ca3af' }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[0,8,8,0]} name="Reports" maxBarSize={22}>
                    {workload.map((_, i) => <Cell key={i} fill={`url(#wg${i})`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </div>
        </div>

        {/* ── Team Submission Status ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cs" style={{ animationDelay:'0.52s' }}>
          <h2 className="font-black text-gray-900 dark:text-white mb-1">Team Submission Status</h2>
          <p className="text-xs text-gray-400 mb-5">Current week · per team member</p>
          {submissionStatus.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {submissionStatus.map((m, i) => (
                <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl cs"
                  style={{ animationDelay:`${0.55+i*0.05}s`, background:'linear-gradient(135deg,rgba(139,92,246,0.06),rgba(96,165,250,0.04))', border:'1px solid rgba(139,92,246,0.10)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                      style={{ background:`linear-gradient(135deg,${MEMBER_GRADIENTS[i%MEMBER_GRADIENTS.length][0]},${MEMBER_GRADIENTS[i%MEMBER_GRADIENTS.length][1]})`, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                      {m.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.department || '—'}</p>
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 cs" style={{ animationDelay:'0.56s' }}>
          <h2 className="font-black text-gray-900 dark:text-white mb-1">Recent Activity Feed</h2>
          <p className="text-xs text-gray-400 mb-5">Latest submitted reports</p>
          {recentActivity.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentActivity.map((r, i) => (
                <div key={r._id} className="flex items-start gap-3 p-4 rounded-2xl cs"
                  style={{ animationDelay:`${0.58+i*0.04}s`, background:'linear-gradient(135deg,rgba(139,92,246,0.05),rgba(96,165,250,0.03))', border:'1px solid rgba(139,92,246,0.09)' }}>
                  <div className="w-10 h-10 rounded-2xl text-white flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${MEMBER_GRADIENTS[i%MEMBER_GRADIENTS.length][0]},${MEMBER_GRADIENTS[i%MEMBER_GRADIENTS.length][1]})`, boxShadow:'0 4px 10px rgba(0,0,0,0.12)' }}>
                    {r.user?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                      {r.user?.name}<span className="text-gray-400 font-normal"> submitted a report</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{r.tasksCompleted}</p>
                    {r.project && (
                      <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-lg text-xs font-bold"
                        style={{ background:'rgba(124,58,237,0.10)', color:'#7c3aed' }}>
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
    </>
  )
}

const MEMBER_GRADIENTS = [
  ['#7c3aed','#5b21b6'],['#0284c7','#0369a1'],['#059669','#047857'],
  ['#d97706','#b45309'],['#db2777','#be185d'],['#6366f1','#4f46e5'],
]

function EmptyState() {
  return (
    <div className="h-36 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.08)' }}>
          <TrendingUp size={18} style={{ color:'rgba(139,92,246,0.4)' }} />
        </div>
        <p className="text-sm text-gray-300">No data yet</p>
      </div>
    </div>
  )
}
