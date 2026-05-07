import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, MapPin, Clock, Phone, User, CheckCircle2,
  Navigation, Ambulance, Heart, ChevronRight, PhoneCall
} from 'lucide-react'
import { format } from 'date-fns'
import { useEmergencyStore } from '../../store/emergencyStore'
import { usePatientStore } from '../../store/patientStore'
import { EMERGENCY_PHONE, EMERGENCY_STATUS } from '../../config/constants'
import SOSButton from '../../components/emergency/SOSButton'
import type { EmergencyContact } from '../../types/medical.types'

const STEPS = ['INITIATED','AMBULANCE_DISPATCHED','IN_TRANSIT','ARRIVED','ADMITTED'] as const
const STEP_LABELS: Record<string, string> = {
  INITIATED: 'Emergency Triggered', AMBULANCE_DISPATCHED: 'Ambulance Dispatched',
  IN_TRANSIT: 'En Route to Hospital', ARRIVED: 'Arrived at Hospital', ADMITTED: 'Patient Admitted'
}
const STEP_ICONS: Record<string, typeof AlertTriangle> = {
  INITIATED: AlertTriangle, AMBULANCE_DISPATCHED: Ambulance,
  IN_TRANSIT: Navigation, ARRIVED: MapPin, ADMITTED: CheckCircle2
}

