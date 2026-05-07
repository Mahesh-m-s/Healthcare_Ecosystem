import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Users, Eye, Phone, FileText, Calendar, Activity } from 'lucide-react'
import { useHospitalStore } from '../../store/hospitalStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'
import { format } from 'date-fns'
import { apiClient } from '../../api/client'

interface HospitalPatient {
  id: string; name: string; age: number; gender: string
  blood_group: string; phone: string; admission_date: string
  ward: string; bed_number: string; doctor_name: string
  diagnosis: string; status: 'admitted' | 'discharged' | 'critical' | 'stable'
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<HospitalPatient[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<HospitalPatient[]>('/hospital/patients')
      .then(r => setPatients(r.data))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
                        p.bed_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    total:     patients.length,
    admitted:  patients.filter(p => p.status === 'admitted').length,
    critical:  patients.filter(p => p.status === 'critical').length,
    stable:    patients.filter(p => p.status === 'stable').length,
    discharged:patients.filter(p => p.status === 'discharged').length,
  }

  const STATUS_STYLES: Record<string, string> = {
    admitted:   'text-va-blue bg-blue-50 border-blue-200',
    critical:   'text-va-emergency bg-red-50 border-red-200',
    stable:     'text-va-success bg-emerald-50 border-emerald-200',
    discharged: 'text-va-gray-text bg-va-gray-light border-va-gray-light',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-va-blue" /> Patient Management
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">{counts.total} total patients · {counts.critical} critical</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: 'admitted',  label: 'Admitted',   color: 'text-va-blue' },
          { key: 'critical',  label: 'Critical',   color: 'text-va-emergency' },
          { key: 'stable',    label: 'Stable',     color: 'text-va-success' },
          { key: 'discharged',label: 'Discharged', color: 'text-va-gray-text' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
            className={`p-3 rounded-va text-center border-2 transition-all ${
              statusFilter === key ? 'border-va-blue bg-blue-50' : 'border-va-gray-light dark:border-dark-border bg-white dark:bg-dark-card'
            }`}
          >
            <div className={`text-2xl font-bold ${color}`}>{counts[key as keyof typeof counts]}</div>
            <div className="text-xs text-va-gray-text">{label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, diagnosis, or bed..."
          className="w-full pl-9 pr-4 py-2.5 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        />
      </div>

      {/* Table */}
      <VaCard className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-va-gray-text">Loading patients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-va-gray-light dark:bg-dark-surface text-va-gray-text text-xs">
                <tr>
                  {['Patient', 'Age/Gender', 'Ward/Bed', 'Doctor', 'Diagnosis', 'Status', 'Admitted', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-va-gray-light dark:divide-dark-border">
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-va-lavender to-va-mint flex items-center justify-center text-va-charcoal font-bold text-xs">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-va-charcoal dark:text-white">{p.name}</div>
                          <div className="text-xs text-va-gray-text">{p.blood_group}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-va-gray-text">{p.age}y · {p.gender}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-va-charcoal dark:text-white">{p.ward}</div>
                      <div className="text-xs text-va-gray-text">Bed {p.bed_number}</div>
                    </td>
                    <td className="px-4 py-3 text-va-gray-text">{p.doctor_name || '—'}</td>
                    <td className="px-4 py-3 text-va-gray-text max-w-32 truncate">{p.diagnosis}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[p.status]}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-va-gray-text text-xs">
                      {format(new Date(p.admission_date), 'dd MMM')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <VaButton size="xs" variant="ghost" icon={<Eye className="w-3 h-3" />}>View</VaButton>
                        <VaButton size="xs" variant="ghost" icon={<FileText className="w-3 h-3" />}>Records</VaButton>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-va-gray-text">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <div>No patients found</div>
              </div>
            )}
          </div>
        )}
      </VaCard>
    </div>
  )
}
