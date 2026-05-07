import { RISK_CONFIG } from '../../config/constants'
import type { RiskLevel } from '../../config/constants'

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  )
}
