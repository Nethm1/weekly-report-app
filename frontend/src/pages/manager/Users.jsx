import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Users, Shield, UserCheck } from 'lucide-react'

const GRADIENTS = [
  ['#7c3aed','#5b21b6'],['#0284c7','#0369a1'],['#059669','#047857'],
  ['#d97706','#b45309'],['#db2777','#be185d'],['#6366f1','#4f46e5'],
]

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const { data } = await api.patch(`/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.data.role } : u))
      toast.success('Role updated')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setUpdating(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">Team Members</h1>
        <p className="page-subtitle">Manage roles and access levels</p>
      </div>

      <div className="page-section animate-cardIn">
        <div className="gradient-strip" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} className="text-violet-600" />
            <span className="font-black text-gray-900 dark:text-white">{users.length} Users</span>
          </div>

          {users.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No users found</p>
          ) : (
            <div className="space-y-3">
              {users.map((u, i) => (
                <div key={u._id} className="flex items-center justify-between p-4 rounded-xl animate-cardIn"
                  style={{ animationDelay: `${i*0.05}s`, background: 'linear-gradient(135deg,rgba(139,92,246,0.05),rgba(96,165,250,0.03))', border: '1px solid rgba(139,92,246,0.10)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
                      style={{ background: `linear-gradient(135deg,${GRADIENTS[i%GRADIENTS.length][0]},${GRADIENTS[i%GRADIENTS.length][1]})`, boxShadow: '0 3px 10px rgba(0,0,0,0.15)' }}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                      {u.department && <p className="text-xs text-gray-400">{u.department}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      u.role === 'manager'
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {u.role === 'manager' ? <Shield size={10}/> : <UserCheck size={10}/>}
                      {u.role}
                    </span>
                    <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                      disabled={updating === u._id}
                      className="text-xs border border-gray-200 dark:border-gray-600 rounded-xl px-2.5 py-1.5 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
