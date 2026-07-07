import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, BarChart2, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name}!`)
      setTimeout(() => {
        navigate(user.role === 'manager' ? '/dashboard' : '/my-reports', { replace: true })
      }, 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#EEE9FF' }}>
      {/* Left - Decorative */}
      <div className="hidden lg:flex w-[45%] flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3D1A8E 0%, #2D1B6B 60%, #1E1050 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a78bfa33, #7c3aed55)', border: '1px solid rgba(167,139,250,0.3)' }}>
            <BarChart2 size={38} className="text-violet-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Weekly Report</h1>
          <p className="text-purple-200 text-sm leading-relaxed max-w-xs">
            Track your team's weekly progress, manage reports, and gain insights through powerful analytics.
          </p>

          {/* Feature pills */}
          <div className="mt-8 flex flex-col gap-3">
            {['📊 Real-time analytics dashboard', '🤖 AI-powered team insights', '✅ Role-based access control'].map(f => (
              <div key={f} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 text-sm text-purple-100">
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center">
                <BarChart2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-800">WeeklyReport</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
            <p className="text-gray-400 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-white p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field" placeholder="you@example.com" required autoFocus />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pr-11" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 text-base mt-2">
                {loading ? 'Signing in...' : (
                  <><span>Sign In</span><ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
