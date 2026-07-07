import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Users, Shield, UserCheck } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const { data } = await api.patch(`/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.data.role } : u))
      toast.success('Role updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role')
    } finally {
      setUpdating(null) }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-400 text-sm mt-1">Manage team members and their roles</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-violet-600" />
          <span className="font-semibold text-gray-900">{users.length} Users</span>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No users found</p>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                    {u.department && <p className="text-xs text-gray-400">{u.department}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                    u.role === 'manager' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role === 'manager' ? <Shield size={11} /> : <UserCheck size={11} />}
                    {u.role}
                  </span>
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    disabled={updating === u._id}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
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
  )
}
