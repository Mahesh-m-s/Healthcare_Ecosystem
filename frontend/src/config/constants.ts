// VaidyaAstra Frontend Constants — all keys from env vars ONLY
export const API_BASE_URL    = import.meta.env.VITE_API_BASE_URL    || 'http://localhost:8000'
export const WS_BASE_URL     = import.meta.env.VITE_WS_URL           || 'ws://localhost:8000'
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
export const MAPPLS_KEY = GOOGLE_MAPS_API_KEY
export const APP_NAME         = import.meta.env.VITE_APP_NAME         || 'VaidyaAstra'
export const EMERGENCY_PHONE  = import.meta.env.VITE_EMERGENCY_PHONE  || '112'

export const FEATURES = {
  videoConsult:      import.meta.env.VITE_ENABLE_VIDEO_CONSULT     === 'true',
  insurance:         import.meta.env.VITE_ENABLE_INSURANCE_MODULE  !== 'false',
  ambulanceTracking: import.meta.env.VITE_ENABLE_AMBULANCE_TRACKING !== 'false',
  aiSymptomChecker:  import.meta.env.VITE_ENABLE_AI_SYMPTOM_CHECKER !== 'false',
  multilingual:      import.meta.env.VITE_ENABLE_MULTILINGUAL       !== 'false',
}

export const REPORT_TYPES = [
  { value: 'mri',          label: 'MRI Scan',          icon: '🧠', accept: '.pdf,.jpg,.jpeg,.png,.dcm' },
  { value: 'ct',           label: 'CT Scan',            icon: '🔬', accept: '.pdf,.jpg,.jpeg,.png,.dcm' },
  { value: 'xray',         label: 'X-Ray',              icon: '🦴', accept: '.jpg,.jpeg,.png,.pdf,.dcm' },
  { value: 'blood',        label: 'Blood Report',       icon: '🩸', accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'ecg',          label: 'ECG / EKG',          icon: '❤️', accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'prescription', label: 'Prescription',       icon: '💊', accept: '.pdf,.jpg,.jpeg,.png' },
  { value: 'discharge',    label: 'Discharge Summary',  icon: '📋', accept: '.pdf' },
] as const
export type ReportType = typeof REPORT_TYPES[number]['value']

export const RISK_CONFIG = {
  LOW:      { label: 'Low Risk',      classes: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: '#2ECC71' },
  MEDIUM:   { label: 'Medium Risk',   classes: 'text-amber-700   bg-amber-50   border-amber-200',   dot: '#F39C12' },
  HIGH:     { label: 'High Risk',     classes: 'text-orange-700  bg-orange-50  border-orange-200',  dot: '#E67E22' },
  CRITICAL: { label: 'Critical Risk', classes: 'text-red-700     bg-red-50     border-red-200',     dot: '#FF4B4B' },
} as const
export type RiskLevel = keyof typeof RISK_CONFIG

export const LANGUAGES = [
  { code: 'en', label: 'English',   native: 'English'  },
  { code: 'hi', label: 'Hindi',     native: 'हिंदी'    },
  { code: 'kn', label: 'Kannada',   native: 'ಕನ್ನಡ'    },
  { code: 'ta', label: 'Tamil',     native: 'தமிழ்'    },
  { code: 'te', label: 'Telugu',    native: 'తెలుగు'   },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം'  },
  { code: 'mr', label: 'Marathi',   native: 'मराठी'    },
  { code: 'gu', label: 'Gujarati',  native: 'ગુજરાતી' },
  { code: 'bn', label: 'Bengali',   native: 'বাংলা'   },
]

export const WS_EVENTS = {
  EMERGENCY_INCOMING:      'emergency:incoming',
  EMERGENCY_ACCEPTED:      'emergency:accepted',
  AMBULANCE_LOCATION:      'ambulance:location',
  EMERGENCY_STATUS_UPDATE: 'emergency:status',
  AI_ANALYSIS_READY:       'ai:analysis_ready',
  NEW_PRESCRIPTION:        'prescription:new',
  NEW_REPORT:              'report:new',
  BED_STATUS_CHANGE:       'hospital:bed_update',
  APPOINTMENT_REMINDER:    'appointment:reminder',
} as const

export const MAX_UPLOAD_MB = 50
export const MAX_EMERGENCY_CONTACTS = 5
