import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Activity, Bed, Users, AlertTriangle, Ambulance, TrendingUp,
  Clock, CheckCircle, XCircle, ArrowRight, Zap, BarChart3
} from 'lucide-react'
import { useHospitalStore } from '../../store/hospitalStore'
import { useAuthStore } from '../../store/authStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format } from 'date-fns'

const StatCard = ({
  icon: Icon, label, value, sub, color, onClick
}: {
  icon: any; label: string; value: string | number; sub?: string
  color: string; onClick?: () => void
}) => (
  <motion.div
    whileHover={{ y: -3 }}
    onClick={onClick}
    className={onClick ? 'cursor-pointer' : ''}
  >
    <VaCard className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-va ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        {onClick && <ArrowRight className="w-4 h-4 text-va-gray-text" />}
      </div>
      <div className="text-2xl font-bold text-va-charcoal dark:text-white">{value}</div>
      <div className="text-sm text-va-gray-text mt-0.5">{label}</div>
      {sub && <div className="text-xs text-va-blue mt-1">{sub}</div>}
    </VaCard>
  </motion.div>
)

export default function HospitalDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { overview, emergencyAlerts, beds, loadOverview, loadEmergencyAlerts, loadBeds, acceptEmergency } = useHospitalStore()

  useEffect(() => {
    loadOverview()
    loadEmergencyAlerts()
    loadBeds()
  }, [])

  const ov = overview
  const totalBeds = beds.length
  const availableBeds = beds.filter(b => b.status === 'available').length
  const occupancyPct = totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0
  const activeAlerts = emergencyAlerts.filter(a => a.status === 'incoming' || a.status === 'accepted')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white">
            Hospital Command Center
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">
            {format(new Date(), 'EEEE, d MMMM yyyy')} · Real-time operations overview
          </p>
        </div>
        <VaButton variant="primary" icon={<Zap className="w-4 h-4" />} onClick={() => navigate('/hospital/emergency')}>
          Emergency Center
        </VaButton>
      </div>

      {/* Active Emergency Alerts */}
      {activeAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-va-emergency bg-opacity-10 border border-va-emergency border-opacity-30 rounded-va p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-va-emergency rounded-full animate-pulse" />
            <span className="font-semibold text-va-emergency text-sm">
              {activeAlerts.length} ACTIVE EMERGENCY ALERT{activeAlerts.length > 1 ? 'S' : ''}
            </span>
          </div>
          <div className="space-y-2">
            {activeAlerts.slice(0, 3).map(alert => (
              <div key={alert.id} className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-3">
                <div>
                  <div className="font-medium text-sm text-va-charcoal dark:text-white">{alert.patient_name}</div>
                  <div className="text-xs text-va-gray-text">{alert.ai_triage?.condition || 'Emergency'} · ETA {alert.ambulance_eta_minutes || '—'} min</div>
                </div>
                <div className="flex items-center gap-2">
                  <VaBadge status={alert.status === 'incoming' ? 'incoming' : 'accepted'} />
                  {alert.status === 'incoming' && (
                    <VaButton size="xs" variant="danger" onClick={() => acceptEmergency(alert.id)}>
                      Accept
                    </VaButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          {activeAlerts.length > 3 && (
            <button onClick={() => navigate('/hospital/emergency')} className="text-va-emergency text-xs mt-2 hover:underline">
              View all {activeAlerts.length} alerts →
            </button>
          )}
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Bed} label="Beds Available" color="bg-va-blue"
          value={`${availableBeds}/${totalBeds}`}
          sub={`${occupancyPct}% occupied`}
          onClick={() => navigate('/hospital/beds')}
        />
        <StatCard
          icon={AlertTriangle} label="Active Emergencies" color="bg-va-emergency"
          value={activeAlerts.length}
          sub={activeAlerts.length > 0 ? 'Needs attention' : 'All clear'}
          onClick={() => navigate('/hospital/emergency')}
        />
        <StatCard
          icon={Users} label="Total Doctors" color="bg-va-success"
          value={ov?.total_doctors ?? '—'}
          sub="On duty today"
          onClick={() => navigate('/hospital/doctors')}
        />
        <StatCard
          icon={Activity} label="Patients Today" color="bg-va-purple"
          value={ov?.patients_today ?? '—'}
          sub="Admitted today"
          onClick={() => navigate('/hospital/patients')}
        />
      </div>

      {/* Bed Occupancy Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VaCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-va-charcoal dark:text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-va-blue" /> Bed Status Overview
            </h2>
            <VaButton size="xs" variant="ghost" onClick={() => navigate('/hospital/beds')}>
              Manage Beds →
            </VaButton>
          </div>

          {/* Occupancy Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-va-gray-text mb-1">
              <span>Occupancy</span>
              <span>{occupancyPct}%</span>
            </div>
            <div className="h-3 bg-va-gray-light dark:bg-dark-border rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${occupancyPct > 85 ? 'bg-va-emergency' : occupancyPct > 70 ? 'bg-va-warning' : 'bg-va-success'}`}
                initial={{ width: 0 }}
                animate={{ width: `${occupancyPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Bed Grid */}
          <div className="grid grid-cols-10 gap-1.5">
            {beds.slice(0, 50).map((bed, i) => (
              <div
                key={bed.id || i}
                title={`Bed ${bed.bed_number} · ${bed.ward} · ${bed.status}`}
                className={`h-6 rounded cursor-pointer transition-all hover:scale-110 ${
                  bed.status === 'available' ? 'bg-emerald-400' :
                  bed.status === 'occupied'  ? 'bg-va-blue' :
                  bed.status === 'reserved'  ? 'bg-va-warning' :
                                               'bg-va-gray-light'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-va-gray-text">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded" />Available</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-va-blue rounded" />Occupied</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-va-warning rounded" />Reserved</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-va-gray-light rounded" />Maintenance</span>
          </div>
        </VaCard>

        {/* Quick Stats Panel */}
        <VaCard className="p-5">
          <h2 className="font-semibold text-va-charcoal dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-va-blue" /> Today's Metrics
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Admissions', value: ov?.admissions_today ?? 0, icon: TrendingUp, color: 'text-va-success' },
              { label: 'Discharges',  value: ov?.discharges_today  ?? 0, icon: CheckCircle, color: 'text-va-blue' },
              { label: 'Surgeries',   value: ov?.surgeries_today   ?? 0, icon: Activity, color: 'text-va-purple' },
              { label: 'Emergencies', value: emergencyAlerts.length,     icon: AlertTriangle, color: 'text-va-emergency' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-va-gray-text text-sm">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </div>
                <span className={`font-bold text-lg ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-va-gray-light dark:border-dark-border">
            <div className="text-xs text-va-gray-text mb-2">Avg. Wait Time</div>
            <div className="text-2xl font-bold text-va-charcoal dark:text-white">
              {ov?.avg_wait_minutes ?? 24} <span className="text-sm font-normal text-va-gray-text">min</span>
            </div>
          </div>
        </VaCard>
      </div>

      {/* Recent Emergency Alerts Table */}
      <VaCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-va-charcoal dark:text-white flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-va-emergency" /> Recent Emergency Alerts
          </h2>
          <VaButton size="xs" variant="ghost" onClick={() => navigate('/hospital/emergency')}>
            Full Center →
          </VaButton>
        </div>

        {emergencyAlerts.length === 0 ? (
          <div className="text-center py-8 text-va-gray-text">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-va-success opacity-50" />
            <div className="text-sm">No emergency alerts</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-va-gray-text text-xs border-b border-va-gray-light dark:border-dark-border">
                  <th className="text-left pb-2 font-medium">Patient</th>
                  <th className="text-left pb-2 font-medium">Condition</th>
                  <th className="text-left pb-2 font-medium">ETA</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">Time</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-va-gray-light dark:divide-dark-border">
                {emergencyAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors">
                    <td className="py-3 font-medium text-va-charcoal dark:text-white">{alert.patient_name}</td>
                    <td className="py-3 text-va-gray-text">{alert.ai_triage?.condition || 'Unknown'}</td>
                    <td className="py-3 text-va-charcoal dark:text-white">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-va-gray-text" />
                        {alert.ambulance_eta_minutes ?? '—'} min
                      </span>
                    </td>
                    <td className="py-3">
                      <VaBadge status={alert.status as any} />
                    </td>
                    <td className="py-3 text-va-gray-text text-xs">
                      {format(new Date(alert.created_at), 'HH:mm')}
                    </td>
                    <td className="py-3">
                      {alert.status === 'incoming' && (
                        <VaButton size="xs" variant="danger" onClick={() => acceptEmergency(alert.id)}>
                          Accept
                        </VaButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </VaCard>
    </div>
  )
}
