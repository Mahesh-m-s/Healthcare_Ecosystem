import { motion } from 'framer-motion'

interface Props {
  label: string; value: string | number; unit?: string
  icon: string; normal?: boolean; trend?: 'up' | 'down' | 'stable'
  color?: string
}

export default function VitalCard({ label, value, unit, icon, normal = true, trend, color }: Props) {
  const statusColor = normal ? 'text-va-success' : 'text-va-emergency'
  const bg = normal ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'

  return (
    <motion.div whileHover={{ scale: 1.02 }} className={`rounded-va border p-4 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        {trend && (
          <span className={`text-xs ${trend === 'up' ? 'text-va-emergency' : trend === 'down' ? 'text-va-blue' : 'text-va-success'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div className={`text-xl font-bold ${color || statusColor}`}>
        {value}{unit && <span className="text-sm font-normal ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs text-va-gray-text mt-0.5">{label}</div>
    </motion.div>
  )
}
