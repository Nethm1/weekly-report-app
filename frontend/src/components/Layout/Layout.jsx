import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import ChatWidget from '../ai/ChatWidget'

export default function Layout({ children }) {
  const { user } = useAuth()
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
      {user?.role === 'manager' && <ChatWidget />}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  )
}
