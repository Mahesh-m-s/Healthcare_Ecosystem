import { create } from 'zustand'
import apiClient from '../api/client'
import type { Patient } from '../types/user.types'
import type { SOAPNote, Prescription, MedicalFile, AIAnalysis } from '../types/medical.types'
import toast from 'react-hot-toast'

interface PatientWithSummary extends Patient {
  assignmentId: string
  lastVisit?: string
  pendingActions?: number
  aiSummary?: DoctorAIResult
}

interface DoctorAIResult {
  patientSummary: string
  keyRiskFlags: string[]
  differentialDiagnosis: Array<{ condition: string; likelihood: string; rationale: string }>
  suggestedInvestigations: string[]
  drugInteractionsToWatch: string[]
  soapNoteDraft: { subjective: string; objective: string; assessment: string; plan: string }
  icd10Suggestions: Array<{ code: string; description: string }>
}

interface DoctorState {
  assignedPatients: PatientWithSummary[]
  currentPatient: PatientWithSummary | null
  currentPatientVault: MedicalFile[]
  currentPatientAnalyses: Record<string, AIAnalysis>
  soapNotes: SOAPNote[]
  prescriptions: Prescription[]
  isLoadingAI: boolean
  isLoadingPatient: boolean

  loadAssignedPatients: () => Promise<void>
  loadPatient: (patientId: string) => Promise<void>
  generateAISummary: (patientId: string) => Promise<void>
  submitSOAPNote: (patientId: string, note: Omit<SOAPNote, 'id' | 'createdAt'>) => Promise<void>
  writePrescription: (patientId: string, rx: Omit<Prescription, 'id'>) => Promise<void>
  updatePatientAISummary: (patientId: string, summary: DoctorAIResult) => void
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  assignedPatients: [], currentPatient: null,
  currentPatientVault: [], currentPatientAnalyses: {},
  soapNotes: [], prescriptions: [],
  isLoadingAI: false, isLoadingPatient: false,

  loadAssignedPatients: async () => {
    const { data } = await apiClient.get('/doctors/patients')
    set({ assignedPatients: data.patients })
  },

  loadPatient: async (patientId) => {
    set({ isLoadingPatient: true })
    try {
      const [patientRes, vaultRes, notesRes] = await Promise.all([
        apiClient.get(`/doctors/patients/${patientId}`),
        apiClient.get(`/doctors/patients/${patientId}/records`),
        apiClient.get(`/doctors/patients/${patientId}/notes`),
      ])
      set({
        currentPatient: patientRes.data.patient,
        currentPatientVault: vaultRes.data.files,
        soapNotes: notesRes.data.notes,
        isLoadingPatient: false,
      })
    } catch { set({ isLoadingPatient: false }) }
  },

  generateAISummary: async (patientId) => {
    set({ isLoadingAI: true })
    try {
      const { data } = await apiClient.post(`/ai/doctor-assist/${patientId}`, {})
      set((s) => ({
        currentPatient: s.currentPatient ? { ...s.currentPatient, aiSummary: data } : null,
        isLoadingAI: false,
      }))
    } catch {
      set({ isLoadingAI: false })
      toast.error('AI assistant failed. Please try again.')
    }
  },

  submitSOAPNote: async (patientId, note) => {
    const { data } = await apiClient.post(`/doctors/patients/${patientId}/notes`, note)
    set((s) => ({ soapNotes: [data.note, ...s.soapNotes] }))
    toast.success('Clinical note saved and shared with patient')
  },

  writePrescription: async (patientId, rx) => {
    const { data } = await apiClient.post(`/doctors/patients/${patientId}/prescription`, rx)
    set((s) => ({ prescriptions: [data.prescription, ...s.prescriptions] }))
    toast.success('Prescription saved — sent to patient vault')
  },

  updatePatientAISummary: (patientId, summary) => {
    set((s) => ({
      assignedPatients: s.assignedPatients.map((p) =>
        p.id === patientId ? { ...p, aiSummary: summary } : p
      ),
    }))
  },
}))
