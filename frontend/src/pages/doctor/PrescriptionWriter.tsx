import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Pill, Plus, Trash2, Brain, Printer, CheckCircle, Loader2 } from 'lucide-react'
import { useDoctorStore } from '../../store/doctorStore'
import VaCard from '../../components/common/VaCard'
import VaButton from '../../components/common/VaButton'
import toast from 'react-hot-toast'

interface Medication {
  id: string; name: string; dosage: string
  frequency: string; duration: string; instructions: string
}

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'As needed', 'At bedtime']
const DURATION_OPTIONS  = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '3 months', 'Ongoing']

export default function PrescriptionWriter() {
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patient') || ''
  const { writePrescription, assignedPatients } = useDoctorStore()

  const patient = assignedPatients.find(p => p.id === patientId)

  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: 'Twice daily', duration: '7 days', instructions: '' }
  ])
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const addMedication = () => {
    setMedications(prev => [...prev, {
      id: Date.now().toString(), name: '', dosage: '',
      frequency: 'Once daily', duration: '7 days', instructions: ''
    }])
  }

  const removeMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id))
  }

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const handleSubmit = async () => {
    if (!patientId) { toast.error('No patient selected'); return }
    const valid = medications.every(m => m.name.trim() && m.dosage.trim())
    if (!valid) { toast.error('Please fill in medication name and dosage'); return }
    setSubmitting(true)
    try {
      await writePrescription(patientId, { medications, diagnosis, notes, follow_up_date: followUp })
      setSubmitted(true)
    } catch {
      toast.error('Failed to save prescription')
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
        <h2 className="text-xl font-bold text-va-charcoal dark:text-white mb-2">Prescription Saved</h2>
        <p className="text-va-gray-text mb-6">The prescription has been saved and is visible to the patient.</p>
        <div className="flex gap-3">
          <VaButton variant="ghost" icon={<Printer className="w-4 h-4" />}>Print</VaButton>
          <VaButton variant="primary" onClick={() => setSubmitted(false)}>New Prescription</VaButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Pill className="w-6 h-6 text-va-blue" /> Prescription Writer
          </h1>
          {patient && (
            <p className="text-va-gray-text text-sm mt-0.5">Writing for: <strong className="text-va-charcoal dark:text-white">{patient.name}</strong></p>
          )}
        </div>
      </div>

      {/* Diagnosis */}
      <VaCard className="p-5">
        <label className="block text-sm font-medium text-va-charcoal dark:text-white mb-2">Diagnosis / Chief Complaint</label>
        <input
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder="e.g., Acute pharyngitis, Type 2 Diabetes follow-up..."
          className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        />
      </VaCard>

      {/* Medications */}
      <VaCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-va-charcoal dark:text-white flex items-center gap-2">
            <Pill className="w-4 h-4 text-va-blue" /> Medications
          </h3>
          <VaButton size="xs" variant="ghost" icon={<Plus className="w-3 h-3" />} onClick={addMedication}>
            Add Medication
          </VaButton>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {medications.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border border-va-gray-light dark:border-dark-border rounded-va p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-va-gray-text uppercase tracking-wider">
                    Medication {i + 1}
                  </span>
                  {medications.length > 1 && (
                    <button onClick={() => removeMedication(med.id)} className="text-va-emergency hover:opacity-70">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-va-gray-text mb-1 block">Drug Name *</label>
                    <input
                      value={med.name}
                      onChange={e => updateMedication(med.id, 'name', e.target.value)}
                      placeholder="e.g., Amoxicillin 500mg"
                      className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-va-gray-text mb-1 block">Dosage *</label>
                    <input
                      value={med.dosage}
                      onChange={e => updateMedication(med.id, 'dosage', e.target.value)}
                      placeholder="e.g., 1 tablet"
                      className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-va-gray-text mb-1 block">Frequency</label>
                    <select
                      value={med.frequency}
                      onChange={e => updateMedication(med.id, 'frequency', e.target.value)}
                      className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                    >
                      {FREQUENCY_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-va-gray-text mb-1 block">Duration</label>
                    <select
                      value={med.duration}
                      onChange={e => updateMedication(med.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                    >
                      {DURATION_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-va-gray-text mb-1 block">Instructions</label>
                    <input
                      value={med.instructions}
                      onChange={e => updateMedication(med.id, 'instructions', e.target.value)}
                      placeholder="e.g., After food with water"
                      className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </VaCard>

      {/* Notes & Follow-up */}
      <VaCard className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-va-charcoal dark:text-white mb-2">Additional Notes / Advice</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Rest for 3 days, avoid cold drinks, drink plenty of fluids..."
            className="w-full px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-va-charcoal dark:text-white mb-2">Follow-up Date</label>
          <input
            type="date"
            value={followUp}
            onChange={e => setFollowUp(e.target.value)}
            className="px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
          />
        </div>
      </VaCard>

      {/* Actions */}
      <div className="flex gap-3">
        <VaButton variant="ghost" icon={<Printer className="w-4 h-4" />}>Preview</VaButton>
        <VaButton
          variant="primary"
          icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1"
        >
          {submitting ? 'Saving...' : 'Save Prescription'}
        </VaButton>
      </div>
    </div>
  )
}