export default function EmergencyPage() {
  const { activeEmergency, nearbyHospitals, ambulanceLocation, loadNearbyHospitals, getCurrentLocation } = useEmergencyStore()
  const { emergencyContacts, loadEmergencyContacts } = usePatientStore()

  useEffect(() => {
    loadEmergencyContacts()
    getCurrentLocation().then(loc => { if (loc) loadNearbyHospitals(loc.lat, loc.lng) })
  }, [])

  const currentStep = activeEmergency
    ? STEPS.indexOf(activeEmergency.status as typeof STEPS[number])
    : -1

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#FF4B4B]" /> Emergency Center
        </h1>
        <p className="text-sm text-[#7B7B7B] mt-0.5">
          {activeEmergency ? 'Emergency in progress — help is on the way' : 'Ready to respond — press SOS if you need emergency help'}
        </p>
      </div>

      {/* Active Emergency Tracker */}
      <AnimatePresence>
        {activeEmergency && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
            className="bg-white rounded-2xl border-2 border-[#FF4B4B] shadow-[0_0_32px_rgba(255,75,75,0.15)] overflow-hidden">
            <div className="bg-[#FF4B4B] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale:[1,1.2,1] }} transition={{ repeat:Infinity, duration:1 }}
                  className="w-2.5 h-2.5 bg-white rounded-full" />
                <span className="text-white text-sm font-bold">EMERGENCY ACTIVE</span>
              </div>
              <span className="text-white/80 text-xs">{format(new Date(activeEmergency.triggeredAt),'HH:mm:ss')}</span>
            </div>

            <div className="p-5 space-y-5">
              {/* Progress stepper */}
              <div>
                <div className="flex items-center gap-0">
                  {STEPS.map((step, i) => {
                    const Icon = STEP_ICONS[step] ?? AlertTriangle
                    const done = i <= currentStep
                    const active = i === currentStep
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <motion.div animate={active ? { scale:[1,1.15,1] } : {}} transition={{ repeat:Infinity, duration:1.5 }}
                            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                              done ? 'bg-[#FF4B4B] border-[#FF4B4B]' : 'bg-white border-[#EAEAEA]'}`}>
                            <Icon className={`w-4 h-4 ${done ? 'text-white' : 'text-[#EAEAEA]'}`} />
                          </motion.div>
                          <p className={`text-[9px] mt-1 text-center leading-tight max-w-[60px] ${done ? 'text-[#FF4B4B] font-semibold' : 'text-[#EAEAEA]'}`}>
                            {STEP_LABELS[step]}
                          </p>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? 'bg-[#FF4B4B]' : 'bg-[#EAEAEA]'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hospital assigned */}
              {activeEmergency.assignedHospital && (
                <div className="bg-[#F8F8F8] rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FF4B4B] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#7B7B7B] uppercase tracking-wide">Assigned Hospital</p>
                    <p className="text-sm font-bold text-[#2C2C2C] mt-0.5">{activeEmergency.assignedHospital.name}</p>
                    <p className="text-xs text-[#7B7B7B]">{activeEmergency.assignedHospital.address}</p>
                  </div>
                  <a href={`tel:${activeEmergency.assignedHospital.phone}`}
                    className="flex items-center gap-1.5 bg-[#FF4B4B] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              )}

              {/* Ambulance info */}
              {activeEmergency.ambulance && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                  <Ambulance className="w-5 h-5 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-amber-700">Ambulance {activeEmergency.ambulance.unitId}</p>
                    <p className="text-sm font-semibold text-[#2C2C2C]">{activeEmergency.ambulance.driverName}</p>
                  </div>
                  <a href={`tel:${activeEmergency.ambulance.driverPhone}`}
                    className="flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    <PhoneCall className="w-3.5 h-3.5" /> Call Driver
                  </a>
                </div>
              )}

              {/* AI Triage */}
              {activeEmergency.aiTriageData && (
                <div className={`rounded-xl p-4 border ${
                  activeEmergency.aiTriageData.triageColor === 'RED' ? 'bg-red-50 border-red-200' :
                  activeEmergency.aiTriageData.triageColor === 'ORANGE' ? 'bg-orange-50 border-orange-200' :
                  'bg-yellow-50 border-yellow-200'}`}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{
                    color: activeEmergency.aiTriageData.triageColor === 'RED' ? '#DC2626' :
                           activeEmergency.aiTriageData.triageColor === 'ORANGE' ? '#EA580C' : '#CA8A04'
                  }}>
                    AI Triage — {activeEmergency.aiTriageData.triageColor}
                  </p>
                  <p className="text-sm font-semibold text-[#2C2C2C]">{activeEmergency.aiTriageData.probableEmergency}</p>
                  <p className="text-xs text-[#7B7B7B] mt-1">{activeEmergency.aiTriageData.criticalInfo}</p>
                  {activeEmergency.aiTriageData.immediateActions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {activeEmergency.aiTriageData.immediateActions.map((a,i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <span className="font-bold text-[#FF4B4B] shrink-0">{i+1}.</span> {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS panel (shown when no active emergency) */}
      {!activeEmergency && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] p-8 flex flex-col items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <SOSButton />
          </div>
          <div className="space-y-3">
            <a href={`tel:${EMERGENCY_PHONE}`}
              className="flex items-center gap-4 bg-[#FF4B4B] text-white rounded-2xl p-4 hover:bg-red-500 transition-all shadow-[0_0_24px_rgba(255,75,75,0.3)]">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-lg">{EMERGENCY_PHONE}</p>
                <p className="text-xs text-white/80">National Emergency Number</p>
              </div>
            </a>
            {nearbyHospitals.slice(0,3).map(h => (
              <div key={h.placeId} className="bg-white rounded-2xl border border-[#EAEAEA] p-4 flex items-center gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#2C2C2C] truncate">{h.name}</p>
                  <p className="text-xs text-[#7B7B7B]">{h.distanceKm?.toFixed(1)} km away</p>
                </div>
                {h.etaMinutes && (
                  <div className="flex items-center gap-1 text-xs font-bold text-[#4F8CFF] shrink-0">
                    <Clock className="w-3 h-3" />{h.etaMinutes}m
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="px-5 py-4 border-b border-[#EAEAEA]">
          <h2 className="text-sm font-bold text-[#2C2C2C] flex items-center gap-2">
            <User className="w-4 h-4 text-[#4F8CFF]" /> Emergency Contacts
          </h2>
          <p className="text-xs text-[#7B7B7B] mt-0.5">These contacts are auto-alerted when SOS is triggered</p>
        </div>
        {emergencyContacts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[#7B7B7B]">No emergency contacts added yet</p>
            <a href="/patient/profile" className="text-xs text-[#4F8CFF] mt-1.5 block hover:underline">Add contacts in profile →</a>
          </div>
        ) : (
          <div className="divide-y divide-[#F8F8F8]">
            {emergencyContacts.map((c: EmergencyContact) => (
              <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#DCD6F7] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-indigo-600">{c.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2C2C2C]">{c.name}</p>
                  <p className="text-xs text-[#7B7B7B]">{c.relation} · {c.phone}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {c.notifySms && <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">SMS</span>}
                  {c.notifyEmail && <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 font-medium">Email</span>}
                  <a href={`tel:${c.phone}`} className="p-1.5 text-[#7B7B7B] hover:text-[#4F8CFF]"><Phone className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
