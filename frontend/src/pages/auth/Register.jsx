import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { BarChart2, ArrowRight } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member', department: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const user = await register(form)
      toast.success('Account created!')
      setTimeout(() => navigate(user.role === 'manager' ? '/dashboard' : '/my-reports', { replace: true }), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 dark:bg-gray-900" style={{ backgroundColor: '#EEE9FF' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
            <BarChart2 size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="text-gray-400 mt-1 text-sm">Join your team's reporting system</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-white p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" placeholder="John Doe" required autoFocus />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" placeholder="you@example.com" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field" placeholder="Min 6 characters" minLength={6} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="input-field" placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                  <option value="member">Team Member</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
