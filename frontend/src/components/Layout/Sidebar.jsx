import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, FileText, FolderOpen, Users, LogOut,
  BarChart2, ChevronRight, UserCircle
} from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
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
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #7C3AED 0%, #5B21B6 100%)' }}>

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BarChart2 size={19} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">WeeklyReport</p>
            <p className="text-violet-200 text-xs">Team Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Menu</p>
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/25 text-white'
                  : 'text-violet-100 hover:bg-white/15 hover:text-white'
              }`
            }>
            {icon}
            <span>{label}</span>
            <ChevronRight size={13} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/20 space-y-1">
        <NavLink to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive ? 'bg-white/25 text-white' : 'text-violet-100 hover:bg-white/15 hover:text-white'
            }`
          }>
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate">{user?.name}</p>
            <p className="text-violet-300 text-xs capitalize">{user?.role}</p>
          </div>
          <UserCircle size={14} className="opacity-50" />
        </NavLink>

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-200 hover:bg-white/15 hover:text-white transition-all duration-200">
          <LogOut size={17} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
