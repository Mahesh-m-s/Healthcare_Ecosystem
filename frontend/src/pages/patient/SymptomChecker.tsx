import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, AlertTriangle, CheckCircle2, Clock, ChevronRight, Loader2 } from 'lucide-react'
import apiClient from '../../api/client'
import { useAuthStore } from '../../store/authStore'
import type { Patient } from '../../types/user.types'

const BODY_AREAS = ['Head','Chest','Abdomen','Back','Left Arm','Right Arm','Left Leg','Right Leg','Neck','Throat','Eyes','Skin']
const DURATIONS  = ['Just started','A few hours','1-2 days','3-7 days','More than a week','More than a month']

interface SymptomResult {
  emergencyLevel: 'EMERGENCY'|'URGENT'|'NON_URGENT'|'SELF_CARE'
  emergencyAction: string|null
  possibleConditions: Array<{condition:string; probability:string; explanation:string}>
  specialistNeeded: string
  homeCareAdvice: string[]|null
  warningSigns: string[]
  disclaimer: string
}

const LEVEL_CONFIG = {
  EMERGENCY:  { color:'bg-red-50 border-red-200', text:'text-[#FF4B4B]', label:'🚨 EMERGENCY', desc:'Call ambulance immediately' },
  URGENT:     { color:'bg-orange-50 border-orange-200', text:'text-orange-600', label:'⚠️ URGENT', desc:'See a doctor today' },
  NON_URGENT: { color:'bg-amber-50 border-amber-200', text:'text-amber-600', label:'⏱ NON-URGENT', desc:'Book appointment within 2-3 days' },
  SELF_CARE:  { color:'bg-green-50 border-green-200', text:'text-green-600', label:'✅ SELF-CARE', desc:'Home remedies may help' },
}

export default function SymptomChecker() {
  const { user } = useAuthStore()
  const patient = user as Patient|null
  const [symptoms, setSymptoms]   = useState('')
  const [bodyArea, setBodyArea]   = useState('')
  const [duration, setDuration]   = useState('')
  const [severity, setSeverity]   = useState(5)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<SymptomResult|null>(null)
  const [error, setError]         = useState('')

  const handleCheck = async () => {
    if (!symptoms.trim()) { setError('Please describe your symptoms'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await apiClient.post('/ai/symptom-check', {
        symptoms, body_area: bodyArea, duration, severity,
        patient_context: {
          age: patient?.dateOfBirth ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / 3.156e10) : null,
          sex: patient?.sex, blood_group: patient?.bloodGroup,
          conditions: patient?.chronicConditions, medications: patient?.currentMedications,
        }
      })
      setResult(data)
    } catch { setError('AI analysis failed. Please try again.') }
    setLoading(false)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2">
          <Brain className="w-5 h-5 text-pink-500" /> AI Symptom Checker
        </h1>
        <p className="text-sm text-[#7B7B7B] mt-0.5">Describe your symptoms — AI will assess severity and suggest next steps</p>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-1.5">Describe your symptoms *</label>
          <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3}
            placeholder="e.g. I have a sharp chest pain that started 2 hours ago, radiating to my left arm..."
            className="w-full px-4 py-3 bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl text-sm text-[#2C2C2C] placeholder-[#7B7B7B] focus:outline-none focus:border-[#4F8CFF] resize-none transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#2C2C2C] mb-1.5">Affected Body Area</label>
            <div className="flex flex-wrap gap-1.5">
              {BODY_AREAS.map(a => (
                <button key={a} onClick={() => setBodyArea(bodyArea === a ? '' : a)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${bodyArea === a ? 'bg-pink-500 text-white border-pink-500' : 'bg-[#F8F8F8] text-[#7B7B7B] border-[#EAEAEA] hover:border-pink-300'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-1.5">Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#4F8CFF]">
                <option value="">Select duration</option>
                {DURATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C2C2C] mb-1.5">
                Severity: <span className={`font-black ${severity >= 8 ? 'text-[#FF4B4B]' : severity >= 5 ? 'text-amber-500' : 'text-green-500'}`}>{severity}/10</span>
              </label>
              <input type="range" min="1" max="10" value={severity} onChange={e => setSeverity(+e.target.value)}
                className="w-full h-2 bg-[#EAEAEA] rounded-full appearance-none cursor-pointer accent-[#4F8CFF]" />
              <div className="flex justify-between text-[10px] text-[#7B7B7B] mt-1"><span>Mild</span><span>Moderate</span><span>Severe</span></div>
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-[#FF4B4B] flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}

        <motion.button whileTap={{ scale:0.97 }} onClick={handleCheck} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-pink-500 text-white rounded-xl font-bold text-sm hover:bg-pink-600 transition-all shadow-[0_0_16px_rgba(236,72,153,0.3)] disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing symptoms...</> : <><Send className="w-4 h-4" /> Check with AI</>}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="space-y-4">
            {/* Level banner */}
            {(() => {
              const cfg = LEVEL_CONFIG[result.emergencyLevel]
              return (
                <div className={`${cfg.color} border-2 rounded-2xl p-5`}>
                  <p className={`text-lg font-black ${cfg.text}`}>{cfg.label}</p>
                  <p className={`text-sm font-semibold ${cfg.text} mt-0.5`}>{cfg.desc}</p>
                  {result.emergencyAction && (
                    <a href="tel:112" className="inline-flex items-center gap-2 mt-3 bg-[#FF4B4B] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-500">
                      <AlertTriangle className="w-4 h-4" /> {result.emergencyAction}
                    </a>
                  )}
                </div>
              )
            })()}

            {/* Possible conditions */}
            <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <h3 className="text-sm font-bold text-[#2C2C2C] mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-pink-500" /> Possible Conditions</h3>
              <div className="space-y-3">
                {result.possibleConditions.map((c,i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${
                      c.probability==='HIGH' ? 'bg-red-50 text-red-700 border-red-200' :
                      c.probability==='MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'}`}>{c.probability}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#2C2C2C]">{c.condition}</p>
                      <p className="text-xs text-[#7B7B7B] mt-0.5">{c.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialist + Warning signs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#D9EDF7] rounded-2xl p-4">
                <p className="text-xs font-bold text-[#4F8CFF] uppercase tracking-wide">Recommended Specialist</p>
                <p className="text-base font-black text-[#2C2C2C] mt-1">{result.specialistNeeded}</p>
                <a href="/patient/hospitals" className="text-xs text-[#4F8CFF] font-medium flex items-center gap-0.5 mt-2 hover:underline">
                  Find nearby <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              {result.warningSigns.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-2"><AlertTriangle className="w-3.5 h-3.5" /> Warning Signs</p>
                  {result.warningSigns.map((s,i) => <p key={i} className="text-xs text-amber-700 py-0.5">• {s}</p>)}
                </div>
              )}
            </div>

            {/* Home care */}
            {result.homeCareAdvice && result.homeCareAdvice.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <h3 className="text-sm font-bold text-[#2C2C2C] mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Home Care Advice</h3>
                {result.homeCareAdvice.map((a,i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1.5">
                    <span className="w-5 h-5 bg-green-50 text-green-600 rounded-full text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span>
                    <p className="text-sm text-[#7B7B7B]">{a}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[10px] text-[#7B7B7B] italic text-center px-4">{result.disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
