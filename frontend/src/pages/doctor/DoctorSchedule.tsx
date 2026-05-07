import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Video, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { apiClient } from '../../api/client'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'

interface Appointment {
  id: string; patient_name: string; appointment_time: string
  type: 'in-person' | 'video'; status: string; reason: string; duration_minutes: number
}

export default function DoctorSchedule() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedDay, setSelectedDay] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Appointment[]>('/doctor/schedule')
      .then(r => setAppointments(r.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const dayAppointments = appointments
    .filter(a => isSameDay(new Date(a.appointment_time), selectedDay))
    .sort((a, b) => new Date(a.appointment_time).getTime() - new Date(b.appointment_time).getTime())

  const TYPE_STYLES = {
    'in-person': { icon: MapPin, color: 'text-va-blue',   bg: 'bg-blue-50',     label: 'In-Person' },
    'video':     { icon: Video,  color: 'text-va-purple', bg: 'bg-purple-50',   label: 'Video' },
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-va-blue" /> My Schedule
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">{format(new Date(), 'MMMM yyyy')}</p>
        </div>
        <VaButton variant="primary" icon={<Plus className="w-4 h-4" />} size="sm">
          Add Slot
        </VaButton>
      </div>

      {/* Week Navigator */}
      <VaCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekStart(w => addDays(w, -7))}
            className="p-2 rounded-va hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-va-gray-text" />
          </button>
          <span className="text-sm font-medium text-va-charcoal dark:text-white">
            {format(weekStart, 'd MMM')} – {format(addDays(weekStart, 6), 'd MMM yyyy')}
          </span>
          <button
            onClick={() => setWeekStart(w => addDays(w, 7))}
            className="p-2 rounded-va hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-va-gray-text" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayCount = appointments.filter(a => isSameDay(new Date(a.appointment_time), day)).length
            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDay)
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center gap-1 py-2 rounded-va transition-all ${
                  isSelected ? 'bg-va-blue text-white' :
                  isToday    ? 'bg-blue-50 dark:bg-dark-surface text-va-blue' :
                               'hover:bg-va-gray-light dark:hover:bg-dark-surface text-va-gray-text'
                }`}
              >
                <span className="text-xs font-medium">{format(day, 'EEE')}</span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-va-charcoal dark:text-white'}`}>
                  {format(day, 'd')}
                </span>
                {dayCount > 0 && (
                  <span className={`text-xs px-1.5 rounded-full ${isSelected ? 'bg-white text-va-blue' : 'bg-va-blue text-white'}`}>
                    {dayCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </VaCard>

      {/* Day Appointments */}
      <div>
        <h2 className="font-semibold text-va-charcoal dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-va-blue" />
          {isSameDay(selectedDay, new Date()) ? "Today's" : format(selectedDay, 'EEEE, d MMM')} Appointments
          <span className="text-va-gray-text font-normal text-sm">({dayAppointments.length})</span>
        </h2>

        {loading ? (
          <div className="text-center py-12 text-va-gray-text">Loading schedule...</div>
        ) : dayAppointments.length === 0 ? (
          <div className="text-center py-12 text-va-gray-text">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <div>No appointments for this day</div>
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map((apt, i) => {
              const typeCfg = TYPE_STYLES[apt.type] || TYPE_STYLES['in-person']
              const Icon = typeCfg.icon
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <VaCard className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-center shrink-0 w-14">
                        <div className="text-lg font-bold text-va-charcoal dark:text-white">
                          {format(new Date(apt.appointment_time), 'HH:mm')}
                        </div>
                        <div className="text-xs text-va-gray-text">{apt.duration_minutes}min</div>
                      </div>
                      <div className={`w-px h-10 ${apt.status === 'confirmed' ? 'bg-va-success' : 'bg-va-gray-light dark:bg-dark-border'}`} />
                      <div className={`w-9 h-9 rounded-va ${typeCfg.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${typeCfg.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-va-charcoal dark:text-white">{apt.patient_name}</div>
                        <div className="text-sm text-va-gray-text">{apt.reason}</div>
                        <div className={`text-xs mt-0.5 ${typeCfg.color}`}>{typeCfg.label}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <VaBadge status={apt.status as any} />
                        {apt.type === 'video' && apt.status === 'confirmed' && (
                          <VaButton size="xs" variant="primary" icon={<Video className="w-3 h-3" />}>
                            Join
                          </VaButton>
                        )}
                      </div>
                    </div>
                  </VaCard>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
