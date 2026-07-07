import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react'

const COLORS = ['#7C3AED', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6']

export default function Projects() {
  const { user } = useAuth()
  const isManager = user?.role === 'manager'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', color: '#7C3AED' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setForm({ name: '', description: '', color: '#7C3AED' }); setEditProject(null); setShowForm(true) }
  const openEdit = p => { setForm({ name: p.name, description: p.description || '', color: p.color }); setEditProject(p); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditProject(null) }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Project name required'); return }
    setSaving(true)
    try {
      if (editProject) {
        const { data } = await api.put(`/projects/${editProject._id}`, form)
        setProjects(projects.map(p => p._id === editProject._id ? data.data : p))
        toast.success('Project updated')
      } else {
        const { data } = await api.post('/projects', form)
        setProjects([...projects, data.data])
        toast.success('Project created')
      }
      closeForm()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      toast.success('Project deleted')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects & Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Manage work categories used in reports</p>
        </div>
        {isManager && (
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="e.g. Client A, R&D, Marketing" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="input-field" placeholder="Optional short description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-xl transition-all ${form.color === c ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving...' : editProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} className="text-violet-500" />
          </div>
          <p className="text-gray-500 font-medium">No projects yet</p>
          {isManager && <p className="text-gray-400 text-sm mt-1">Create a project to attach to reports</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p._id} className="card hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: p.color + '22' }}>
                    <FolderOpen size={18} style={{ color: p.color }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    {p.description && <p className="text-sm text-gray-400 truncate mt-0.5">{p.description}</p>}
                  </div>
                </div>
                {isManager && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
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
