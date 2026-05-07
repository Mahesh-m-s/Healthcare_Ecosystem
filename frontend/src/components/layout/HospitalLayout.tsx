import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, AlertTriangle, BedDouble, Users, UserCog, Ambulance, LogOut, Bell, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useHospitalStore } from '../../store/hospitalStore'
import type { Hospital } from '../../types/user.types'

const NAV = [
  { to: '/hospital/dashboard', icon: LayoutDashboard, label: 'Overview',         color: 'text-va-blue'       },
  { to: '/hospital/emergency', icon: AlertTriangle,   label: 'Emergency Center', color: 'text-[#FF4B4B]'     },
  { to: '/hospital/beds',      icon: BedDouble,        label: 'Bed Management',   color: 'text-emerald-500'   },
  { to: '/hospital/doctors',   icon: UserCog,          label: 'Doctors',          color: 'text-purple-500'    },
  { to: '/hospital/patients',  icon: Users,            label: 'Patients',         color: 'text-amber-500'     },
]

export default function HospitalLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { emergencyAlerts, overview } = useHospitalStore()
  const pendingAlerts = emergencyAlerts.filter(a => a.status === 'pending').length
  const hosp = user as Hospital | null

  return (
    <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 bg-black/30 z-40 lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setOpen(false)} />}
      </AnimatePresence>

      <aside className={clsx('fixed lg:relative top-0 left-0 h-full w-64 bg-white border-r border-[#EAEAEA] flex flex-col z-40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-transform duration-300', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDEEE8] flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-[#2C2C2C] text-sm">{hosp?.name ?? 'Hospital'}</p>
              <p className="text-[10px] text-[#7B7B7B]">Management Portal</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="w-5 h-5 text-[#7B7B7B]" /></button>
        </div>

        {/* Hospital stats mini */}
        {overview && (
          <div className="px-4 py-3 border-b border-[#EAEAEA]">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Beds Free', value: overview.availableBeds, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Patients', value: overview.activePatients, color: 'text-[#4F8CFF] bg-[#D9EDF7]' },
              ].map(s => (
                <div key={s.label} className={`rounded-lg p-2 text-center ${s.color}`}>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[10px] font-medium opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, color }) => (
            <NavLink key={to} to={to} end={to.includes('dashboard')}>
              {({ isActive }) => (
                <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                  isActive ? 'bg-[#4F8CFF] text-white shadow-[0_0_16px_rgba(79,140,255,0.3)]' : 'text-[#7B7B7B] hover:text-[#2C2C2C] hover:bg-[#F8F8F8]')}>
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white' : color)} />
                  <span className="flex-1">{label}</span>
                  {label === 'Emergency Center' && pendingAlerts > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF4B4B] text-white animate-pulse">{pendingAlerts}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#EAEAEA]">
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-[#7B7B7B] hover:text-[#FF4B4B] hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#EAEAEA] flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-sm">
          <button className="lg:hidden p-2 rounded-xl hover:bg-[#F8F8F8]" onClick={() => setOpen(true)}><Menu className="w-5 h-5 text-[#7B7B7B]" /></button>
          <div className="flex-1" />
          {pendingAlerts > 0 && (
            <motion.div animate={{scale:[1,1.04,1]}} transition={{repeat:Infinity,duration:1.5}}
              className="flex items-center gap-1.5 text-xs bg-red-50 text-[#FF4B4B] border border-red-200 rounded-full px-3 py-1.5 mr-3 cursor-pointer font-semibold"
              onClick={() => window.location.href='/hospital/emergency'}>
              <AlertTriangle className="w-3.5 h-3.5" />
              {pendingAlerts} pending emergency alert{pendingAlerts > 1 ? 's' : ''}
            </motion.div>
          )}
          <button className="relative p-2 rounded-xl hover:bg-[#F8F8F8] text-[#7B7B7B]">
            <Bell className="w-5 h-5" />
            {pendingAlerts > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF4B4B] rounded-full animate-pulse" />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#F8F8F8]"><Outlet /></main>
      </div>
    </div>
  )
}
