import { clsx } from 'clsx'
import { RISK_CONFIG, type RiskLevel } from '../../config/constants'

interface VaBadgeProps {
  type?: 'risk' | 'status' | 'role' | 'custom'
  riskLevel?: RiskLevel
  label?: string
  className?: string
  dot?: boolean
  pulse?: boolean
}

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  occupied:  'bg-red-50     text-red-700     border-red-200',
  reserved:  'bg-amber-50   text-amber-700   border-amber-200',
  scheduled: 'bg-blue-50    text-blue-700    border-blue-200',
  completed: 'bg-gray-50    text-gray-600    border-gray-200',
  cancelled: 'bg-red-50     text-red-600     border-red-200',
  patient:   'bg-va-lavender text-indigo-700 border-indigo-200',
  hospital:  'bg-va-mint    text-emerald-700 border-emerald-200',
  doctor:    'bg-va-lime    text-lime-700    border-lime-200',
}

export default function VaBadge({ type = 'status', riskLevel, label, className, dot, pulse }: VaBadgeProps) {
  const riskCfg = riskLevel ? RISK_CONFIG[riskLevel] : null
  const classes = riskCfg?.classes ?? (label ? STATUS_COLORS[label.toLowerCase()] ?? 'bg-gray-50 text-gray-600 border-gray-200' : '')

  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', classes, className)}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full', pulse && 'animate-pulse-slow')} style={{ background: riskCfg?.dot ?? 'currentColor' }} />
      )}
      {riskLevel ? RISK_CONFIG[riskLevel].label : label}
    </span>
  )
}
