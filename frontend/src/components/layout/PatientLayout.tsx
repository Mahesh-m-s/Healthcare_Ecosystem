import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderHeart, Brain, MapPin, Shield,
  History, User, LogOut, Bell, Menu, X, AlertCircle, Zap, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { usePatientStore } from '../../store/patientStore'
import { useEmergencyStore } from '../../store/emergencyStore'
import type { Patient } from '../../types/user.types'
import SOSButton from '../emergency/SOSButton'

const NAV = [
  { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard',       color: 'text-va-blue'       },
  { to: '/patient/vault',     icon: FolderHeart,      label: 'Medical Vault',   color: 'text-purple-500'    },
  { to: '/patient/symptoms',  icon: Brain,             label: 'Symptom Checker', color: 'text-pink-500'      },
  { to: '/patient/hospitals', icon: MapPin,            label: 'Find Hospitals',  color: 'text-emerald-500'   },
  { to: '/patient/insurance', icon: Shield,            label: 'Insurance AI',    color: 'text-amber-500'     },
  { to: '/patient/history',   icon: History,           label: 'Medical History', color: 'text-indigo-500'    },
  { to: '/patient/profile',   icon: User,              label: 'My Profile',      color: 'text-va-gray-text'  },
]

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout }              = useAuthStore()
  const { vault }                     = usePatientStore()
  const { activeEmergency }           = useEmergencyStore()
  const navigate                      = useNavigate()
  const patient                       = user as Patient | null
  const pending = vault.filter(f => ['pending','processing'].includes(f.analysisStatus ?? '')).length

  return (
    <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:relative top-0 left-0 h-full w-64 bg-white border-r border-[#EAEAEA]',
        'flex flex-col shadow-[0_4px_24px_rgba(79,140,255,0.08)] z-40 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4F8CFF] flex items-center justify-center shadow-[0_0_12px_rgba(79,140,255,0.4)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#2C2C2C] text-sm">VaidyaAstra</p>
              <p className="text-[10px] text-[#7B7B7B]">Patient Portal</p>
            </div>
          </div>
          <button className="lg:hidden text-[#7B7B7B] hover:text-[#2C2C2C]" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient identity card */}
        <div className="px-4 py-4 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-3 p-3 bg-[#DCD6F7]/40 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#4F8CFF] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {patient?.fullName?.charAt(0) ?? 'P'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2C2C2C] truncate">{patient?.fullName ?? 'Patient'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-[#7B7B7B]">{patient?.bloodGroup ?? 'Unknown BG'}</span>
                {(patient?.allergies?.length ?? 0) > 0 && (
                  <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 rounded px-1">
                    ⚠ Allergies
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active emergency banner */}
        <AnimatePresence>
          {activeEmergency && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/patient/emergency')}>
              <AlertCircle className="w-4 h-4 text-[#FF4B4B] animate-pulse shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#FF4B4B]">Emergency Active</p>
                <p className="text-[10px] text-red-500">{activeEmergency.status.replace(/_/g,' ')}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#FF4B4B]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, color }) => (
            <NavLink key={to} to={to} end={to.includes('dashboard')}>
              {({ isActive }) => (
                <div className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-[#4F8CFF] text-white shadow-[0_0_16px_rgba(79,140,255,0.3)]'
                    : 'text-[#7B7B7B] hover:text-[#2C2C2C] hover:bg-[#F8F8F8]'
                )}>
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white' : color)} />
                  <span className="flex-1">{label}</span>
                  {label === 'Medical Vault' && pending > 0 && (
                    <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-[#4F8CFF] text-white')}>
                      {pending}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* SOS + logout */}
        <div className="px-4 py-4 border-t border-[#EAEAEA] space-y-2">
          <SOSButton compact />
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[#7B7B7B] hover:text-[#FF4B4B] hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#EAEAEA] flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
          <button className="lg:hidden p-2 rounded-xl hover:bg-[#F8F8F8] text-[#7B7B7B]" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-3">
            {pending > 0 && (
              <motion.button animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-3 py-1.5"
                onClick={() => navigate('/patient/vault')}>
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                AI analyzing {pending} file{pending > 1 ? 's' : ''}...
              </motion.button>
            )}
            <button className="relative p-2 rounded-xl hover:bg-[#F8F8F8] text-[#7B7B7B]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#4F8CFF] rounded-full" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#F8F8F8]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
