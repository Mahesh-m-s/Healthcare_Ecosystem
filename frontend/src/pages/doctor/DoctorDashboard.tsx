import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users, FileText, Calendar, Activity, Clock, ArrowRight,
  Stethoscope, Brain, AlertTriangle, CheckCircle, TrendingUp
} from 'lucide-react'
import { useDoctorStore } from '../../store/doctorStore'
import { useAuthStore } from '../../store/authStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format } from 'date-fns'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { assignedPatients, loadAssignedPatients } = useDoctorStore()

  useEffect(() => { loadAssignedPatients() }, [])

  const criticalPatients = assignedPatients.filter(p => (p as any).risk_level === 'CRITICAL')
  const pendingReports   = assignedPatients.filter(p => (p as any).pending_reports > 0)
  const todayAppointments = assignedPatients.filter(p => (p as any).appointment_today)

  const stats = [
    { label: 'Total Patients', value: assignedPatients.length, icon: Users,     color: 'text-va-blue',      bg: 'bg-blue-50',     path: '/doctor/patients' },
    { label: 'Critical',       value: criticalPatients.length, icon: AlertTriangle, color: 'text-va-emergency', bg: 'bg-red-50',   path: '/doctor/patients' },
    { label: 'Pending Reports',value: pendingReports.length,   icon: FileText,   color: 'text-va-warning',   bg: 'bg-amber-50',    path: '/doctor/patients' },
    { label: "Today's Slots",  value: todayAppointments.length,icon: Calendar,   color: 'text-va-success',   bg: 'bg-emerald-50',  path: '/doctor/schedule' },
  ]

  const doctor = user as any

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-va-blue to-va-purple rounded-va-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-opacity-80 text-sm mb-1">Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},</div>
            <h1 className="text-2xl font-bold">Dr. {user?.name || 'Doctor'}</h1>
            <div className="text-white text-opacity-70 text-sm mt-1">
              {doctor?.specialization || 'General Physician'} · {format(new Date(), 'EEEE, d MMMM')}
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <VaButton
            size="sm"
            variant="secondary"
            className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
            onClick={() => navigate('/doctor/patients')}
          >
            My Patients
          </VaButton>
          <VaButton
            size="sm"
            variant="secondary"
            className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
            onClick={() => navigate('/doctor/schedule')}
          >
            My Schedule
          </VaButton>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, path }) => (
          <motion.div key={label} whileHover={{ y: -3 }}>
            <VaCard className="p-5 cursor-pointer" onClick={() => navigate(path)}>
              <div className={`w-10 h-10 rounded-va ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-va-gray-text mt-0.5">{label}</div>
            </VaCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Patients */}
        <VaCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-va-charcoal dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-va-emergency" /> Critical & High-Risk Patients
            </h2>
            <VaButton size="xs" variant="ghost" onClick={() => navigate('/doctor/patients')}>
              All Patients →
            </VaButton>
          </div>

          {assignedPatients.length === 0 ? (
            <div className="text-center py-8 text-va-gray-text">
              <CheckCircle className="w-10 h-10 mx-auto mb-2 text-va-success opacity-40" />
              <div className="text-sm">No critical patients</div>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedPatients.slice(0, 6).map(patient => {
                const p = patient as any
                return (
                  <div
                    key={patient.id}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                    className="flex items-center gap-3 p-3 rounded-va hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-va-lavender to-va-blue-light flex items-center justify-center text-va-charcoal font-bold shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-va-charcoal dark:text-white text-sm">{patient.name}</div>
                      <div className="text-xs text-va-gray-text">
                        {p.age ? `${p.age}y · ` : ''}{p.primary_condition || 'Under observation'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.risk_level && <VaBadge risk={p.risk_level} />}
                      {p.pending_reports > 0 && (
                        <span className="text-xs bg-va-warning text-white px-1.5 py-0.5 rounded-full">
                          {p.pending_reports} reports
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-va-gray-text" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </VaCard>

        {/* AI Quick Actions */}
        <VaCard className="p-5">
          <h2 className="font-semibold text-va-charcoal dark:text-white mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 text-va-purple" /> AI Tools
          </h2>
          <div className="space-y-3">
            {[
              { icon: Brain,     label: 'AI Patient Summary',    sub: 'Generate for any patient',  color: 'text-va-purple', bg: 'bg-purple-50', path: '/doctor/patients' },
              { icon: FileText,  label: 'Clinical Notes',         sub: 'SOAP-structured notes',    color: 'text-va-blue',   bg: 'bg-blue-50',   path: '/doctor/notes' },
              { icon: Activity,  label: 'Prescription Writer',    sub: 'AI-assisted prescription', color: 'text-va-success',bg: 'bg-emerald-50',path: '/doctor/prescription' },
              { icon: Stethoscope,label:'AI Assistant',           sub: 'Ask about any patient',    color: 'text-va-warning',bg: 'bg-amber-50',  path: '/doctor/ai' },
            ].map(({ icon: Icon, label, sub, color, bg, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 p-3 rounded-va hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-va ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-va-charcoal dark:text-white">{label}</div>
                  <div className="text-xs text-va-gray-text">{sub}</div>
                </div>
                <ArrowRight className="w-3 h-3 text-va-gray-text ml-auto" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-va-gray-light dark:border-dark-border">
            <div className="text-xs text-va-gray-text mb-1">AI Powered by</div>
            <div className="text-sm font-semibold text-va-charcoal dark:text-white">Google Gemini 2.0</div>
          </div>
        </VaCard>
      </div>
    </div>
  )
}
