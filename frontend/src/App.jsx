import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

// Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import MyReports from './pages/member/MyReports'
import ReportForm from './pages/member/ReportForm'
import Dashboard from './pages/manager/Dashboard'
import TeamReports from './pages/manager/TeamReports'
import UsersPage from './pages/manager/Users'
import Projects from './pages/Projects'
import Profile from './pages/Profile'

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'manager' ? '/dashboard' : '/my-reports'} replace />
  }
  return <Layout>{children}</Layout>
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
  if (user) return <Navigate to={user.role === 'manager' ? '/dashboard' : '/my-reports'} replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  )

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Member */}
      <Route path="/my-reports" element={<PrivateRoute roles={['member']}><MyReports /></PrivateRoute>} />
      <Route path="/my-reports/new" element={<PrivateRoute roles={['member']}><ReportForm /></PrivateRoute>} />
      <Route path="/my-reports/edit/:id" element={<PrivateRoute roles={['member']}><ReportForm /></PrivateRoute>} />

      {/* Manager */}
      <Route path="/dashboard" element={<PrivateRoute roles={['manager']}><Dashboard /></PrivateRoute>} />
      <Route path="/team-reports" element={<PrivateRoute roles={['manager']}><TeamReports /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute roles={['manager']}><UsersPage /></PrivateRoute>} />

      {/* Shared */}
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Default */}
      <Route path="/" element={
        !user ? <Navigate to="/login" replace /> :
        user.role === 'manager' ? <Navigate to="/dashboard" replace /> :
        <Navigate to="/my-reports" replace />
      } />
      <Route path="*" element={
        !user ? <Navigate to="/login" replace /> :
        user.role === 'manager' ? <Navigate to="/dashboard" replace /> :
        <Navigate to="/my-reports" replace />
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
