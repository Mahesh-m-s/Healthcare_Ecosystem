import { Outlet, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, AlertTriangle, Calendar, LogOut, Bell, Menu, X, Zap, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import type { Doctor } from '../../types/user.types'

const NAV = [
  { to: '/doctor/dashboard',  icon: LayoutDashboard, label: 'Dashboard',        color: 'text-va-blue'     },
  { to: '/doctor/patients',   icon: Users,            label: 'My Patients',      color: 'text-purple-500'  },
  { to: '/doctor/emergency',  icon: AlertTriangle,    label: 'Emergency Cases',  color: 'text-[#FF4B4B]'   },
  { to: '/doctor/schedule',   icon: Calendar,         label: 'Schedule',         color: 'text-emerald-500' },
]

export default function DoctorLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const doctor = user as Doctor | null

  return (
    <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 bg-black/30 z-40 lg:hidden" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setOpen(false)} />}
      </AnimatePresence>

      <aside className={clsx('fixed lg:relative top-0 left-0 h-full w-64 bg-white border-r border-[#EAEAEA] flex flex-col z-40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-transform duration-300', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E7EDB8] flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-lime-700" />
            </div>
            <div>
              <p className="font-bold text-[#2C2C2C] text-sm">Dr. {doctor?.fullName?.split(' ').pop() ?? 'Doctor'}</p>
              <p className="text-[10px] text-[#7B7B7B]">{doctor?.specialization ?? 'Physician'}</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="w-5 h-5 text-[#7B7B7B]" /></button>
        </div>

        <div className="px-4 py-4 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-3 p-3 bg-[#E7EDB8]/60 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-lime-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {doctor?.fullName?.charAt(0) ?? 'D'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#2C2C2C] truncate">Dr. {doctor?.fullName}</p>
              <p className="text-xs text-[#7B7B7B]">{doctor?.specialization}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, color }) => (
            <NavLink key={to} to={to} end={to.includes('dashboard')}>
              {({ isActive }) => (
                <div className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                  isActive ? 'bg-[#4F8CFF] text-white shadow-[0_0_16px_rgba(79,140,255,0.3)]' : 'text-[#7B7B7B] hover:text-[#2C2C2C] hover:bg-[#F8F8F8]')}>
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-white' : color)} />
                  {label}
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
          <button className="relative p-2 rounded-xl hover:bg-[#F8F8F8] text-[#7B7B7B]"><Bell className="w-5 h-5" /></button>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#F8F8F8]"><Outlet /></main>
      </div>
    </div>
  )
}
