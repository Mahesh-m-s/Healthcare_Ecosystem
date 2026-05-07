import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowRight, Activity, FileText, Brain } from 'lucide-react'
import { useDoctorStore } from '../../store/doctorStore'
import VaCard from '../../components/common/VaCard'
import VaBadge from '../../components/common/VaBadge'
import VaButton from '../../components/common/VaButton'

export default function MyPatients() {
  const navigate = useNavigate()
  const { assignedPatients, loadAssignedPatients } = useDoctorStore()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  useEffect(() => { loadAssignedPatients() }, [])

  const filtered = assignedPatients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        ((p as any).primary_condition || '').toLowerCase().includes(search.toLowerCase())
    const matchRisk = riskFilter === 'all' || (p as any).risk_level === riskFilter
    return matchSearch && matchRisk
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white">My Patients</h1>
          <p className="text-va-gray-text text-sm mt-0.5">{assignedPatients.length} patients assigned to you</p>
        </div>
      </div>

      {/* Risk filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(r => (
          <button
            key={r}
            onClick={() => setRiskFilter(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              riskFilter === r
                ? 'bg-va-blue text-white'
                : 'bg-va-gray-light dark:bg-dark-surface text-va-gray-text hover:bg-va-blue hover:bg-opacity-10'
            }`}
          >
            {r === 'all' ? 'All' : r}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..."
          className="w-full pl-9 pr-4 py-2.5 bg-va-gray-light dark:bg-dark-surface border border-transparent dark:border-dark-border rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((patient, i) => {
          const p = patient as any
          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
            >
              <VaCard
                className="p-5 cursor-pointer"
                onClick={() => navigate(`/doctor/patients/${patient.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-va-lavender to-va-mint flex items-center justify-center text-va-charcoal font-bold text-lg shrink-0">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-va-charcoal dark:text-white truncate">{patient.name}</div>
                    </div>
                    <div className="text-xs text-va-gray-text">
                      {p.age ? `${p.age}y · ` : ''}{p.gender || ''}{p.blood_group ? ` · ${p.blood_group}` : ''}
                    </div>
                    <div className="text-sm text-va-blue mt-0.5">{p.primary_condition || 'Under observation'}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {p.risk_level ? <VaBadge risk={p.risk_level} /> : <span />}
                  <div className="flex items-center gap-1 text-xs text-va-gray-text">
                    {p.pending_reports > 0 && (
                      <span className="bg-va-warning text-white text-xs px-1.5 py-0.5 rounded-full mr-1">
                        {p.pending_reports} reports
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <VaButton
                    size="xs" variant="ghost"
                    icon={<Brain className="w-3 h-3" />}
                    onClick={e => { e.stopPropagation(); navigate(`/doctor/patients/${patient.id}`) }}
                  >
                    AI Summary
                  </VaButton>
                  <VaButton
                    size="xs" variant="ghost"
                    icon={<FileText className="w-3 h-3" />}
                    onClick={e => { e.stopPropagation(); navigate(`/doctor/notes?patient=${patient.id}`) }}
                  >
                    SOAP Note
                  </VaButton>
                </div>
              </VaCard>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-va-gray-text">
          <Activity className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <div>No patients found</div>
        </div>
      )}
    </div>
  )
}
