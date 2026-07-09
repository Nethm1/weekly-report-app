import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Save, Send, ArrowLeft } from 'lucide-react'

export default function ReportForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  const today = new Date()
  const day = today.getDay()
  const diffToMon = (day === 0 ? -6 : 1) - day
  const monday = new Date(today); monday.setDate(today.getDate() + diffToMon)
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6)
  const toDateStr = d => d.toISOString().split('T')[0]

  const [form, setForm] = useState({
    project: '',
    weekStart: toDateStr(monday),
    weekEnd: toDateStr(sunday),
    tasksCompleted: '',
    tasksPlanned: '',
    blockers: 'None',
    hoursWorked: '',
    notes: '',
  })

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data.data)).catch(() => {})
    if (isEdit) {
      api.get(`/reports/${id}`).then(({ data }) => {
        const r = data.data
        setForm({
          project: r.project?._id || '',
          weekStart: r.weekStart?.split('T')[0] || '',
          weekEnd: r.weekEnd?.split('T')[0] || '',
          tasksCompleted: r.tasksCompleted || '',
          tasksPlanned: r.tasksPlanned || '',
          blockers: r.blockers || 'None',
          hoursWorked: r.hoursWorked || '',
          notes: r.notes || '',
        })
        setLoading(false)
      }).catch(() => { toast.error('Failed to load report'); navigate('/my-reports') })
    }
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.project) { toast.error('Please select a project'); return false }
    if (!form.weekStart || !form.weekEnd) { toast.error('Please select week dates'); return false }
    if (!form.tasksCompleted.trim()) { toast.error('Tasks completed is required'); return false }
    if (!form.tasksPlanned.trim()) { toast.error('Tasks planned is required'); return false }
    return true
  }

  const saveReport = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = { ...form, hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined }
      if (isEdit) {
        await api.put(`/reports/${id}`, payload)
      } else {
        await api.post('/reports', payload)
      }
      toast.success('Report saved as draft')
      navigate('/my-reports')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const submitReport = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = { ...form, hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined }
      let reportId = id
      if (isEdit) {
        await api.put(`/reports/${id}`, payload)
      } else {
        const { data } = await api.post('/reports', payload)
        reportId = data.data._id
      }
      await api.patch(`/reports/${reportId}/submit`)
      toast.success('Report submitted successfully!')
      navigate('/my-reports')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/my-reports')}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Reports
      </button>

      <div className="page-section animate-scaleIn">
        <div className="gradient-strip-v" />
        <div className="p-6">
        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-6">
          {isEdit ? 'Edit Report' : 'New Weekly Report'}
        </h1>

        <div className="space-y-5">
          {/* Week Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Week Start *</label>
              <input type="date" name="weekStart" value={form.weekStart} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Week End *</label>
              <input type="date" name="weekEnd" value={form.weekEnd} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project / Category *</label>
            {projects.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 px-4 py-3 rounded-xl">
                No projects available. Ask your manager to create projects first.
              </p>
            ) : (
              <select name="project" value={form.project} onChange={handleChange} className="input-field">
                <option value="">Select a project...</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            )}
          </div>

          {/* Tasks Completed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tasks Completed This Week *</label>
            <textarea name="tasksCompleted" value={form.tasksCompleted} onChange={handleChange}
              rows={4} className="input-field resize-none"
              placeholder="Describe the tasks you completed this week..." />
          </div>

          {/* Tasks Planned */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tasks Planned for Next Week *</label>
            <textarea name="tasksPlanned" value={form.tasksPlanned} onChange={handleChange}
              rows={3} className="input-field resize-none"
              placeholder="What are you planning to work on next week?" />
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Blockers / Challenges</label>
            <textarea name="blockers" value={form.blockers} onChange={handleChange}
              rows={2} className="input-field resize-none"
              placeholder="Any blockers? Type 'None' if there are none." />
          </div>

          {/* Hours Worked */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hours Worked <span className="text-gray-400">(optional)</span></label>
            <input type="number" name="hoursWorked" value={form.hoursWorked} onChange={handleChange}
              min="0" max="168" step="0.5" className="input-field" placeholder="e.g. 40" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes / Links <span className="text-gray-400">(optional)</span></label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              rows={2} className="input-field resize-none"
              placeholder="Any additional notes, links to PRs, docs, etc." />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={saveReport} disabled={submitting} className="btn-secondary flex items-center gap-2">
              <Save size={15} /> Save Draft
            </button>
            <button onClick={submitReport} disabled={submitting} className="btn-primary flex items-center gap-2">
              <Send size={15} /> {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
