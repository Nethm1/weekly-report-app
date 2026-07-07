import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatWeekRange = (start, end) => {
  if (!start || !end) return ''
  return `${format(new Date(start), 'MMM dd')} - ${format(new Date(end), 'MMM dd, yyyy')}`
}

export const getCurrentWeek = () => {
  const now = new Date()
  const start = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(now, { weekStartsOn: 1 })     // Sunday
  return { weekStart: start, weekEnd: end }
}

export const getWeekOptions = (count = 12) => {
  const weeks = []
  for (let i = 0; i < count; i++) {
    const now = new Date()
    const start = startOfWeek(addWeeks(now, -i), { weekStartsOn: 1 })
    const end = endOfWeek(addWeeks(now, -i), { weekStartsOn: 1 })
    weeks.push({
      label: i === 0 ? `This week (${formatWeekRange(start, end)})` : formatWeekRange(start, end),
      weekStart: start.toISOString(),
      weekEnd: end.toISOString(),
    })
  }
  return weeks
}

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'submitted': return 'badge-submitted'
    case 'draft': return 'badge-draft'
    case 'pending': return 'badge-pending'
    default: return 'badge-pending'
  }
}
