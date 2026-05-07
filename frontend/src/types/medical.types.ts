import type { RiskLevel, ReportType } from '../config/constants'

export interface MedicalFile {
  fileUuid: string
  patientId: string
  fileName: string
  originalName: string
  fileType: 'pdf' | 'image' | 'dicom'
  reportType: ReportType
  fileSize: number
  uploadDate: string
  uploadedBy: string
  isSharedWithHospital: string[]
  isSharedWithDoctors: string[]
  tags: string[]
  analysisStatus?: 'pending' | 'processing' | 'completed' | 'failed'
  analysisUuid?: string
}

export interface AIAnalysis {
  analysisUuid: string
  fileUuid: string
  patientId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: {
    reportType: string
    summary: string
    findings: string[]
    riskLevel: RiskLevel
    riskExplanation: string
    emergencyIndicators: string[]
    specialistRecommendation: string
    patientFriendlyExplanation: string
    nextSteps: string[]
    disclaimer: string
  }
  translations?: Record<string, { summary: string; explanation: string }>
  processingTimeMs?: number
  createdAt: string
}

export interface SOAPNote {
  id: string
  patientId: string
  doctorId: string
  hospitalId: string
  visitDate: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  icd10Codes: string[]
  isSharedWithPatient: boolean
  createdAt: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorId: string
  hospitalId: string
  prescribedAt: string
  medicines: Array<{
    name: string
    dose: string
    frequency: string
    duration: string
    instructions?: string
  }>
  instructions?: string
  diagnosis: string
  isActive: boolean
  filePath?: string
}

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  hospitalId: string
  appointmentDate: string
  appointmentTime: string
  type: 'opd' | 'video' | 'emergency'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  doctorName?: string
  hospitalName?: string
  specialization?: string
}

export interface EmergencyContact {
  id: string
  patientId: string
  name: string
  relation: string
  phone: string
  email?: string
  priorityOrder: number
  notifySms: boolean
  notifyEmail: boolean
}
