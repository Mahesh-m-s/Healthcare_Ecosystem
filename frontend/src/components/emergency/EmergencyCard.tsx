import { MapPin, Clock, AlertTriangle, Navigation } from 'lucide-react'
import { format } from 'date-fns'
import VaBadge from '../common/VaBadge'
import type { Emergency } from '../../types/emergency.types'

export default function EmergencyCard({ emergency }: { emergency: Emergency }) {
  const e = emergency as any
  return (
    <div className="bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-va-emergency" />
            <span className="font-semibold text-va-charcoal dark:text-white text-sm">Emergency</span>
            <VaBadge status={emergency.status as any} />
          </div>
          {e.ai_triage?.condition && (
            <div className="text-sm text-va-gray-text">{e.ai_triage.condition}</div>
          )}
        </div>
        <div className="text-xs text-va-gray-text">{format(new Date(e.triggered_at || Date.now()), 'dd MMM · HH:mm')}</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-va-gray-text">
        {emergency.eta_minutes != null && (
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />ETA {emergency.eta_minutes} min</span>
        )}
        {emergency.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />{emergency.location.lat.toFixed(3)}, {emergency.location.lng.toFixed(3)}
          </span>
        )}
        {e.hospital_name && (
          <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{e.hospital_name}</span>
        )}
      </div>
    </div>
  )
}
