import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatWeekRange, formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, FileText, Edit, Trash2, Send, Calendar, Clock, CheckCircle } from 'lucide-react'

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/my')
      .then(({ data }) => setReports(data.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this report?')) return
    try {
      await api.delete(`/reports/${id}`)
      toast.success('Report deleted')
      setReports(prev => prev.filter(r => r._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleSubmit = async (id) => {
    try {
      const { data } = await api.patch(`/reports/${id}/submit`)
      setReports(prev => prev.map(r => r._id === id ? data.data : r))
      toast.success('Report submitted!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <LoadingSpinner size="lg" text="Loading reports..." />
    </div>
  )

  // Group by week
  const grouped = reports.reduce((acc, r) => {
    const key = r.weekStart ? r.weekStart.split('T')[0] : 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})
  const sortedWeeks = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h1>
          <p className="text-gray-400 text-sm mt-0.5">Your weekly work reports, organized by week</p>
        </div>
        <Link to="/my-reports/new" className="btn-primary">
          <Plus size={15} /> New Report
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Reports', value: reports.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Submitted', value: reports.filter(r => r.status === 'submitted').length, color: 'text-emerald-600' },
          { label: 'Drafts', value: reports.filter(r => r.status === 'draft').length, color: 'text-amber-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center py-20">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' }}>
            <FileText size={28} className="text-violet-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No reports yet</h3>
          <p className="text-gray-400 mt-1 text-sm">Create your first weekly report to get started</p>
          <Link to="/my-reports/new" className="btn-primary inline-flex mt-5">
            <Plus size={15} /> Create First Report
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedWeeks.map(weekKey => (
            <div key={weekKey}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={13} className="text-violet-500" />
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {formatWeekRange(grouped[weekKey][0].weekStart, grouped[weekKey][0].weekEnd)}
                </h2>
                <div className="flex-1 h-px bg-purple-100" />
              </div>
              <div className="space-y-3">
                {grouped[weekKey].map(report => (
                  <div key={report._id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {report.status === 'submitted' ? (
                            <span className="badge-submitted"><CheckCircle size={10} /> Submitted</span>
                          ) : (
                            <span className="badge-draft">✏ Draft</span>
                          )}
                          {report.project && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.project.color }} />
                              {report.project.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{report.tasksCompleted}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {report.hoursWorked && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock size={10} /> {report.hoursWorked}h
                            </span>
                          )}
                          {report.submittedAt && (
                            <span className="text-xs text-gray-400">Submitted {formatDate(report.submittedAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {report.status === 'draft' && (
                          <>
                            <button onClick={() => handleSubmit(report._id)} title="Submit"
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                              <Send size={14} />
                            </button>
                            <Link to={`/my-reports/edit/${report._id}`}
                              className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                              <Edit size={14} />
                            </Link>
                            <button onClick={() => handleDelete(report._id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        {report.status === 'submitted' && (
                          <Link to={`/my-reports/edit/${report._id}`}
                            className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                            <Edit size={14} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
