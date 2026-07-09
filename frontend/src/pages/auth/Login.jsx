import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, BarChart2, TrendingUp, Bot, FileText, Shield } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome back, ${user.name}!`)
      setTimeout(() => navigate(user.role === 'manager' ? '/dashboard' : '/my-reports', { replace: true }), 100)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      toast('Enter your email first', { icon: '💡' })
      return
    }
    toast.success(`Reset instructions sent to ${email}`, { duration: 4000 })
  }

  const features = [
    { icon: <FileText size={13}/>, title: 'Structured Reports', desc: 'Fixed weekly report format', color: '#a78bfa', bg: 'rgba(139,92,246,0.20)' },
    { icon: <TrendingUp size={13}/>, title: 'Analytics Dashboard', desc: 'Real-time charts and tracking', color: '#34d399', bg: 'rgba(52,211,153,0.18)' },
    { icon: <Bot size={13}/>, title: 'AI Team Assistant', desc: 'Intelligent Q&A about team activity', color: '#60a5fa', bg: 'rgba(96,165,250,0.18)' },
    { icon: <Shield size={13}/>, title: 'Role-Based Access', desc: 'Separate views for roles', color: '#f472b6', bg: 'rgba(244,114,182,0.18)' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .a1{animation:fadeUp .5s .00s ease both}
        .a2{animation:fadeUp .5s .10s ease both}
        .a3{animation:fadeUp .5s .20s ease both}
        .a4{animation:fadeUp .5s .30s ease both}
        .ring{animation:spinRing 22s linear infinite}
      `}</style>

      <div className="min-h-screen flex">

        {/* LEFT - dark bg image */}
        <div className="hidden lg:flex w-[52%] flex-col relative overflow-hidden"
          style={{ backgroundImage:`url('/login-bg.png')`, backgroundSize:'cover', backgroundPosition:'center', backgroundColor:'#050a1e' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(4,6,28,0.82)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            style={{ background:'linear-gradient(to top, rgba(2,4,20,0.95) 0%, transparent 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background:'linear-gradient(to bottom, rgba(2,4,20,0.75) 0%, transparent 100%)' }} />
          <div className="ring absolute top-12 right-12 w-16 h-16 rounded-full border border-dashed pointer-events-none opacity-30 z-10"
            style={{ borderColor:'#a78bfa' }} />

          <div className="relative z-10 flex flex-col h-full px-11 py-10">
            {/* Logo */}
            <div className="a1 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                <img src="/favicon.png" alt="TechWare" className="w-full h-full object-cover"
                  onError={e => { e.target.style.display='none' }} />
              </div>
              <div>
                <p className="text-white/55 text-xs font-semibold tracking-widest uppercase">WeeklyReport</p>
                <p className="font-black text-sm leading-tight"
                  style={{ background:'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  TechWare Solutions
                </p>
              </div>
            </div>

            <div className="flex-1" />

            <div className="a2 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                style={{ background:'rgba(139,92,246,0.20)', border:'1px solid rgba(139,92,246,0.35)' }}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-violet-300 text-xs font-medium">TechWare Solutions · Colombo, Sri Lanka</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight mb-3 drop-shadow-xl">
                Team Reports,<br /><span className="text-white">Simplified.</span>
              </h1>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Smart weekly reporting with analytics dashboards and AI insights.
              </p>
            </div>

            <div className="a3 space-y-3 mb-7">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:f.bg, border:`1px solid ${f.color}40` }}>
                    <span style={{ color:f.color }}>{f.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{f.title}</p>
                    <p className="text-white/45 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="a4 grid grid-cols-3 gap-2 mb-8">
              {[
                { value:'20+', label:'Reports', color:'#a78bfa', bg:'rgba(139,92,246,0.20)', border:'rgba(139,92,246,0.35)' },
                { value:'100%', label:'Compliance', color:'#34d399', bg:'rgba(52,211,153,0.15)', border:'rgba(52,211,153,0.35)' },
                { value:'5', label:'Members', color:'#60a5fa', bg:'rgba(96,165,250,0.15)', border:'rgba(96,165,250,0.35)' },
              ].map(s => (
                <div key={s.label} className="rounded-xl px-3 py-3 text-center"
                  style={{ background:s.bg, border:`1px solid ${s.border}` }}>
                  <p className="font-black text-xl leading-none" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-white/50 text-xs mt-1.5">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="text-white/25 text-xs">© 2026 TechWare Solutions (Pvt) Ltd · Colombo 03</p>
          </div>
        </div>

        {/* RIGHT - glass form on gradient */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, #c084fc 0%, #818cf8 35%, #60a5fa 65%, #a78bfa 100%)' }}>

          <div className="absolute top-10 left-10 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-50"
            style={{ background:'radial-gradient(circle, #e879f9, transparent)' }} />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-40"
            style={{ background:'radial-gradient(circle, #3b82f6, transparent)' }} />

          <div className="w-full max-w-xs relative z-10">

            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl"
                style={{ background:'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>

            {/* Glass card */}
            <div className="a2 rounded-3xl p-6 mb-2"
              style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.35)', boxShadow:'0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)' }}>

              <h2 className="text-center text-white font-black text-lg mb-5 drop-shadow">Welcome Back 👋</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.30)' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.80)" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="flex-1 bg-transparent text-white placeholder-white/60 text-sm font-medium focus:outline-none"
                    required autoFocus />
                </div>

                <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.30)' }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.80)" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="flex-1 bg-transparent text-white placeholder-white/60 text-sm font-medium focus:outline-none"
                    required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-white/60 hover:text-white transition-colors">
                    {showPwd ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                </div>

                <div className="flex items-center justify-between px-1 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-violet-800" />
                    <span className="text-xs text-white/75 font-medium">Remember me</span>
                  </label>
                  <button type="button" onClick={handleForgotPassword}
                    className="text-xs text-white/75 font-semibold hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>

            {/* Login button */}
            <div className="rounded-3xl p-4"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 font-black text-white text-sm tracking-[0.15em] uppercase rounded-xl transition-all hover:bg-white/10"
                style={{ background:'transparent' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                    Signing in...
                  </span>
                ) : 'LOGIN'}
              </button>
            </div>

            <p className="text-center text-sm text-white/70 mt-5">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-bold hover:text-white/90 underline underline-offset-2">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
