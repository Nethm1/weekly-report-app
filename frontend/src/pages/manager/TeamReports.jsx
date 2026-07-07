import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { formatWeekRange, getStatusBadgeClass } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react'

export default function TeamReports() {
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filters, setFilters] = useState({ userId: '', projectId: '', status: '', startDate: '', endDate: '' })

  const fetchReports = async (f = filters) => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v))
      const { data } = await api.get('/reports', { params })
      setReports(data.data)
    } catch { toast.error('Failed to load reports') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/projects')]).then(([u, p]) => {
      setUsers(u.data.data); setProjects(p.data.data)
    })
    fetchReports()
  }, [])

  const handleFilter = e => setFilters({ ...filters, [e.target.name]: e.target.value })
  const applyFilters = () => fetchReports(filters)
  const clearFilters = () => { const f = { userId: '', projectId: '', status: '', startDate: '', endDate: '' }; setFilters(f); fetchReports(f) }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
        <p className="text-gray-400 text-sm mt-1">View and filter all team member reports</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-violet-500" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
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
            <option value="late">Late</option>
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilter} className="input-field text-sm" />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilter} className="input-field text-sm" />
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={applyFilters} className="btn-primary flex items-center gap-2 text-sm">
            <Search size={14} /> Search
          </button>
          <button onClick={clearFilters} className="btn-secondary text-sm">Clear</button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p>No reports found for the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{reports.length} report{reports.length !== 1 ? 's' : ''} found</p>
          {reports.map((report) => (
            <div key={report._id} className="card hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setExpanded(expanded === report._id ? null : report._id)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={getStatusBadgeClass(report.status)}>
                      {report.status === 'submitted' ? '✓ Submitted' : '✏ Draft'}
                    </span>
                    {report.project && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.project.color }} />
                        {report.project.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {report.user?.name?.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{report.user?.name}</span>
                    <span className="text-gray-400 text-sm">·</span>
                    <span className="text-sm text-gray-500">{formatWeekRange(report.weekStart, report.weekEnd)}</span>
                  </div>
                </div>
                <div className="text-gray-400 flex-shrink-0">
                  {expanded === report._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expanded === report._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail label="Tasks Completed" value={report.tasksCompleted} />
                  <Detail label="Tasks Planned" value={report.tasksPlanned} />
                  <Detail label="Blockers" value={report.blockers || 'None'} />
                  {report.hoursWorked && <Detail label="Hours Worked" value={`${report.hoursWorked} hours`} />}
                  {report.notes && <Detail label="Notes" value={report.notes} />}
                  {report.user?.department && <Detail label="Department" value={report.user.department} />}
                </div>
              )}
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
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-700 whitespace-pre-line">{value}</p>
    </div>
  )
}
