export interface Emergency {
  id: string
  patientId: string
  triggerSource: 'sos' | 'ai_detected' | 'doctor' | 'hospital'
  triggeredAt: string
  patientLat?: number
  patientLng?: number
  patientAddress?: string
  assignedHospitalId?: string
  assignedDoctorId?: string
  assignedAmbulanceId?: string
  aiTriageData?: {
    triageColor: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN'
    immediateActions: string[]
    probableEmergency: string
    criticalInfo: string
    contraindications: string[]
  }
  status: 'INITIATED' | 'AMBULANCE_DISPATCHED' | 'IN_TRANSIT' | 'ARRIVED' | 'ADMITTED' | 'RESOLVED'
  resolvedAt?: string
  notes?: string
  assignedHospital?: { name: string; address: string; phone: string }
  ambulance?: { unitId: string; driverName: string; driverPhone: string; currentLat: number; currentLng: number }
}

export interface LatLng { lat: number; lng: number }

export interface HospitalWithEta {
  placeId: string
  name: string
  address: string
  location: LatLng
  rating?: number
  etaMinutes?: number
  distanceKm?: number
  hasEmergency?: boolean
  availableBeds?: number
}
