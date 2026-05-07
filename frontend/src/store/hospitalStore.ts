import { create } from 'zustand'
import apiClient from '../api/client'
import type { HospitalOverview, EmergencyAlert, Bed, Ambulance } from '../types/hospital.types'
import type { Doctor } from '../types/user.types'
import toast from 'react-hot-toast'

interface HospitalState {
  overview: HospitalOverview | null
  emergencyAlerts: EmergencyAlert[]
  beds: Bed[]
  ambulances: Ambulance[]
  doctors: Doctor[]
  isLoading: boolean

  loadOverview: () => Promise<void>
  loadBeds: () => Promise<void>
  loadEmergencyAlerts: () => Promise<void>
  addEmergencyAlert: (alert: EmergencyAlert) => void
  acceptEmergency: (alertId: string, emergencyId: string) => Promise<void>
  updateBedStatus: (bedId: string, status: Bed['status']) => Promise<void>
  loadDoctors: () => Promise<void>
  loadAmbulances: () => Promise<void>
}

export const useHospitalStore = create<HospitalState>((set, get) => ({
  overview: null, emergencyAlerts: [], beds: [],
  ambulances: [], doctors: [], isLoading: false,

  loadOverview: async () => {
    const { data } = await apiClient.get('/hospitals/dashboard')
    set({ overview: data })
  },

  loadBeds: async () => {
    const { data } = await apiClient.get('/hospitals/beds')
    set({ beds: data.beds })
  },

  loadEmergencyAlerts: async () => {
    const { data } = await apiClient.get('/hospitals/emergency-alerts')
    set({ emergencyAlerts: data.alerts })
  },

  addEmergencyAlert: (alert) => {
    set((s) => ({ emergencyAlerts: [alert, ...s.emergencyAlerts] }))
    toast.error(`🚨 EMERGENCY: ${alert.patientName}, ${alert.aiTriageColor} triage`, { duration: 15000 })
  },

  acceptEmergency: async (alertId, emergencyId) => {
    await apiClient.post(`/hospitals/emergency-alerts/${alertId}/accept`, { emergencyId })
    set((s) => ({
      emergencyAlerts: s.emergencyAlerts.map((a) =>
        a.id === alertId ? { ...a, status: 'accepted' } : a
      ),
    }))
    toast.success('Emergency accepted — bed reserved, doctor notified')
  },

  updateBedStatus: async (bedId, status) => {
    await apiClient.put(`/hospitals/beds/${bedId}`, { status })
    set((s) => ({
      beds: s.beds.map((b) => b.id === bedId ? { ...b, status } : b),
    }))
  },

  loadDoctors: async () => {
    const { data } = await apiClient.get('/hospitals/doctors')
    set({ doctors: data.doctors })
  },

  loadAmbulances: async () => {
    const { data } = await apiClient.get('/hospitals/ambulances')
    set({ ambulances: data.ambulances })
  },
}))
