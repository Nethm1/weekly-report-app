import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { User, Save } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/users/profile', form)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Update your account information</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium mt-1 ${
              user?.role === 'manager' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
            }`}>{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
            <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
              className="input-field" placeholder="e.g. Engineering, Design" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input value={user?.email} disabled className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Save size={15} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
