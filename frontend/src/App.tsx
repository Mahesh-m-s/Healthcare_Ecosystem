import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { getWebSocket } from './api/websocket'
import { usePatientStore } from './store/patientStore'
import { useHospitalStore } from './store/hospitalStore'
import { WS_EVENTS } from './config/constants'
import { useEffect } from 'react'

// Public pages
import LandingPage from './pages/public/LandingPage'
import UniversalLoginPage from './pages/public/UniversalLoginPage'
import PatientRegisterPage from './pages/public/PatientRegisterPage'

// Layouts
import PatientLayout from './components/layout/PatientLayout'
import HospitalLayout from './components/layout/HospitalLayout'
import DoctorLayout from './components/layout/DoctorLayout'

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard'
import MedicalVault from './pages/patient/MedicalVault'
import EmergencyPage from './pages/patient/EmergencyPage'
import SymptomChecker from './pages/patient/SymptomChecker'
import HospitalFinder from './pages/patient/HospitalFinder'
import InsuranceAdvisor from './pages/patient/InsuranceAdvisor'
import PatientProfile from './pages/patient/PatientProfile'
import MedicalHistory from './pages/patient/MedicalHistory'

// Hospital pages
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import EmergencyCenter from './pages/hospital/EmergencyCenter'
import BedManagement from './pages/hospital/BedManagement'
import DoctorManagement from './pages/hospital/DoctorManagement'
import PatientManagement from './pages/hospital/PatientManagement'

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import MyPatients from './pages/doctor/MyPatients'
import PatientDetail from './pages/doctor/PatientDetail'
import PrescriptionWriter from './pages/doctor/PrescriptionWriter'
import ClinicalNotes from './pages/doctor/ClinicalNotes'
import DoctorSchedule from './pages/doctor/DoctorSchedule'

// Auth guard
function ProtectedRoute({ role, children }: { role: string; children: React.ReactNode }) {
  const { isAuthenticated, role: userRole } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (userRole !== role) return <Navigate to="/" replace />
  return <>{children}</>
}

// WebSocket setup hook
function useWebSocketSetup() {
  const { user, isAuthenticated, role } = useAuthStore()
  const { updateAnalysisFromWS } = usePatientStore()
  const { addEmergencyAlert } = useHospitalStore()

  useEffect(() => {
    if (!isAuthenticated || !user) return
    const ws = getWebSocket(user.id)
    ws
      .on(WS_EVENTS.AI_ANALYSIS_READY, (data) => updateAnalysisFromWS(data as never))
      .on(WS_EVENTS.EMERGENCY_INCOMING, (data) => {
        if (role === 'hospital') addEmergencyAlert(data as never)
      })
    if (!ws.isConnected) ws.connect()
  }, [isAuthenticated, user, role])
}

export default function App() {
  useWebSocketSetup()
  const { isAuthenticated, role } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UniversalLoginPage />} />
        <Route path="/register" element={<PatientRegisterPage />} />

        {/* Auto-redirect on login */}
        <Route path="/redirect" element={
          isAuthenticated
            ? <Navigate to={`/${role}/dashboard`} replace />
            : <Navigate to="/login" replace />
        } />

        {/* ── PATIENT ROUTES ── */}
        <Route path="/patient" element={
          <ProtectedRoute role="patient"><PatientLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<PatientDashboard />} />
          <Route path="vault"       element={<MedicalVault />} />
          <Route path="emergency"   element={<EmergencyPage />} />
          <Route path="symptoms"    element={<SymptomChecker />} />
          <Route path="hospitals"   element={<HospitalFinder />} />
          <Route path="insurance"   element={<InsuranceAdvisor />} />
          <Route path="history"     element={<MedicalHistory />} />
          <Route path="profile"     element={<PatientProfile />} />
        </Route>

        {/* ── HOSPITAL ROUTES ── */}
        <Route path="/hospital" element={
          <ProtectedRoute role="hospital"><HospitalLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<HospitalDashboard />} />
          <Route path="emergency"   element={<EmergencyCenter />} />
          <Route path="beds"        element={<BedManagement />} />
          <Route path="doctors"     element={<DoctorManagement />} />
          <Route path="patients"    element={<PatientManagement />} />
        </Route>

        {/* ── DOCTOR ROUTES ── */}
        <Route path="/doctor" element={
          <ProtectedRoute role="doctor"><DoctorLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"        element={<DoctorDashboard />} />
          <Route path="patients"         element={<MyPatients />} />
          <Route path="patients/:pid"    element={<PatientDetail />} />
          <Route path="prescribe/:pid"   element={<PrescriptionWriter />} />
          <Route path="notes/:pid"       element={<ClinicalNotes />} />
          <Route path="schedule"         element={<DoctorSchedule />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
