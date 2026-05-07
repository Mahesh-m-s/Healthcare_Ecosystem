import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bed, Search, Filter, RefreshCw, Plus, AlertCircle } from 'lucide-react'
import { useHospitalStore } from '../../store/hospitalStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'

const WARD_COLORS: Record<string, string> = {
  ICU:       'bg-red-100 text-red-700 border-red-200',
  General:   'bg-blue-100 text-blue-700 border-blue-200',
  Pediatric: 'bg-purple-100 text-purple-700 border-purple-200',
  Maternity: 'bg-pink-100 text-pink-700 border-pink-200',
  Surgery:   'bg-orange-100 text-orange-700 border-orange-200',
  Emergency: 'bg-amber-100 text-amber-700 border-amber-200',
}

const STATUS_STYLES: Record<string, string> = {
  available:   'border-emerald-400 bg-emerald-50',
  occupied:    'border-va-blue bg-blue-50',
  reserved:    'border-amber-400 bg-amber-50',
  maintenance: 'border-va-gray-text bg-va-gray-light',
}

export default function BedManagement() {
  const { beds, loadBeds, updateBedStatus } = useHospitalStore()
  const [search, setSearch] = useState('')
  const [wardFilter, setWardFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => { loadBeds() }, [])

  const wards = ['all', ...Array.from(new Set(beds.map(b => b.ward)))]
  const filtered = beds.filter(b => {
    const matchSearch = b.bed_number.toLowerCase().includes(search.toLowerCase()) ||
                        b.ward.toLowerCase().includes(search.toLowerCase())
    const matchWard   = wardFilter === 'all' || b.ward === wardFilter
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchWard && matchStatus
  })

  const stats = {
    total:       beds.length,
    available:   beds.filter(b => b.status === 'available').length,
    occupied:    beds.filter(b => b.status === 'occupied').length,
    reserved:    beds.filter(b => b.status === 'reserved').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  }

  const cycleStatus = (bedId: string, current: string) => {
    const cycle: Record<string, string> = {
      available: 'occupied', occupied: 'reserved',
      reserved: 'maintenance', maintenance: 'available',
    }
    updateBedStatus(bedId, cycle[current] || 'available')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Bed className="w-6 h-6 text-va-blue" /> Bed Management
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">{stats.total} total beds · {stats.available} available</p>
        </div>
        <div className="flex gap-2">
          <VaButton size="sm" variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={loadBeds}>
            Refresh
          </VaButton>
          <VaButton size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add Bed
          </VaButton>
        </div>
      </div>

      {/* Stat chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { key: 'available',   label: 'Available',   color: 'text-va-success' },
          { key: 'occupied',    label: 'Occupied',    color: 'text-va-blue' },
          { key: 'reserved',    label: 'Reserved',    color: 'text-va-warning' },
          { key: 'maintenance', label: 'Maintenance', color: 'text-va-gray-text' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
              statusFilter === key
                ? 'bg-va-blue text-white border-va-blue'
                : 'bg-white dark:bg-dark-card border-va-gray-light dark:border-dark-border text-va-gray-text hover:border-va-blue'
            }`}
          >
            {label}: <span className={`font-bold ${statusFilter === key ? 'text-white' : color}`}>
              {stats[key as keyof typeof stats]}
            </span>
          </button>
        ))}
      </div>

      {/* Occupancy bar */}
      <VaCard className="p-4">
        <div className="flex justify-between text-sm text-va-gray-text mb-2">
          <span>Overall Occupancy</span>
          <span className="font-medium text-va-charcoal dark:text-white">
            {stats.total > 0 ? Math.round(((stats.occupied + stats.reserved) / stats.total) * 100) : 0}%
          </span>
        </div>
        <div className="h-4 bg-va-gray-light dark:bg-dark-border rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-va-blue"
            initial={{ width: 0 }}
            animate={{ width: `${stats.total > 0 ? (stats.occupied / stats.total) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="h-full bg-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${stats.total > 0 ? (stats.reserved / stats.total) * 100 : 0}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
          <motion.div
            className="h-full bg-va-gray-text opacity-40"
            initial={{ width: 0 }}
            animate={{ width: `${stats.total > 0 ? (stats.maintenance / stats.total) * 100 : 0}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-va-gray-text">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-va-blue rounded" />Occupied</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded" />Reserved</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-400 rounded" />Available</span>
        </div>
      </VaCard>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bed or ward..."
            className="w-full pl-9 pr-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
          />
        </div>
        <select
          value={wardFilter}
          onChange={e => setWardFilter(e.target.value)}
          className="px-3 py-2 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        >
          {wards.map(w => <option key={w} value={w}>{w === 'all' ? 'All Wards' : w}</option>)}
        </select>
        <div className="flex rounded-va overflow-hidden border border-va-gray-light dark:border-dark-border">
          {(['grid', 'table'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === mode
                  ? 'bg-va-blue text-white'
                  : 'bg-white dark:bg-dark-card text-va-gray-text hover:bg-va-gray-light dark:hover:bg-dark-surface'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(bed => (
            <motion.button
              key={bed.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => cycleStatus(bed.id, bed.status)}
              className={`border-2 rounded-va p-3 text-left transition-all ${STATUS_STYLES[bed.status] || 'border-va-gray-light bg-white'}`}
            >
              <div className="font-bold text-va-charcoal dark:text-charcoal text-sm">{bed.bed_number}</div>
              <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${WARD_COLORS[bed.ward] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {bed.ward}
              </span>
              <div className="mt-2">
                <VaBadge status={bed.status as any} />
              </div>
              {bed.patient_name && (
                <div className="text-xs text-va-gray-text mt-1 truncate">{bed.patient_name}</div>
              )}
            </motion.button>
          ))}
        </div>
      ) : (
        <VaCard className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-va-gray-light dark:bg-dark-surface text-va-gray-text text-xs">
              <tr>
                {['Bed No.', 'Ward', 'Type', 'Status', 'Patient', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-va-gray-light dark:divide-dark-border">
              {filtered.map(bed => (
                <tr key={bed.id} className="hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors">
                  <td className="px-4 py-3 font-bold">{bed.bed_number}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${WARD_COLORS[bed.ward] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {bed.ward}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-va-gray-text">{bed.bed_type || 'Standard'}</td>
                  <td className="px-4 py-3"><VaBadge status={bed.status as any} /></td>
                  <td className="px-4 py-3 text-va-gray-text">{bed.patient_name || '—'}</td>
                  <td className="px-4 py-3">
                    <VaButton size="xs" variant="ghost" onClick={() => cycleStatus(bed.id, bed.status)}>
                      Change Status
                    </VaButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </VaCard>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-va-gray-text">
          <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <div>No beds match the current filters</div>
        </div>
      )}
    </div>
  )
}
