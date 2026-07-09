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
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  const handleSubmit = async (id) => {
    try {
      const { data } = await api.patch(`/reports/${id}/submit`)
      setReports(prev => prev.map(r => r._id === id ? data.data : r))
      toast.success('Report submitted!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit') }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading..." /></div>

  const grouped = reports.reduce((acc, r) => {
    const key = r.weekStart ? r.weekStart.split('T')[0] : 'unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})
  const sortedWeeks = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a))

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slideUp">
        <div>
          <h1 className="page-title">My Reports</h1>
          <p className="page-subtitle">Your weekly work reports, organized by week</p>
        </div>
        <Link to="/my-reports/new" className="btn-primary">
          <Plus size={15} /> New Report
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: reports.length, gradient: 'linear-gradient(135deg,#7c3aed,#5b21b6)', glow: 'rgba(124,58,237,0.15)' },
          { label: 'Submitted', value: reports.filter(r=>r.status==='submitted').length, gradient: 'linear-gradient(135deg,#059669,#047857)', glow: 'rgba(5,150,105,0.15)' },
          { label: 'Drafts', value: reports.filter(r=>r.status==='draft').length, gradient: 'linear-gradient(135deg,#d97706,#b45309)', glow: 'rgba(217,119,6,0.15)' },
        ].map((s, i) => (
          <div key={s.label} className="animate-cardIn rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
            style={{ animationDelay: `${i*0.08}s`, boxShadow: `0 4px 16px ${s.glow}` }}>
            <div className="h-1" style={{ background: s.gradient }} />
            <div className="p-4 text-center">
              <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="page-section animate-cardIn">
          <div className="gradient-strip" />
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.10)' }}>
              <FileText size={26} className="text-violet-500" />
            </div>
            <h3 className="font-black text-gray-900 dark:text-white">No reports yet</h3>
            <p className="text-gray-400 mt-1 text-sm">Create your first weekly report</p>
            <Link to="/my-reports/new" className="btn-primary inline-flex mt-4">
              <Plus size={14} /> Create Report
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedWeeks.map((weekKey, wi) => (
            <div key={weekKey} className="animate-cardIn" style={{ animationDelay: `${0.15+wi*0.06}s` }}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={12} className="text-violet-500" />
                <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {formatWeekRange(grouped[weekKey][0].weekStart, grouped[weekKey][0].weekEnd)}
                </h2>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(139,92,246,0.3),transparent)' }} />
              </div>

              <div className="space-y-3">
                {grouped[weekKey].map((report, ri) => (
                  <div key={report._id} className="page-section hover:shadow-md transition-all duration-200 animate-cardIn"
                    style={{ animationDelay: `${0.2+ri*0.05}s` }}>
                    <div className="h-1" style={{ background: report.status === 'submitted' ? 'linear-gradient(90deg,#059669,#34d399)' : 'linear-gradient(90deg,#d97706,#f59e0b)' }} />
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {report.status === 'submitted'
                            ? <span className="badge-submitted"><CheckCircle size={10} /> Submitted</span>
                            : <span className="badge-draft">✏ Draft</span>}
                          {report.project && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed' }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: report.project.color }} />
                              {report.project.name}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{report.tasksCompleted}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {report.hoursWorked && <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={10}/>{report.hoursWorked}h</span>}
                          {report.submittedAt && <span className="text-xs text-gray-400">Submitted {formatDate(report.submittedAt)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {report.status === 'draft' && (
                          <>
                            <button onClick={() => handleSubmit(report._id)}
                              className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Submit">
                              <Send size={13} className="text-emerald-600" />
                            </button>
                            <Link to={`/my-reports/edit/${report._id}`}
                              className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                              <Edit size={13} className="text-violet-600" />
                            </Link>
                            <button onClick={() => handleDelete(report._id)}
                              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <Trash2 size={13} className="text-red-400" />
                            </button>
                          </>
                        )}
                        {report.status === 'submitted' && (
                          <Link to={`/my-reports/edit/${report._id}`}
                            className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                            <Edit size={13} className="text-violet-600" />
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
