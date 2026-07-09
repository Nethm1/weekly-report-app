import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { CheckCircle, UserCircle, Shield } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'member', department:'' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
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

  const perks = [
    'Submit structured weekly reports',
    'Track submission compliance',
    'Collaborate with your team',
    'AI-powered team insights',
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .s1{animation:fadeUp .5s 0.0s ease both}
        .s2{animation:fadeUp .5s 0.1s ease both}
        .s3{animation:fadeUp .5s 0.2s ease both}
        .ring{animation:spinRing 22s linear infinite}
      `}</style>

      <div className="min-h-screen flex">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex w-[45%] flex-col relative overflow-hidden"
          style={{ backgroundImage:`url('/register-bg.png')`, backgroundSize:'cover', backgroundPosition:'center', backgroundColor:'#050a1e' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(4,6,28,0.82)' }} />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            style={{ background:'linear-gradient(to top, rgba(2,4,20,0.95) 0%, transparent 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none"
            style={{ background:'linear-gradient(to bottom, rgba(2,4,20,0.75) 0%, transparent 100%)' }} />
          <div className="ring absolute top-12 right-12 w-16 h-16 rounded-full border border-dashed pointer-events-none opacity-30 z-10"
            style={{ borderColor:'#a78bfa' }} />

          <div className="relative z-10 flex flex-col h-full px-11 py-10">

            {/* Logo */}
            <div className="s1 flex items-center gap-3">
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

            <div className="s2 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                style={{ background:'rgba(139,92,246,0.20)', border:'1px solid rgba(139,92,246,0.35)' }}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-violet-300 text-xs font-medium">Join TechWare Solutions</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight mb-3 drop-shadow-xl">
                Join Your<br /><span className="text-white">Team Today.</span>
              </h1>
              <p className="text-white/65 text-sm leading-relaxed max-w-xs">
                Create your account to start submitting weekly reports and collaborating with your team.
              </p>
            </div>

            <div className="s3 space-y-2.5 mb-7">
              {perks.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(139,92,246,0.25)', border:'1px solid rgba(139,92,246,0.4)' }}>
                    <CheckCircle size={11} className="text-violet-300" />
                  </div>
                  <span className="text-white/75 text-sm">{p}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 mb-8">
              {[
                { icon:<UserCircle size={16}/>, title:'Team Member', desc:'Submit and manage weekly reports', color:'#a78bfa', bg:'rgba(139,92,246,0.18)' },
                { icon:<Shield size={16}/>, title:'Manager / Admin', desc:'View analytics and team reports', color:'#34d399', bg:'rgba(52,211,153,0.15)' },
              ].map(r => (
                <div key={r.title} className="flex items-center gap-3 rounded-xl px-3.5 py-3"
                  style={{ background:r.bg, border:`1px solid ${r.color}40` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:`${r.color}25` }}>
                    <span style={{ color:r.color }}>{r.icon}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{r.title}</p>
                    <p className="text-white/45 text-xs">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/25 text-xs">© 2026 TechWare Solutions (Pvt) Ltd · Colombo 03</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 py-10 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg, #c084fc 0%, #818cf8 35%, #60a5fa 65%, #a78bfa 100%)' }}>

          {/* Glow blobs */}
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-50"
            style={{ background:'radial-gradient(circle, #e879f9, transparent)' }} />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-40"
            style={{ background:'radial-gradient(circle, #3b82f6, transparent)' }} />

          <div className="w-full max-w-sm relative z-10">

            {/* Avatar */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/30 shadow-2xl"
                style={{ background:'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>

            {/* Glass card */}
            <div className="s2 rounded-3xl p-6 mb-2"
              style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.35)', boxShadow:'0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)' }}>

              <h2 className="text-center text-white font-black text-lg mb-5 drop-shadow">Create Account ✨</h2>

              <div className="space-y-3">
                {[
                  { key:'name', placeholder:'Full Name', type:'text', required:true },
                  { key:'email', placeholder:'Email Address', type:'email', required:true },
                  { key:'password', placeholder:'Password (min 6)', type:'password', required:true, minLength:6 },
                  { key:'department', placeholder:'Department (optional)', type:'text' },
                ].map(f => (
                  <div key={f.key} className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.30)' }}>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm({...form, [f.key]:e.target.value})}
                      placeholder={f.placeholder} minLength={f.minLength}
                      className="flex-1 bg-transparent text-white placeholder-white/60 text-sm font-medium focus:outline-none"
                      required={f.required} autoFocus={f.key==='name'} />
                  </div>
                ))}

                {/* Role */}
                <div className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background:'rgba(255,255,255,0.22)', border:'1px solid rgba(255,255,255,0.30)' }}>
                  <select value={form.role} onChange={e => setForm({...form, role:e.target.value})}
                    className="flex-1 bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
                    style={{ WebkitAppearance:'none', appearance:'none' }}>
                    <option value="member" className="text-gray-800 bg-white">Team Member</option>
                    <option value="manager" className="text-gray-800 bg-white">Manager / Admin</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="rounded-3xl p-4"
              style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.25)' }}>
              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3 font-black text-white text-sm tracking-[0.15em] uppercase rounded-xl transition-all hover:bg-white/10"
                style={{ background:'transparent' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                    Creating...
                  </span>
                ) : 'CREATE ACCOUNT'}
              </button>
            </div>

            <p className="text-center text-sm text-white/70 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:text-white/90 underline underline-offset-2">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
