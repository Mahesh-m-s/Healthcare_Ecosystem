import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Emergency } from '../../types/emergency.types'

interface Props { emergency: Emergency | null; onDismiss?: () => void }

export default function EmergencyAlertBanner({ emergency, onDismiss }: Props) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {emergency && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-va-emergency text-white px-4 py-2.5 flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <AlertTriangle className="w-4 h-4 animate-pulse shrink-0" />
              <span className="text-sm font-medium">
                Emergency Active — {emergency.status.replace('_', ' ').toUpperCase()}
                {emergency.eta_minutes != null && ` · Ambulance ETA ${emergency.eta_minutes} min`}
              </span>
            </div>
            <button
              onClick={() => navigate('/patient/emergency')}
              className="flex items-center gap-1 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-3 py-1 transition-colors"
            >
              Track <ArrowRight className="w-3 h-3" />
            </button>
            {onDismiss && (
              <button onClick={onDismiss} className="text-white text-opacity-70 hover:text-opacity-100">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
