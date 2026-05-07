import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Ambulance, Phone, MapPin, Clock, User,
  CheckCircle, XCircle, Zap, Activity, ChevronDown, ChevronUp
} from 'lucide-react'
import { useHospitalStore } from '../../store/hospitalStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format } from 'date-fns'
import type { EmergencyAlert } from '../../types/hospital.types'

const SEVERITY_CONFIG = {
  critical: { label: 'CRITICAL', classes: 'bg-red-100 text-red-700 border-red-300', bar: 'bg-va-emergency' },
  high:     { label: 'HIGH',     classes: 'bg-orange-100 text-orange-700 border-orange-300', bar: 'bg-orange-500' },
  medium:   { label: 'MEDIUM',  classes: 'bg-amber-100 text-amber-700 border-amber-300', bar: 'bg-va-warning' },
  low:      { label: 'LOW',     classes: 'bg-emerald-100 text-emerald-700 border-emerald-300', bar: 'bg-va-success' },
}

function AlertCard({ alert, onAccept }: { alert: EmergencyAlert; onAccept: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const sev = (alert.ai_triage?.severity || 'high') as keyof typeof SEVERITY_CONFIG
  const cfg = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.high
  const isIncoming = alert.status === 'incoming'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border-l-4 ${isIncoming ? 'border-va-emergency' : 'border-va-blue'} bg-white dark:bg-dark-card rounded-r-va shadow-va-card overflow-hidden`}
    >
      {/* Top bar for critical */}
      {sev === 'critical' && isIncoming && (
        <div className="bg-va-emergency bg-opacity-10 border-b border-va-emergency border-opacity-20 px-4 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 bg-va-emergency rounded-full animate-pulse" />
          <span className="text-va-emergency text-xs font-bold tracking-wider">CRITICAL — IMMEDIATE RESPONSE REQUIRED</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.classes}`}>
                {cfg.label}
              </span>
              <VaBadge status={alert.status as any} />
              {alert.ambulance_eta_minutes != null && (
                <span className="text-xs text-va-gray-text flex items-center gap-1">
                  <Clock className="w-3 h-3" /> ETA {alert.ambulance_eta_minutes} min
                </span>
              )}
            </div>
            <div className="font-semibold text-va-charcoal dark:text-white">{alert.patient_name}</div>
            <div className="text-sm text-va-gray-text">{alert.ai_triage?.condition || 'Condition unknown'}</div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-xs text-va-gray-text">
              {format(new Date(alert.created_at), 'HH:mm:ss')}
            </div>
            {isIncoming && (
              <VaButton size="sm" variant="danger" icon={<CheckCircle className="w-3 h-3" />} onClick={() => onAccept(alert.id)}>
                Accept
              </VaButton>
            )}
          </div>
        </div>

        {/* Triage summary */}
        {alert.ai_triage && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-va-gray-text">
            {alert.ai_triage.heart_rate && <span>HR: <strong>{alert.ai_triage.heart_rate}</strong> bpm</span>}
            {alert.ai_triage.bp && <span>BP: <strong>{alert.ai_triage.bp}</strong></span>}
            {alert.ai_triage.spo2 && <span>SpO₂: <strong>{alert.ai_triage.spo2}%</strong></span>}
            {alert.ai_triage.specialist_required && <span>Specialist: <strong>{alert.ai_triage.specialist_required}</strong></span>}
          </div>
        )}

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-va-blue text-xs flex items-center gap-1 hover:underline"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Less details' : 'More details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-va-gray-light dark:border-dark-border grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-va-gray-text mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </div>
                  <div className="font-mono text-xs">
                    {alert.location ? `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}` : 'Not available'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-va-gray-text mb-1 flex items-center gap-1">
                    <Ambulance className="w-3 h-3" /> Ambulance
                  </div>
                  <div className="text-xs">{alert.ambulance_id || 'Not assigned'}</div>
                </div>
                {alert.ai_triage?.summary && (
                  <div className="col-span-2">
                    <div className="text-xs text-va-gray-text mb-1">AI Triage Summary</div>
                    <div className="text-xs text-va-charcoal dark:text-white bg-va-gray-light dark:bg-dark-surface rounded p-2">
                      {alert.ai_triage.summary}
                    </div>
                  </div>
                )}
                {alert.ai_triage?.preparation_needed && (
                  <div className="col-span-2">
                    <div className="text-xs text-va-gray-text mb-1">Preparation Needed</div>
                    <ul className="text-xs space-y-0.5">
                      {alert.ai_triage.preparation_needed.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-va-warning">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function EmergencyCenter() {
  const { emergencyAlerts, loadEmergencyAlerts, acceptEmergency } = useHospitalStore()
  const [filter, setFilter] = useState<'all' | 'incoming' | 'accepted' | 'resolved'>('all')

  useEffect(() => {
    loadEmergencyAlerts()
    const interval = setInterval(loadEmergencyAlerts, 15000) // refresh every 15s
    return () => clearInterval(interval)
  }, [])

  const filtered = emergencyAlerts.filter(a => filter === 'all' || a.status === filter)
  const counts = {
    all:      emergencyAlerts.length,
    incoming: emergencyAlerts.filter(a => a.status === 'incoming').length,
    accepted: emergencyAlerts.filter(a => a.status === 'accepted').length,
    resolved: emergencyAlerts.filter(a => a.status === 'resolved').length,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-va-emergency" /> Emergency Center
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">Live emergency management · Auto-refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-2">
          {counts.incoming > 0 && (
            <div className="flex items-center gap-1 bg-va-emergency bg-opacity-10 border border-va-emergency border-opacity-30 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-va-emergency rounded-full animate-pulse" />
              <span className="text-va-emergency text-sm font-semibold">{counts.incoming} incoming</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'incoming', label: 'Incoming', color: 'text-va-emergency', bg: 'bg-va-emergency' },
          { key: 'accepted', label: 'Accepted', color: 'text-va-blue',      bg: 'bg-va-blue' },
          { key: 'resolved', label: 'Resolved', color: 'text-va-success',   bg: 'bg-va-success' },
        ].map(({ key, label, color, bg }) => (
          <VaCard key={key} className="p-4 text-center">
            <div className={`text-3xl font-bold ${color}`}>{counts[key as keyof typeof counts]}</div>
            <div className="text-sm text-va-gray-text">{label}</div>
            <div className={`h-1 rounded-full ${bg} bg-opacity-30 mt-2`}>
              <div
                className={`h-1 rounded-full ${bg}`}
                style={{ width: `${counts.all > 0 ? (counts[key as keyof typeof counts] / counts.all) * 100 : 0}%` }}
              />
            </div>
          </VaCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'incoming', 'accepted', 'resolved'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === tab
                ? 'bg-va-blue text-white shadow-va-glow-blue'
                : 'bg-va-gray-light dark:bg-dark-surface text-va-gray-text hover:bg-va-blue hover:bg-opacity-10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <CheckCircle className="w-12 h-12 mx-auto text-va-success opacity-40 mb-3" />
              <div className="text-va-gray-text">No {filter !== 'all' ? filter : ''} emergencies</div>
            </motion.div>
          ) : (
            filtered.map(alert => (
              <AlertCard key={alert.id} alert={alert} onAccept={acceptEmergency} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
