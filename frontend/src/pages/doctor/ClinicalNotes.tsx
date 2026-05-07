import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, Brain, CheckCircle, Loader2, FileText } from 'lucide-react'
import { useDoctorStore } from '../../store/doctorStore'
import VaCard from '../../components/common/VaCard'
import VaButton from '../../components/common/VaButton'
import toast from 'react-hot-toast'
import { apiClient } from '../../api/client'

const VISIT_TYPES = ['Follow-up', 'Initial Consultation', 'Emergency', 'Post-op', 'Routine Check-up', 'Teleconsult']

export default function ClinicalNotes() {
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patient') || ''
  const { submitSOAPNote, assignedPatients } = useDoctorStore()
  const patient = assignedPatients.find(p => p.id === patientId)

  const [form, setForm] = useState({
    visitType: 'Follow-up', subjective: '', objective: '',
    assessment: '', plan: '', followUp: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiExpanding, setAiExpanding] = useState<string | null>(null)

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const aiExpand = async (field: 'subjective' | 'objective' | 'assessment' | 'plan') => {
    if (!form[field].trim()) { toast.error('Enter some text first'); return }
    setAiExpanding(field)
    try {
      const r = await apiClient.post('/ai/expand-soap', {
        field, content: form[field], patient_id: patientId
      })
      set(field, r.data.expanded || form[field])
    } catch {
      toast.error('AI expansion failed')
    } finally {
      setAiExpanding(null)
    }
  }

  const handleSubmit = async () => {
    if (!patientId) { toast.error('No patient selected'); return }
    if (!form.subjective.trim() || !form.assessment.trim()) {
      toast.error('Subjective and Assessment are required'); return
    }
    setSubmitting(true)
    try {
      await submitSOAPNote(patientId, {
        visit_type: form.visitType,
        subjective: form.subjective,
        objective:  form.objective,
        assessment: form.assessment,
        plan:       form.plan,
        follow_up:  form.followUp,
      })
      setSubmitted(true)
    } catch {
      toast.error('Failed to save note')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <CheckCircle className="w-16 h-16 text-va-success mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold text-va-charcoal dark:text-white mb-2">SOAP Note Saved</h2>
        <p className="text-va-gray-text mb-6">Clinical note has been saved to patient records.</p>
        <VaButton variant="primary" onClick={() => { setSubmitted(false); setForm({ visitType: 'Follow-up', subjective: '', objective: '', assessment: '', plan: '', followUp: '' }) }}>
          New Note
        </VaButton>
      </div>
    )
  }

  const SOAPField = ({
    label, field, placeholder, required = false
  }: { label: string; field: 'subjective' | 'objective' | 'assessment' | 'plan'; placeholder: string; required?: boolean }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-va-charcoal dark:text-white">
          {label} {required && <span className="text-va-emergency">*</span>}
        </label>
        <button
          onClick={() => aiExpand(field)}
          disabled={!!aiExpanding}
          className="flex items-center gap-1 text-xs text-va-purple hover:underline disabled:opacity-50"
        >
          {aiExpanding === field ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Brain className="w-3 h-3" />
          )}
          AI Expand
        </button>
      </div>
      <textarea
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue resize-none"
      />
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-va-blue" /> Clinical Notes (SOAP)
        </h1>
        {patient && (
          <p className="text-va-gray-text text-sm mt-0.5">Patient: <strong className="text-va-charcoal dark:text-white">{patient.name}</strong></p>
        )}
      </div>

      {/* Visit type */}
      <VaCard className="p-5">
        <label className="block text-sm font-medium text-va-charcoal dark:text-white mb-2">Visit Type</label>
        <div className="flex flex-wrap gap-2">
          {VISIT_TYPES.map(vt => (
            <button
              key={vt}
              onClick={() => set('visitType', vt)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                form.visitType === vt
                  ? 'bg-va-blue text-white'
                  : 'bg-va-gray-light dark:bg-dark-surface text-va-gray-text hover:bg-va-blue hover:bg-opacity-10'
              }`}
            >
              {vt}
            </button>
          ))}
        </div>
      </VaCard>

      {/* SOAP Fields */}
      <VaCard className="p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-va-purple" />
          <span className="text-xs text-va-gray-text">AI can expand your notes — write bullet points and let Gemini structure them</span>
        </div>
        <SOAPField
          label="S — Subjective" field="subjective" required
          placeholder="Chief complaint, patient's description of symptoms, history of present illness..."
        />
        <SOAPField
          label="O — Objective" field="objective"
          placeholder="Vital signs, physical examination findings, lab results, imaging..."
        />
        <SOAPField
          label="A — Assessment" field="assessment" required
          placeholder="Diagnosis / differential diagnosis, clinical impression..."
        />
        <SOAPField
          label="P — Plan" field="plan"
          placeholder="Treatment plan, medications, referrals, patient education, follow-up..."
        />
        <div>
          <label className="text-sm font-semibold text-va-charcoal dark:text-white block mb-2">Follow-up Date</label>
          <input
            type="date"
            value={form.followUp}
            onChange={e => set('followUp', e.target.value)}
            className="px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
          />
        </div>
      </VaCard>

      <VaButton
        variant="primary"
        icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full justify-center"
      >
        {submitting ? 'Saving...' : 'Save SOAP Note'}
      </VaButton>
    </div>
  )
}
