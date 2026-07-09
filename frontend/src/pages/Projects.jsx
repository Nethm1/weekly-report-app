import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Plus, Edit2, Trash2, FolderOpen, X } from 'lucide-react'

const COLORS = ['#7c3aed','#0284c7','#059669','#d97706','#db2777','#6366f1','#0891b2','#7c3aed']

export default function Projects() {
  const { user } = useAuth()
  const isManager = user?.role === 'manager'
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [form, setForm] = useState({ name:'', description:'', color:'#7c3aed' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setForm({ name:'', description:'', color:'#7c3aed' }); setEditProject(null); setShowForm(true) }
  const openEdit = p => { setForm({ name:p.name, description:p.description||'', color:p.color }); setEditProject(p); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditProject(null) }

  const handleSave = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name required'); return }
    setSaving(true)
    try {
      if (editProject) {
        const { data } = await api.put(`/projects/${editProject._id}`, form)
        setProjects(projects.map(p => p._id === editProject._id ? data.data : p))
        toast.success('Updated')
      } else {
        const { data } = await api.post('/projects', form)
        setProjects([...projects, data.data])
        toast.success('Created')
      }
      closeForm()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!confirm('Delete?')) return
    try {
      await api.delete(`/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6 animate-slideUp">
        <div>
          <h1 className="page-title">Projects & Categories</h1>
          <p className="page-subtitle">Manage work categories used in reports</p>
        </div>
        {isManager && (
          <button onClick={openCreate} className="btn-primary">
            <Plus size={15} /> Add Project
          </button>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
            <div className="gradient-strip" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-gray-900 dark:text-white">{editProject ? 'Edit Project' : 'New Project'}</h2>
                <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                    className="input-field" placeholder="e.g. eLanka Portal, R&D" required autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-1.5 uppercase tracking-widest">Description</label>
                  <input value={form.description} onChange={e => setForm({...form, description:e.target.value})}
                    className="input-field" placeholder="Optional description" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setForm({...form, color:c})}
                        className="w-8 h-8 rounded-xl transition-all hover:scale-110"
                        style={{ backgroundColor:c, boxShadow: form.color===c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none', transform: form.color===c ? 'scale(1.15)' : undefined }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeForm} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary flex-1">
                    {saving ? 'Saving...' : editProject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="page-section animate-cardIn">
          <div className="gradient-strip" />
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.10)' }}>
              <FolderOpen size={26} className="text-violet-500" />
            </div>
            <p className="font-black text-gray-900 dark:text-white">No projects yet</p>
            {isManager && <p className="text-gray-400 text-sm mt-1">Create a project to attach to reports</p>}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <div key={p._id} className="page-section hover:shadow-md transition-all duration-200 animate-cardIn"
              style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
              <div className="p-5 flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${p.color}18` }}>
                    <FolderOpen size={18} style={{ color: p.color }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-gray-900 dark:text-white">{p.name}</h3>
                    {p.description && <p className="text-xs text-gray-400 truncate mt-0.5">{p.description}</p>}
                  </div>
                </div>
                {isManager && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)}
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={13} />
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
