export interface Bed {
  id: string
  hospitalId: string
  wardName: string
  bedNumber: string
  bedType: 'general' | 'icu' | 'emergency' | 'ot'
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  patientId?: string
  patientName?: string
  assignedAt?: string
}

export interface Ambulance {
  id: string
  hospitalId: string
  unitNumber: string
  driverName?: string
  driverPhone?: string
  currentLat?: number
  currentLng?: number
  status: 'available' | 'dispatched' | 'maintenance'
}

export interface HospitalOverview {
  totalBeds: number
  availableBeds: number
  occupiedBeds: number
  icuTotal: number
  icuAvailable: number
  activePatients: number
  todayAdmissions: number
  emergencyAlertsToday: number
  avgResponseTimeMinutes: number
}

export interface EmergencyAlert {
  id: string
  emergencyId: string
  patientName: string
  patientAge: number
  bloodGroup: string
  allergies: string[]
  aiTriageColor: 'RED' | 'ORANGE' | 'YELLOW'
  probableCondition: string
  criticalInfo: string
  etaMinutes: number
  patientLat: number
  patientLng: number
  receivedAt: string
  status: 'pending' | 'accepted' | 'rejected'
}

export interface BedMap {
  [wardName: string]: Bed[]
}
