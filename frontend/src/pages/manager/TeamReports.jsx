import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { formatWeekRange } from '../../utils/helpers'
import { getStatusBadgeClass } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Search, ChevronDown, ChevronUp, Filter, Users } from 'lucide-react'

export default function TeamReports() {
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filters, setFilters] = useState({ userId:'', projectId:'', status:'', startDate:'', endDate:'' })

  const fetchReports = async (f = filters) => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([,v])=>v))
      const { data } = await api.get('/reports', { params })
      setReports(data.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/projects')]).then(([u,p]) => {
      setUsers(u.data.data); setProjects(p.data.data)
    })
    fetchReports()
  }, [])

  const handleFilter = e => setFilters({ ...filters, [e.target.name]: e.target.value })
  const clear = () => { const f={userId:'',projectId:'',status:'',startDate:'',endDate:''}; setFilters(f); fetchReports(f) }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Team Reports</h1>
        <p className="page-subtitle">View and filter all team member reports</p>
      </div>

      {/* Filters */}
      <div className="page-section mb-5 animate-cardIn">
        <div className="gradient-strip" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={14} className="text-violet-500" />
            <span className="text-sm font-black text-gray-700 dark:text-gray-200">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <select name="userId" value={filters.userId} onChange={handleFilter} className="input-field text-sm">
              <option value="">All Members</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
            <select name="projectId" value={filters.projectId} onChange={handleFilter} className="input-field text-sm">
              <option value="">All Projects</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilter} className="input-field text-sm">
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="draft">Draft</option>
            </select>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilter} className="input-field text-sm" />
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilter} className="input-field text-sm" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => fetchReports(filters)} className="btn-primary text-sm">
              <Search size={13} /> Search
            </button>
            <button onClick={clear} className="btn-secondary text-sm">Clear</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="page-section animate-cardIn">
          <div className="gradient-strip" />
          <div className="p-14 text-center">
            <Search size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 text-sm">No reports found for the selected filters.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-slideUp">
            {reports.length} report{reports.length !== 1 ? 's' : ''} found
          </p>
          {reports.map((report, i) => (
            <div key={report._id} className="page-section cursor-pointer hover:shadow-md transition-all duration-200 animate-cardIn"
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => setExpanded(expanded === report._id ? null : report._id)}>
              <div className="h-1" style={{ background: report.status === 'submitted' ? 'linear-gradient(90deg,#059669,#34d399)' : 'linear-gradient(90deg,#d97706,#f59e0b)' }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={getStatusBadgeClass(report.status)}>
                        {report.status === 'submitted' ? '✓ Submitted' : '✏ Draft'}
                      </span>
                      {report.project && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.project.color }} />
                          {report.project.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)' }}>
                        {report.user?.name?.charAt(0)}
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-sm">{report.user?.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-sm text-gray-400">{formatWeekRange(report.weekStart, report.weekEnd)}</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {expanded === report._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {expanded === report._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 animate-cardIn">
                    <Detail label="Tasks Completed" value={report.tasksCompleted} />
                    <Detail label="Tasks Planned" value={report.tasksPlanned} />
                    <Detail label="Blockers" value={report.blockers || 'None'} />
                    {report.hoursWorked && <Detail label="Hours Worked" value={`${report.hoursWorked} hours`} />}
                    {report.notes && <Detail label="Notes" value={report.notes} />}
                    {report.user?.department && <Detail label="Department" value={report.user.department} />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{value}</p>
    </div>
  )
}
