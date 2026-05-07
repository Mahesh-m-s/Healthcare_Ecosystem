import { create } from 'zustand'
import apiClient from '../api/client'
import type { MedicalFile, AIAnalysis, Appointment, EmergencyContact } from '../types/medical.types'
import type { ReportType } from '../config/constants'
import toast from 'react-hot-toast'

interface PatientState {
  vault: MedicalFile[]
  analyses: Record<string, AIAnalysis>
  appointments: Appointment[]
  emergencyContacts: EmergencyContact[]
  isUploading: boolean
  uploadProgress: number
  isLoadingVault: boolean

  loadVault: () => Promise<void>
  uploadFile: (file: File, reportType: ReportType, description?: string) => Promise<void>
  loadAnalysis: (fileUuid: string) => Promise<void>
  updateAnalysisFromWS: (analysis: AIAnalysis) => void
  loadAppointments: () => Promise<void>
  loadEmergencyContacts: () => Promise<void>
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id' | 'patientId'>) => Promise<void>
  deleteEmergencyContact: (id: string) => Promise<void>
}

export const usePatientStore = create<PatientState>((set, get) => ({
  vault: [], analyses: {}, appointments: [],
  emergencyContacts: [], isUploading: false,
  uploadProgress: 0, isLoadingVault: false,

  loadVault: async () => {
    set({ isLoadingVault: true })
    try {
      const { data } = await apiClient.get('/patients/vault')
      set({ vault: data.files, isLoadingVault: false })
    } catch { set({ isLoadingVault: false }) }
  },

  uploadFile: async (file, reportType, description) => {
    set({ isUploading: true, uploadProgress: 0 })
    const formData = new FormData()
    formData.append('file', file)
    formData.append('report_type', reportType)
    if (description) formData.append('description', description)
    try {
      const { data } = await apiClient.post('/patients/vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total ?? e.loaded))
          set({ uploadProgress: pct })
        },
      })
      set((s) => ({ vault: [data.file, ...s.vault], isUploading: false, uploadProgress: 0 }))
      toast.success('File uploaded — AI analysis in progress...')
    } catch {
      set({ isUploading: false, uploadProgress: 0 })
      toast.error('Upload failed. Please try again.')
    }
  },

  loadAnalysis: async (fileUuid) => {
    try {
      const { data } = await apiClient.get(`/patients/vault/${fileUuid}/analysis`)
      set((s) => ({ analyses: { ...s.analyses, [fileUuid]: data } }))
    } catch { /* analysis not yet ready */ }
  },

  updateAnalysisFromWS: (analysis) => {
    set((s) => ({
      analyses: { ...s.analyses, [analysis.fileUuid]: analysis },
      vault: s.vault.map((f) =>
        f.fileUuid === analysis.fileUuid ? { ...f, analysisStatus: 'completed', analysisUuid: analysis.analysisUuid } : f
      ),
    }))
  },

  loadAppointments: async () => {
    const { data } = await apiClient.get('/patients/appointments')
    set({ appointments: data.appointments })
  },

  loadEmergencyContacts: async () => {
    const { data } = await apiClient.get('/patients/emergency-contacts')
    set({ emergencyContacts: data.contacts })
  },

  addEmergencyContact: async (contact) => {
    const { data } = await apiClient.post('/patients/emergency-contacts', contact)
    set((s) => ({ emergencyContacts: [...s.emergencyContacts, data.contact] }))
  },

  deleteEmergencyContact: async (id) => {
    await apiClient.delete(`/patients/emergency-contacts/${id}`)
    set((s) => ({ emergencyContacts: s.emergencyContacts.filter((c) => c.id !== id) }))
  },
}))
