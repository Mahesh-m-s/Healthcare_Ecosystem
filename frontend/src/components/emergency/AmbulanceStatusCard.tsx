import { motion } from 'framer-motion'
import { Ambulance, Clock, Phone, MapPin, Navigation } from 'lucide-react'
import VaButton from '../common/VaButton'
import type { Emergency } from '../../types/emergency.types'

interface Props { emergency: Emergency }

const STATUS_STEPS = ['triggered', 'dispatched', 'en_route', 'arrived', 'resolved']

export default function AmbulanceStatusCard({ emergency }: Props) {
  const currentStep = STATUS_STEPS.indexOf(emergency.status)

  return (
    <div className="bg-white dark:bg-dark-card border-2 border-va-emergency border-opacity-30 rounded-va-lg p-5 shadow-va-emergency">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-va-emergency rounded-full animate-pulse" />
          <span className="font-bold text-va-emergency">EMERGENCY ACTIVE</span>
        </div>
        <span className="text-xs text-va-gray-text">ID: {emergency.id.slice(-6).toUpperCase()}</span>
      </div>

      {/* Status timeline */}
      <div className="flex items-center gap-0 mb-5">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 ${
              i < currentStep  ? 'bg-va-success border-va-success text-white' :
              i === currentStep ? 'bg-va-emergency border-va-emergency text-white animate-pulse' :
                                  'bg-white border-va-gray-light text-va-gray-text'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < currentStep ? 'bg-va-success' : 'bg-va-gray-light'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-va-gray-text mb-4 px-0.5">
        {STATUS_STEPS.map(s => <span key={s} className="capitalize">{s.replace('_', ' ')}</span>)}
      </div>

      {/* Ambulance info */}
      {emergency.ambulance_id && (
        <div className="bg-va-gray-light dark:bg-dark-surface rounded-va p-3 mb-4">
          <div className="flex items-center gap-3">
            <Ambulance className="w-8 h-8 text-va-emergency shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-va-charcoal dark:text-white">Ambulance {emergency.ambulance_id}</div>
              <div className="flex items-center gap-3 text-xs text-va-gray-text mt-0.5">
                {emergency.eta_minutes != null && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ETA {emergency.eta_minutes} min
                  </span>
                )}
                {(emergency as any).ambulance_driver && (
                  <span>Driver: {(emergency as any).ambulance_driver}</span>
                )}
              </div>
            </div>
            {(emergency as any).driver_phone && (
              <a href={`tel:${(emergency as any).driver_phone}`}>
                <VaButton size="xs" variant="danger" icon={<Phone className="w-3 h-3" />}>
                  Call
                </VaButton>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Hospital info */}
      {(emergency as any).hospital_name && (
        <div className="flex items-center gap-2 text-sm text-va-gray-text">
          <Navigation className="w-4 h-4 text-va-blue shrink-0" />
          <span>Heading to: <strong className="text-va-charcoal dark:text-white">{(emergency as any).hospital_name}</strong></span>
        </div>
      )}
    </div>
  )
}
