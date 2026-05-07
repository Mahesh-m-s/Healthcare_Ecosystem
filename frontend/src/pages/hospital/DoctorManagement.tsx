import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Phone, Mail, Star, Users, Calendar, Filter } from 'lucide-react'
import { useHospitalStore } from '../../store/hospitalStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'

export default function DoctorManagement() {
  const { doctors, loadDoctors } = useHospitalStore()
  const [search, setSearch] = useState('')
  const [specFilter, setSpecFilter] = useState('all')

  useEffect(() => { loadDoctors() }, [])

  const specializations = ['all', ...Array.from(new Set(doctors.map(d => d.specialization).filter(Boolean)))]
  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        (d.specialization || '').toLowerCase().includes(search.toLowerCase())
    const matchSpec = specFilter === 'all' || d.specialization === specFilter
    return matchSearch && matchSpec
  })

  const onDuty = doctors.filter(d => d.is_available).length

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-va-blue" /> Doctor Management
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">{doctors.length} doctors · {onDuty} on duty today</p>
        </div>
        <VaButton variant="primary" icon={<Plus className="w-4 h-4" />}>
          Add Doctor
        </VaButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Doctors', value: doctors.length, color: 'text-va-blue' },
          { label: 'On Duty',       value: onDuty,          color: 'text-va-success' },
          { label: 'Specializations', value: specializations.length - 1, color: 'text-va-purple' },
        ].map(({ label, value, color }) => (
          <VaCard key={label} className="p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-va-gray-text mt-0.5">{label}</div>
          </VaCard>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctor or specialization..."
            className="w-full pl-9 pr-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
          />
        </div>
        <select
          value={specFilter}
          onChange={e => setSpecFilter(e.target.value)}
          className="px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        >
          {specializations.map(s => <option key={s} value={s}>{s === 'all' ? 'All Specializations' : s}</option>)}
        </select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
          >
            <VaCard className="p-5">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-va-blue to-va-purple flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {doc.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-va-charcoal dark:text-white truncate">Dr. {doc.name}</div>
                    <VaBadge status={doc.is_available ? 'available' : 'occupied'} />
                  </div>
                  <div className="text-sm text-va-blue font-medium">{doc.specialization || 'General'}</div>
                  <div className="text-xs text-va-gray-text">{doc.qualification || 'MBBS'}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-va-gray-text">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {doc.total_patients ?? 0} patients
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" /> {doc.rating?.toFixed(1) ?? '—'}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {doc.experience_years ?? 0} yrs exp
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-va-success">₹</span> {doc.consultation_fee ?? '—'}/consult
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {doc.phone && (
                  <a href={`tel:${doc.phone}`} className="flex-1">
                    <VaButton size="xs" variant="ghost" icon={<Phone className="w-3 h-3" />} className="w-full justify-center">
                      Call
                    </VaButton>
                  </a>
                )}
                {doc.email && (
                  <a href={`mailto:${doc.email}`} className="flex-1">
                    <VaButton size="xs" variant="ghost" icon={<Mail className="w-3 h-3" />} className="w-full justify-center">
                      Email
                    </VaButton>
                  </a>
                )}
                <VaButton size="xs" variant="primary" className="flex-1 justify-center">
                  View
                </VaButton>
              </div>
            </VaCard>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-va-gray-text">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <div>No doctors found</div>
        </div>
      )}
    </div>
  )
}
