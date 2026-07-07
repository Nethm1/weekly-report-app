import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatWeekRange, getStatusBadgeClass } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, FileText, Edit, Trash2, Send, Calendar, Clock } from 'lucide-react'

export default function MyReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/reports/my')
      setReports(data.data)
    } catch {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReports() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this report?')) return
    try {
      await api.delete(`/reports/${id}`)
      toast.success('Report deleted')
      setReports(reports.filter(r => r._id !== id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleSubmit = async (id) => {
    try {
      const { data } = await api.patch(`/reports/${id}/submit`)
      setReports(reports.map(r => r._id === id ? data.data : r))
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage your weekly work reports</p>
        </div>
        <Link to="/my-reports/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-violet-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No reports yet</h3>
          <p className="text-gray-400 mt-1 text-sm">Create your first weekly report to get started</p>
          <Link to="/my-reports/new" className="btn-primary inline-flex items-center gap-2 mt-5">
            <Plus size={16} /> Create First Report
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report._id} className="card hover:shadow-md transition-all duration-200">
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
                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {formatWeekRange(report.weekStart, report.weekEnd)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{report.tasksCompleted}</p>
                  {report.hoursWorked && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-400">{report.hoursWorked} hours worked</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {report.status === 'draft' && (
                    <>
                      <button onClick={() => handleSubmit(report._id)}
                        title="Submit"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
                        <Send size={15} />
                      </button>
                      <Link to={`/my-reports/edit/${report._id}`}
                        className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                        <Edit size={15} />
                      </Link>
                      <button onClick={() => handleDelete(report._id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                  {report.status === 'submitted' && (
                    <Link to={`/my-reports/edit/${report._id}`}
                      className="p-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                      <Edit size={15} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
