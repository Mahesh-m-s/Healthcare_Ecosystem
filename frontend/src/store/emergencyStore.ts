import { create } from 'zustand'
import apiClient from '../api/client'
import type { Emergency, HospitalWithEta, LatLng } from '../types/emergency.types'
import toast from 'react-hot-toast'

interface EmergencyState {
  activeEmergency: Emergency | null
  ambulanceLocation: LatLng | null
  nearbyHospitals: HospitalWithEta[]
  isTriggering: boolean
  isLoadingHospitals: boolean
  currentLocation: LatLng | null

  getCurrentLocation: () => Promise<LatLng | null>
  triggerSOS: (reason?: string) => Promise<void>
  loadNearbyHospitals: (lat: number, lng: number) => Promise<void>
  updateAmbulanceLocation: (location: LatLng) => void
  updateEmergencyStatus: (status: Emergency['status']) => void
  clearEmergency: () => void
}

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  activeEmergency: null, ambulanceLocation: null,
  nearbyHospitals: [], isTriggering: false,
  isLoadingHospitals: false, currentLocation: null,

  getCurrentLocation: () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          set({ currentLocation: loc })
          resolve(loc)
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }),

  triggerSOS: async (reason = 'Patient triggered SOS') => {
    set({ isTriggering: true })
    const location = await get().getCurrentLocation()
    try {
      const { data } = await apiClient.post('/emergency/trigger', {
        reason,
        latitude: location?.lat,
        longitude: location?.lng,
      })
      set({ activeEmergency: data.emergency, isTriggering: false })
      toast.error('🚨 Emergency triggered! Help is on the way.', { duration: 10000 })
    } catch {
      set({ isTriggering: false })
      toast.error('Failed to trigger emergency. Call 112 immediately!')
    }
  },

  loadNearbyHospitals: async (lat, lng) => {
    set({ isLoadingHospitals: true })
    try {
      const { data } = await apiClient.get('/maps/nearby-hospitals', { params: { lat, lng, radius: 15000 } })
      set({ nearbyHospitals: data.hospitals, isLoadingHospitals: false })
    } catch { set({ isLoadingHospitals: false }) }
  },

  updateAmbulanceLocation: (location) => set({ ambulanceLocation: location }),

  updateEmergencyStatus: (status) =>
    set((s) => s.activeEmergency ? { activeEmergency: { ...s.activeEmergency, status } } : {}),

  clearEmergency: () => set({ activeEmergency: null, ambulanceLocation: null }),
}))
