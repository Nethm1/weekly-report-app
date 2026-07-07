import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, FileText, FolderOpen, Users,
  LogOut, BarChart2, ChevronRight, UserCircle, Settings
} from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  const managerLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/team-reports', icon: <FileText size={18} />, label: 'Team Reports' },
    { to: '/projects', icon: <FolderOpen size={18} />, label: 'Projects' },
    { to: '/users', icon: <Users size={18} />, label: 'Team Members' },
  ]
  const memberLinks = [
    { to: '/my-reports', icon: <FileText size={18} />, label: 'My Reports' },
    { to: '/projects', icon: <FolderOpen size={18} />, label: 'Projects' },
  ]
  const links = user?.role === 'manager' ? managerLinks : memberLinks

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40"
      style={{ background: 'linear-gradient(160deg, #3D1A8E 0%, #2D1B6B 60%, #1E1050 100%)' }}>

      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">WeeklyReport</p>
            <p className="text-purple-300 text-xs">Team Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest px-3 pb-2">Main Menu</p>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-purple-200 hover:bg-white/10 hover:text-white'
              }`
            }>
            <span className="flex-shrink-0">{icon}</span>
            <span className="flex-1">{label}</span>
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5 border-t border-white/10">
        <NavLink to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive ? 'bg-white/15 text-white' : 'text-purple-200 hover:bg-white/10 hover:text-white'
            }`
          }>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-purple-300 text-xs capitalize">{user?.role}</p>
          </div>
          <Settings size={13} className="opacity-40" />
        </NavLink>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-300 hover:bg-white/10 hover:text-white transition-all duration-200">
          <LogOut size={17} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
