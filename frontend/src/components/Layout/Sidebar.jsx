import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  LayoutDashboard, FileText, FolderOpen, Users,
  LogOut, ChevronRight, Settings, Sun, Moon
} from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const managerLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
    { to: '/team-reports', icon: <FileText size={17} />, label: 'Team Reports' },
    { to: '/projects', icon: <FolderOpen size={17} />, label: 'Projects' },
    { to: '/users', icon: <Users size={17} />, label: 'Team Members' },
  ]
  const memberLinks = [
    { to: '/my-reports', icon: <FileText size={17} />, label: 'My Reports' },
    { to: '/projects', icon: <FolderOpen size={17} />, label: 'Projects' },
  ]
  const links = user?.role === 'manager' ? managerLinks : memberLinks

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #1e0a4a 0%, #2d1b69 50%, #1a0a3e 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Favicon logo */}
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
            <img src="/favicon.png" alt="TechWare"
              className="w-full h-full object-cover"
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.style.cssText = 'background:linear-gradient(135deg,#7c3aed,#4f46e5);display:flex;align-items:center;justify-content:center;'
              }} />
          </div>
          <div className="min-w-0">
            <p className="text-white/55 text-xs font-semibold tracking-widest uppercase leading-tight">WeeklyReport</p>
            <p className="font-black text-sm leading-tight"
              style={{
                background: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              TechWare Solutions
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-purple-400/70 text-xs font-semibold uppercase tracking-widest px-3 pb-2">Menu</p>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-white/18 text-white shadow-sm'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`
            }>
            <span className="flex-shrink-0">{icon}</span>
            <span className="flex-1">{label}</span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5 border-t border-white/10">
        <NavLink to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive ? 'bg-white/18 text-white' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`
          }>
          <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-purple-400 text-xs capitalize">{user?.role}</p>
          </div>
          <Settings size={13} className="opacity-30" />
        </NavLink>

        <button onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-purple-300 hover:bg-white/10 hover:text-white transition-all duration-200">
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          <span className="text-xs">{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-purple-300 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200">
          <LogOut size={15} />
          <span className="text-xs">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
