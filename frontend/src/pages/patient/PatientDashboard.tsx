import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderHeart, Brain, MapPin, Shield, Calendar,
  TrendingUp, Clock, ChevronRight, AlertCircle,
  Heart, Pill, FileText, Stethoscope, Activity
} from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '../../store/authStore'
import { usePatientStore } from '../../store/patientStore'
import { useEmergencyStore } from '../../store/emergencyStore'
import type { Patient } from '../../types/user.types'
import SOSButton from '../../components/emergency/SOSButton'
import { RISK_CONFIG } from '../../config/constants'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay }
})

export default function PatientDashboard() {
  const { user }              = useAuthStore()
  const { vault, analyses, loadVault, loadAppointments, appointments } = usePatientStore()
  const { loadNearbyHospitals, nearbyHospitals }                       = useEmergencyStore()
  const navigate              = useNavigate()
  const patient               = user as Patient | null

  useEffect(() => {
    loadVault()
    loadAppointments()
    navigator.geolocation?.getCurrentPosition(
      (p) => loadNearbyHospitals(p.coords.latitude, p.coords.longitude),
      () => {}
    )
  }, [])

  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening'

  const criticalFiles  = vault.filter(f => analyses[f.fileUuid]?.result?.riskLevel === 'CRITICAL')
  const recentAnalyses = Object.values(analyses).filter(a => a.status === 'completed').slice(0, 3)
  const nextAppt       = appointments.find(a => a.status === 'scheduled')
  const pendingCount   = vault.filter(f => ['pending','processing'].includes(f.analysisStatus ?? '')).length

  const quickActions = [
    { icon: FolderHeart, label: 'Upload Report',    desc: 'MRI, Blood, CT scans',  to: '/patient/vault',     color: 'bg-[#DCD6F7]', iconColor: 'text-indigo-600' },
    { icon: Brain,       label: 'Symptom Check',    desc: 'AI-powered triage',     to: '/patient/symptoms',  color: 'bg-pink-50',   iconColor: 'text-pink-600'   },
    { icon: MapPin,      label: 'Find Hospital',    desc: 'Nearby with beds',      to: '/patient/hospitals', color: 'bg-[#DDEEE8]', iconColor: 'text-emerald-600'},
    { icon: Shield,      label: 'Insurance AI',     desc: 'Check coverage',        to: '/patient/insurance', color: 'bg-[#E7EDB8]', iconColor: 'text-lime-700'   },
  ]

  const healthCards = [
    { label: 'Blood Group',   value: patient?.bloodGroup ?? '–',          icon: Heart,     color: 'text-red-500',    bg: 'bg-red-50'    },
    { label: 'Reports',       value: vault.length,                        icon: FileText,  color: 'text-blue-500',   bg: 'bg-blue-50'   },
    { label: 'Prescriptions', value: '–',                                 icon: Pill,      color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Conditions',    value: patient?.chronicConditions?.length ?? 0, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── CRITICAL ALERT BANNER ── */}
      {criticalFiles.length > 0 && (
        <motion.div {...fadeUp(0)}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 cursor-pointer shadow-[0_0_24px_rgba(255,75,75,0.15)]"
          onClick={() => navigate('/patient/vault')}>
          <AlertCircle className="w-5 h-5 text-[#FF4B4B] mt-0.5 animate-pulse shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#FF4B4B]">Critical Risk Detected in {criticalFiles.length} report{criticalFiles.length > 1 ? 's' : ''}</p>
            <p className="text-xs text-red-600 mt-0.5">AI has flagged critical health indicators. Please consult a doctor immediately.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#FF4B4B] ml-auto shrink-0 mt-0.5" />
        </motion.div>
      )}

      {/* ── GREETING + SOS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Greeting card */}
        <motion.div {...fadeUp(0.05)} className="lg:col-span-2 bg-gradient-to-br from-[#4F8CFF] to-[#7C3AED] rounded-2xl p-6 text-white shadow-[0_8px_32px_rgba(79,140,255,0.3)]">
          <p className="text-sm text-white/70 font-medium">{greeting},</p>
          <h1 className="text-2xl font-black mt-0.5">{patient?.fullName?.split(' ')[0] ?? 'Patient'} 👋</h1>
          <p className="text-sm text-white/70 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>

          <div className="flex flex-wrap gap-3 mt-5">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold">
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                AI analyzing {pendingCount} file{pendingCount > 1 ? 's' : ''}
              </div>
            )}
            {nextAppt && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                Next: {nextAppt.doctorName} · {format(new Date(nextAppt.appointmentDate), 'MMM d')}
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5" />
              {vault.length} reports in vault
            </div>
          </div>

          {/* Health score bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>Health Score</span><span>72/100</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1.2, delay: 0.5 }} />
            </div>
          </div>
        </motion.div>

        {/* SOS panel */}
        <motion.div {...fadeUp(0.1)} className="bg-white rounded-2xl p-5 border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center gap-4">
          <SOSButton />
        </motion.div>
      </div>

      {/* ── HEALTH OVERVIEW CARDS ── */}
      <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {healthCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <p className="text-xl font-black text-[#2C2C2C]">{value}</p>
            <p className="text-xs text-[#7B7B7B] mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div {...fadeUp(0.2)}>
        <h2 className="text-base font-bold text-[#2C2C2C] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(({ icon: Icon, label, desc, to, color, iconColor }) => (
            <motion.div key={label} whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl p-4 border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_8px_32px_rgba(79,140,255,0.12)] transition-all">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-sm font-bold text-[#2C2C2C]">{label}</p>
              <p className="text-xs text-[#7B7B7B] mt-0.5">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── BOTTOM ROW: Recent Analyses + Nearby Hospitals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent AI Analyses */}
        <motion.div {...fadeUp(0.25)} className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAEA]">
            <h2 className="text-sm font-bold text-[#2C2C2C] flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-500" /> AI Analyses
            </h2>
            <button onClick={() => navigate('/patient/vault')} className="text-xs text-[#4F8CFF] font-medium hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#F8F8F8]">
            {recentAnalyses.length === 0 ? (
              <div className="p-8 text-center text-[#7B7B7B]">
                <FolderHeart className="w-10 h-10 mx-auto mb-2 text-[#EAEAEA]" />
                <p className="text-sm font-medium">No analyses yet</p>
                <p className="text-xs mt-1">Upload a report to get AI analysis</p>
              </div>
            ) : recentAnalyses.map((a) => {
              const risk = a.result?.riskLevel
              const cfg  = risk ? RISK_CONFIG[risk] : null
              return (
                <div key={a.analysisUuid} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#F8F8F8] cursor-pointer transition-colors" onClick={() => navigate('/patient/vault')}>
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2C2C2C] truncate">{a.result?.reportType ?? 'Report'}</p>
                    <p className="text-xs text-[#7B7B7B] truncate mt-0.5">{a.result?.specialistRecommendation}</p>
                  </div>
                  {cfg && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.classes} shrink-0`}>
                      {risk}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Nearby Hospitals */}
        <motion.div {...fadeUp(0.3)} className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAEA]">
            <h2 className="text-sm font-bold text-[#2C2C2C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" /> Nearby Hospitals
            </h2>
            <button onClick={() => navigate('/patient/hospitals')} className="text-xs text-[#4F8CFF] font-medium hover:underline flex items-center gap-0.5">
              View map <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#F8F8F8]">
            {nearbyHospitals.length === 0 ? (
              <div className="p-8 text-center text-[#7B7B7B]">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-[#EAEAEA]" />
                <p className="text-sm font-medium">Enable location</p>
                <p className="text-xs mt-1">Allow access to see nearby hospitals</p>
              </div>
            ) : nearbyHospitals.slice(0, 4).map((h) => (
              <div key={h.placeId} className="px-5 py-3.5 flex items-center gap-3 hover:bg-[#F8F8F8] cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2C2C2C] truncate">{h.name}</p>
                  <p className="text-xs text-[#7B7B7B] truncate mt-0.5">{h.address}</p>
                </div>
                {h.etaMinutes && (
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#4F8CFF]">
                      <Clock className="w-3 h-3" />{h.etaMinutes}m
                    </div>
                    <p className="text-[10px] text-[#7B7B7B]">{h.distanceKm?.toFixed(1)} km</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── ALLERGIES WARNING ── */}
      {(patient?.allergies?.length ?? 0) > 0 && (
        <motion.div {...fadeUp(0.35)} className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-700">Known Allergies on File</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {patient!.allergies.map((a) => (
                  <span key={a} className="text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-full px-2.5 py-0.5 font-medium">{a}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
