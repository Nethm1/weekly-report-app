import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { BarChart2 } from 'lucide-react'

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
      setTimeout(() => {
        navigate(user.role === 'manager' ? '/dashboard' : '/my-reports', { replace: true })
      }, 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
          <BarChart2 size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Join Your Team</h1>
        <p className="text-violet-200 text-center max-w-sm">
          Create your account to start submitting weekly reports and collaborating with your team.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-500 mt-1">Fill in your details to get started</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="input-field" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input-field" placeholder="you@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input name="password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="input-field" placeholder="Min 6 characters" minLength={6} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <input name="department" value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                  className="input-field" placeholder="e.g. Engineering, Design" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select name="role" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field">
                  <option value="member">Team Member</option>
                  <option value="manager">Manager / Admin</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
