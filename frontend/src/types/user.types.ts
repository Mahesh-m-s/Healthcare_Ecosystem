export type UserRole = 'patient' | 'hospital' | 'doctor'

export interface User {
  id: string
  email: string
  phone: string
  role: UserRole
  isVerified: boolean
  createdAt: string
}

export interface Patient extends User {
  fullName: string
  dateOfBirth: string
  sex: 'M' | 'F' | 'Other'
  bloodGroup: string
  address?: string
  city?: string
  state?: string
  preferredLanguage: string
  profilePhoto?: string
  allergies: string[]
  chronicConditions: string[]
  currentMedications: string[]
  insuranceProvider?: string
}

export interface Hospital extends User {
  name: string
  registrationNo?: string
  address: string
  city: string
  state: string
  phone: string
  latitude?: number
  longitude?: number
  specialties: string[]
  hasEmergency: boolean
  hasICU: boolean
  totalBeds: number
  icuBeds: number
  isVerified: boolean
}

export interface Doctor extends User {
  hospitalId: string
  fullName: string
  specialization: string
  licenseNumber: string
  department?: string
  profilePhoto?: string
  workingHours?: string
  isAvailable: boolean
}

export interface LoginCredentials {
  email?: string
  emailOrPhone?: string
  password: string
  role: UserRole
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  role: UserRole
  userId: string
}
