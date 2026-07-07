export default function StatCard({ title, value, subtitle, icon, gradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 leading-none">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: gradient || 'linear-gradient(135deg, #7c3aed22, #7c3aed44)' }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
