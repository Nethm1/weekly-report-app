import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Save, Lock, User, Mail, Building2, Shield, MapPin, Calendar } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '' })
  const [pwdForm, setPwdForm] = useState({ newPassword: '' })
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  const handleProfileSave = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/users/profile', form)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (pwdForm.newPassword.length < 6) { toast.error('Min 6 characters'); return }
    setPwdLoading(true)
    try {
      await api.put('/users/profile', { password: pwdForm.newPassword })
      toast.success('Password updated!')
      setPwdForm({ newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally { setPwdLoading(false) }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const infoItems = [
    { icon: <Mail size={14} />, label: 'Email', value: user?.email, color: 'violet' },
    { icon: <Building2 size={14} />, label: 'Department', value: user?.department || '—', color: 'violet' },
    { icon: <Shield size={14} />, label: 'Role', value: user?.role === 'manager' ? 'Manager / Admin' : 'Team Member', color: 'emerald' },
    { icon: <MapPin size={14} />, label: 'Location', value: 'Colombo, Sri Lanka', color: 'blue' },
    { icon: <Building2 size={14} />, label: 'Company', value: 'TechWare Solutions (Pvt) Ltd', color: 'violet' },
    { icon: <Calendar size={14} />, label: 'Joined', value: '2026', color: 'amber' },
  ]

  const colorMap = {
    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', icon: 'bg-violet-100 dark:bg-violet-800 text-violet-600 dark:text-violet-300' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300' },
  }

  return (
    <div className="animate-slideUp">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: User Card ── */}
        <div className="lg:col-span-1 animate-scaleIn">
          <div className="card h-full">
            {/* Avatar + name */}
            <div className="text-center pb-5 border-b border-gray-100 dark:border-gray-700 mb-5">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>
                  {initials}
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white dark:border-gray-800"
                  style={{ background: user?.role === 'manager' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                  {user?.role === 'manager' ? <Shield size={11} className="text-white" /> : <User size={11} className="text-white" />}
                </div>
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">{user?.name}</h2>
              <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-3 ${
                user?.role === 'manager'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                  : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400'
              }`}>
                {user?.role === 'manager' ? <Shield size={10} /> : <User size={10} />}
                {user?.role === 'manager' ? 'Manager' : 'Team Member'}
              </span>
            </div>

            {/* Info list */}
            <div className="space-y-2.5">
              {infoItems.map(item => (
                <div key={item.label}
                  className={`flex items-center gap-3 p-2.5 rounded-xl ${colorMap[item.color].bg}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[item.color].icon}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Forms ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal Info */}
          <div className="card animate-slideUp delay-100">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <User size={15} className="text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Personal Information</h3>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Department</label>
                  <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                    className="input-field" placeholder="e.g. Engineering, Design" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={user?.email} disabled
                    className="input-field pl-9 bg-gray-50 dark:bg-gray-700/50 text-gray-400 cursor-not-allowed" />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={loading} className="btn-primary">
                  <Save size={14} /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="card animate-slideUp delay-200">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Lock size={15} className="text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">New Password</label>
                <input type="password" value={pwdForm.newPassword}
                  onChange={e => setPwdForm({ newPassword: e.target.value })}
                  className="input-field" placeholder="Min 6 characters" minLength={6} required />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={pwdLoading} className="btn-secondary">
                  <Lock size={14} /> {pwdLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
