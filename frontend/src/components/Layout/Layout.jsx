import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import ChatWidget from '../ai/ChatWidget'

export default function Layout({ children }) {
  const { user } = useAuth()
  const { dark } = useTheme()

  const bgColor = dark ? '#0d0820' : '#EEE9FF'
  const blob1   = dark ? 'rgba(124,58,237,0.12)' : '#c4b5fd'
  const blob2   = dark ? 'rgba(91,33,182,0.10)'  : '#ddd6fe'
  const blob3   = dark ? 'rgba(109,40,217,0.08)' : '#ede9fe'
  const dotColor= dark ? '#7c3aed' : '#7c3aed'

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: bgColor }}>
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: bgColor }}>

        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <style>{`
            @keyframes blobFloat1 {
              0%,100%{transform:translate(0,0) scale(1)}
              33%{transform:translate(20px,-30px) scale(1.05)}
              66%{transform:translate(-15px,15px) scale(0.97)}
            }
            @keyframes blobFloat2 {
              0%,100%{transform:translate(0,0) scale(1)}
              33%{transform:translate(-25px,20px) scale(1.04)}
              66%{transform:translate(18px,-20px) scale(0.96)}
            }
            @keyframes blobFloat3 {
              0%,100%{transform:translate(0,0) scale(1)}
              50%{transform:translate(15px,25px) scale(1.06)}
            }
            .blob1{animation:blobFloat1 12s ease-in-out infinite}
            .blob2{animation:blobFloat2 15s ease-in-out infinite}
            .blob3{animation:blobFloat3 10s ease-in-out infinite}
          `}</style>

          <div className="blob1 absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl"
            style={{ background:`radial-gradient(circle,${blob1},transparent)`, opacity: dark ? 0.6 : 0.4 }} />
          <div className="blob2 absolute -bottom-20 -left-10 w-80 h-80 rounded-full blur-3xl"
            style={{ background:`radial-gradient(circle,${blob2},transparent)`, opacity: dark ? 0.5 : 0.3 }} />
          <div className="blob3 absolute top-1/2 right-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ background:`radial-gradient(circle,${blob3},transparent)`, opacity: dark ? 0.4 : 0.2 }} />

          {/* Dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            opacity: dark ? 0.06 : 0.04,
          }} />
        </div>

        <div className="relative z-10 p-7 animate-fadeIn max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {user?.role === 'manager' && <ChatWidget />}
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
          background: dark ? '#1e1535' : '#ffffff',
          color: dark ? '#e2d9ff' : '#111827',
          border: dark ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(0,0,0,0.06)',
        }
      }} />
    </div>
  )
}
