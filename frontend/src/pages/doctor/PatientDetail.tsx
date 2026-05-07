import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Brain, FileText, Pill, Activity, Image,
  AlertTriangle, ChevronDown, ChevronUp, Loader2, Stethoscope, User
} from 'lucide-react'
import { useDoctorStore } from '../../store/doctorStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format } from 'date-fns'

const TABS = [
  { key: 'overview',  label: 'Overview',      icon: User },
  { key: 'vault',     label: 'Medical Vault',  icon: FileText },
  { key: 'ai',        label: 'AI Summary',     icon: Brain },
  { key: 'soap',      label: 'SOAP Notes',     icon: Stethoscope },
  { key: 'rx',        label: 'Prescriptions',  icon: Pill },
]

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const {
    currentPatient, currentPatientVault, soapNotes, prescriptions,
    loadPatient, generateAISummary
  } = useDoctorStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<any>(null)

  useEffect(() => {
    if (patientId) loadPatient(patientId)
  }, [patientId])

  const handleGenerateAI = async () => {
    if (!patientId) return
    setAiLoading(true)
    try {
      const result = await generateAISummary(patientId)
      setAiSummary(result)
      setActiveTab('ai')
    } finally {
      setAiLoading(false)
    }
  }

  if (!currentPatient) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-va-blue animate-spin" />
      </div>
    )
  }

  const p = currentPatient as any

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/doctor/patients')}
          className="p-2 rounded-va hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-va-gray-text" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-va-lavender to-va-mint flex items-center justify-center text-va-charcoal font-bold text-xl">
            {currentPatient.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-va-charcoal dark:text-white">{currentPatient.name}</h1>
            <div className="text-sm text-va-gray-text">
              {p.age ? `${p.age}y · ` : ''}{p.gender}{p.blood_group ? ` · ${p.blood_group}` : ''}
              {p.primary_condition ? ` · ${p.primary_condition}` : ''}
            </div>
          </div>
          {p.risk_level && <VaBadge risk={p.risk_level} />}
        </div>
        <VaButton
          variant="primary"
          icon={aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          onClick={handleGenerateAI}
          disabled={aiLoading}
        >
          {aiLoading ? 'Generating...' : 'AI Summary'}
        </VaButton>
      </div>

      {/* Quick vitals if available */}
      {p.vitals && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Heart Rate',  value: `${p.vitals.heart_rate || '—'} bpm` },
            { label: 'Blood Pressure', value: p.vitals.bp || '—' },
            { label: 'SpO₂',        value: `${p.vitals.spo2 || '—'}%` },
            { label: 'Temperature', value: `${p.vitals.temp || '—'}°F` },
          ].map(({ label, value }) => (
            <VaCard key={label} className="p-3 text-center">
              <div className="text-lg font-bold text-va-charcoal dark:text-white">{value}</div>
              <div className="text-xs text-va-gray-text">{label}</div>
            </VaCard>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-va-gray-light dark:border-dark-border overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === key
                ? 'border-va-blue text-va-blue'
                : 'border-transparent text-va-gray-text hover:text-va-charcoal dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VaCard className="p-5">
                <h3 className="font-semibold mb-3 text-va-charcoal dark:text-white">Patient Information</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ['Full Name',    currentPatient.name],
                    ['Date of Birth',p.date_of_birth ? format(new Date(p.date_of_birth), 'dd MMM yyyy') : '—'],
                    ['Blood Group',  p.blood_group || '—'],
                    ['Phone',        (currentPatient as any).phone || '—'],
                    ['Email',        currentPatient.email || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-va-gray-text">{k}</span>
                      <span className="font-medium text-va-charcoal dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </VaCard>
              <VaCard className="p-5">
                <h3 className="font-semibold mb-3 text-va-charcoal dark:text-white">Medical History</h3>
                <div className="space-y-2 text-sm">
                  {p.allergies?.length > 0 && (
                    <div>
                      <div className="text-va-gray-text text-xs mb-1">Allergies</div>
                      <div className="flex flex-wrap gap-1">
                        {p.allergies.map((a: string) => (
                          <span key={a} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.chronic_conditions?.length > 0 && (
                    <div>
                      <div className="text-va-gray-text text-xs mb-1">Chronic Conditions</div>
                      <div className="flex flex-wrap gap-1">
                        {p.chronic_conditions.map((c: string) => (
                          <span key={c} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {p.current_medications?.length > 0 && (
                    <div>
                      <div className="text-va-gray-text text-xs mb-1">Current Medications</div>
                      <ul className="space-y-0.5">
                        {p.current_medications.map((m: string) => (
                          <li key={m} className="text-xs text-va-charcoal dark:text-white flex items-center gap-1">
                            <Pill className="w-3 h-3 text-va-blue" /> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </VaCard>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-3">
              {currentPatientVault.length === 0 ? (
                <div className="text-center py-12 text-va-gray-text">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <div>No medical files available</div>
                </div>
              ) : (
                currentPatientVault.map(file => (
                  <VaCard key={file.id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-va-gray-light dark:bg-dark-surface rounded-va flex items-center justify-center">
                      <FileText className="w-5 h-5 text-va-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-va-charcoal dark:text-white text-sm">{file.original_name}</div>
                      <div className="text-xs text-va-gray-text">
                        {file.report_type} · {format(new Date(file.uploaded_at), 'dd MMM yyyy')}
                      </div>
                    </div>
                    {file.ai_analysis && <VaBadge risk={file.ai_analysis.risk_level as any} />}
                    <VaButton size="xs" variant="ghost">View</VaButton>
                  </VaCard>
                ))
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              {!aiSummary && !aiLoading ? (
                <div className="text-center py-16">
                  <Brain className="w-14 h-14 mx-auto text-va-purple opacity-30 mb-4" />
                  <h3 className="text-lg font-semibold text-va-charcoal dark:text-white mb-2">AI Patient Summary</h3>
                  <p className="text-va-gray-text text-sm mb-6 max-w-sm mx-auto">
                    Generate a comprehensive Gemini AI analysis of this patient's medical records and history
                  </p>
                  <VaButton variant="primary" icon={<Brain className="w-4 h-4" />} onClick={handleGenerateAI}>
                    Generate AI Summary
                  </VaButton>
                </div>
              ) : aiLoading ? (
                <div className="text-center py-16">
                  <Loader2 className="w-10 h-10 mx-auto text-va-purple animate-spin mb-3" />
                  <div className="text-va-gray-text">Analyzing patient data with Gemini AI...</div>
                </div>
              ) : (
                <VaCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-va-purple" />
                    <h3 className="font-semibold text-va-charcoal dark:text-white">AI Clinical Summary</h3>
                    {aiSummary?.risk_level && <VaBadge risk={aiSummary.risk_level} />}
                  </div>
                  {aiSummary?.summary && (
                    <p className="text-sm text-va-charcoal dark:text-white leading-relaxed mb-4">{aiSummary.summary}</p>
                  )}
                  {aiSummary?.key_findings?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-va-gray-text uppercase tracking-wider mb-2">Key Findings</div>
                      <ul className="space-y-1">
                        {aiSummary.key_findings.map((f: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-va-blue mt-1">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {aiSummary?.recommendations?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-va-gray-text uppercase tracking-wider mb-2">Recommendations</div>
                      <ul className="space-y-1">
                        {aiSummary.recommendations.map((r: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckmarkIcon className="w-3 h-3 text-va-success mt-1 shrink-0" /> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </VaCard>
              )}
            </div>
          )}

          {activeTab === 'soap' && (
            <div className="space-y-3">
              {soapNotes.length === 0 ? (
                <div className="text-center py-12 text-va-gray-text">
                  <Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <div className="mb-3">No SOAP notes yet</div>
                  <VaButton variant="primary" onClick={() => navigate(`/doctor/notes?patient=${patientId}`)}>
                    Create SOAP Note
                  </VaButton>
                </div>
              ) : (
                soapNotes.map(note => (
                  <VaCard key={note.id} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-va-charcoal dark:text-white">{note.visit_type || 'Clinical Visit'}</div>
                      <div className="text-xs text-va-gray-text">{format(new Date(note.created_at), 'dd MMM yyyy')}</div>
                    </div>
                    {['subjective', 'objective', 'assessment', 'plan'].map(field => (
                      (note as any)[field] && (
                        <div key={field} className="mb-2">
                          <div className="text-xs font-bold text-va-gray-text uppercase tracking-wider">{field}</div>
                          <div className="text-sm text-va-charcoal dark:text-white mt-0.5">{(note as any)[field]}</div>
                        </div>
                      )
                    ))}
                  </VaCard>
                ))
              )}
            </div>
          )}

          {activeTab === 'rx' && (
            <div className="space-y-3">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12 text-va-gray-text">
                  <Pill className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <div className="mb-3">No prescriptions yet</div>
                  <VaButton variant="primary" onClick={() => navigate(`/doctor/prescription?patient=${patientId}`)}>
                    Write Prescription
                  </VaButton>
                </div>
              ) : (
                prescriptions.map(rx => (
                  <VaCard key={rx.id} className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-va-charcoal dark:text-white">
                        {format(new Date((rx as any).created_at), 'dd MMM yyyy')}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${(rx as any).is_active ? 'bg-emerald-50 text-va-success' : 'bg-va-gray-light text-va-gray-text'}`}>
                        {(rx as any).is_active ? 'Active' : 'Expired'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {rx.medications?.map((med: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Pill className="w-3 h-3 text-va-blue mt-1 shrink-0" />
                          <div>
                            <span className="font-medium">{med.name}</span>
                            <span className="text-va-gray-text"> · {med.dosage} · {med.frequency} · {med.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </VaCard>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Tiny inline icon to avoid extra import
function CheckmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="6" fill="currentColor" opacity="0.15"/>
      <path d="M3.5 6l1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
