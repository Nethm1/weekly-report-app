import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Save, Lock, User } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '' })
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' })
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  const handleProfileSave = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/users/profile', form)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (pwdForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setPwdLoading(true)
    try {
      await api.put('/users/profile', { password: pwdForm.newPassword })
      toast.success('Password updated!')
      setPwdForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally { setPwdLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your account information</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold mt-1.5 ${
              user?.role === 'manager' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
            }`}>{user?.role}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <User size={15} className="text-violet-500" />
          <h2 className="font-semibold text-gray-900 text-sm">Personal Information</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
            <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
              className="input-field" placeholder="e.g. Engineering, Design" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input value={user?.email} disabled className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={15} className="text-violet-500" />
          <h2 className="font-semibold text-gray-900 text-sm">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
            <input type="password" value={pwdForm.newPassword}
              onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
              className="input-field" placeholder="Min 6 characters" minLength={6} required />
          </div>
          <button type="submit" disabled={pwdLoading} className="btn-secondary">
            <Lock size={14} /> {pwdLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
