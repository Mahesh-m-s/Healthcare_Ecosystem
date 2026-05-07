import { useEffect, useState } from 'react'
import { Calendar, Search, Star, Clock, MapPin } from 'lucide-react'
import { apiClient } from '../../api/client'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import toast from 'react-hot-toast'

interface Doctor {
  id: string; name: string; specialization: string
  rating: number; experience_years: number; consultation_fee: number
  is_available: boolean; hospital_name: string
}

export default function DoctorBooking() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<Doctor[]>('/doctors/available')
      .then(r => setDoctors(r.data))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  )

  const bookAppointment = async (doctorId: string) => {
    try {
      await apiClient.post('/appointments', { doctor_id: doctorId })
      toast.success('Appointment booked!')
    } catch { toast.error('Booking failed') }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-va-blue" /> Book a Doctor
        </h1>
        <p className="text-va-gray-text text-sm mt-0.5">Find and book appointments with available doctors</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialization..."
          className="w-full pl-9 pr-4 py-2.5 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-va-gray-text">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(doc => (
            <VaCard key={doc.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-va-blue to-va-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {doc.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-va-charcoal dark:text-white">Dr. {doc.name}</div>
                    <VaBadge status={doc.is_available ? 'available' : 'occupied'} />
                  </div>
                  <div className="text-sm text-va-blue">{doc.specialization}</div>
                  <div className="flex gap-3 text-xs text-va-gray-text mt-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{doc.rating?.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{doc.experience_years}y exp</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{doc.hospital_name}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-va-success font-semibold">₹{doc.consultation_fee}</span>
                <VaButton size="sm" variant="primary" disabled={!doc.is_available} onClick={() => bookAppointment(doc.id)}>
                  {doc.is_available ? 'Book Now' : 'Unavailable'}
                </VaButton>
              </div>
            </VaCard>
          ))}
        </div>
      )}
    </div>
  )
}
