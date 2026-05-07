import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderHeart, Upload, Search, Filter, Brain, FileText, AlertCircle, CheckCircle2, Clock, ChevronRight, X } from 'lucide-react'
import { format } from 'date-fns'
import { usePatientStore } from '../../store/patientStore'
import { RISK_CONFIG, REPORT_TYPES } from '../../config/constants'
import type { MedicalFile } from '../../types/medical.types'
import VaFileUpload from '../../components/common/VaFileUpload'
import VaModal from '../../components/common/VaModal'

const ICON_MAP: Record<string, string> = { mri:'🧠', ct:'🔬', xray:'🦴', blood:'🩸', ecg:'❤️', prescription:'💊', discharge:'📋' }

export default function MedicalVault() {
  const { vault, analyses, isUploading, uploadProgress, loadVault, uploadFile, loadAnalysis } = usePatientStore()
  const [showUpload, setShowUpload]   = useState(false)
  const [search, setSearch]           = useState('')
  const [filterType, setFilterType]   = useState<string>('all')
  const [selectedFile, setSelectedFile] = useState<MedicalFile | null>(null)

  useEffect(() => { loadVault() }, [])

  const filtered = vault.filter(f => {
    const matchSearch = f.originalName.toLowerCase().includes(search.toLowerCase()) || f.reportType.includes(search.toLowerCase())
    const matchType   = filterType === 'all' || f.reportType === filterType
    return matchSearch && matchType
  })

  const stats = {
    total:    vault.length,
    analyzed: vault.filter(f => f.analysisStatus === 'completed').length,
    critical: vault.filter(f => analyses[f.fileUuid]?.result?.riskLevel === 'CRITICAL').length,
    pending:  vault.filter(f => ['pending','processing'].includes(f.analysisStatus ?? '')).length,
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-purple-500" /> Medical Vault
          </h1>
          <p className="text-sm text-[#7B7B7B] mt-0.5">Your encrypted health records — AI-analyzed</p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F8CFF] text-white rounded-xl text-sm font-bold shadow-[0_0_16px_rgba(79,140,255,0.3)] hover:bg-blue-500 transition-all">
          <Upload className="w-4 h-4" /> Upload Report
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: stats.total,    color: 'text-[#4F8CFF]',   bg: 'bg-[#D9EDF7]'   },
          { label: 'AI Analyzed',   value: stats.analyzed, color: 'text-purple-600',  bg: 'bg-purple-50'   },
          { label: 'Critical Flags',value: stats.critical, color: 'text-[#FF4B4B]',   bg: 'bg-red-50'      },
          { label: 'In Progress',   value: stats.pending,  color: 'text-amber-600',   bg: 'bg-amber-50'    },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#7B7B7B] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7B7B7B]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#4F8CFF] transition-colors" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm text-[#2C2C2C] focus:outline-none focus:border-[#4F8CFF]">
          <option value="all">All Types</option>
          {REPORT_TYPES.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
        </select>
      </div>

      {/* File grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center">
          <FolderHeart className="w-12 h-12 mx-auto mb-3 text-[#EAEAEA]" />
          <p className="text-[#7B7B7B] font-medium">No reports found</p>
          <button onClick={() => setShowUpload(true)} className="mt-3 text-sm text-[#4F8CFF] font-medium hover:underline">
            Upload your first report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((f, i) => {
              const analysis  = analyses[f.fileUuid]
              const risk      = analysis?.result?.riskLevel
              const riskCfg   = risk ? RISK_CONFIG[risk] : null
              return (
                <motion.div key={f.fileUuid} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelectedFile(f); if (!analysis) loadAnalysis(f.fileUuid) }}
                  className="bg-white rounded-2xl border border-[#EAEAEA] p-4 cursor-pointer hover:shadow-[0_8px_32px_rgba(79,140,255,0.12)] hover:-translate-y-0.5 transition-all">
                  {/* File header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-[#F8F8F8] rounded-xl flex items-center justify-center text-xl">
                      {ICON_MAP[f.reportType] ?? '📄'}
                    </div>
                    {/* Status indicator */}
                    {f.analysisStatus === 'completed' && riskCfg ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskCfg.classes}`}>{risk}</span>
                    ) : f.analysisStatus === 'processing' || f.analysisStatus === 'pending' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        <Clock className="w-2.5 h-2.5 animate-spin" /> AI...
                      </span>
                    ) : f.analysisStatus === 'failed' ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">Failed</span>
                    ) : null}
                  </div>

                  <p className="text-sm font-bold text-[#2C2C2C] truncate">{f.originalName}</p>
                  <p className="text-xs text-[#7B7B7B] mt-0.5 capitalize">{f.reportType.replace('_',' ')}</p>
                  <p className="text-[10px] text-[#7B7B7B] mt-1">{format(new Date(f.uploadDate), 'MMM d, yyyy · HH:mm')}</p>

                  {analysis?.result?.summary && (
                    <p className="text-xs text-[#7B7B7B] mt-2.5 line-clamp-2 leading-relaxed border-t border-[#F8F8F8] pt-2.5">
                      {analysis.result.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[#7B7B7B]">{(f.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                    <ChevronRight className="w-4 h-4 text-[#EAEAEA]" />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      <VaModal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Medical Report" subtitle="AI will analyze and explain your report in plain language">
        <VaFileUpload onUpload={async (file, type) => { await uploadFile(file, type); setShowUpload(false) }} isUploading={isUploading} uploadProgress={uploadProgress} />
      </VaModal>

      {/* Analysis Detail Modal */}
      <VaModal isOpen={!!selectedFile} onClose={() => setSelectedFile(null)} title={selectedFile?.originalName ?? 'Report'} size="lg"
        subtitle={selectedFile ? `${selectedFile.reportType} · ${format(new Date(selectedFile.uploadDate), 'MMM d, yyyy')}` : undefined}>
        {selectedFile && (() => {
          const a = analyses[selectedFile.fileUuid]
          if (!a || a.status !== 'completed') return (
            <div className="text-center py-8">
              <Brain className="w-10 h-10 mx-auto text-purple-400 animate-pulse mb-3" />
              <p className="font-semibold text-[#2C2C2C]">AI Analysis {a?.status === 'processing' ? 'in progress...' : 'pending'}</p>
              <p className="text-sm text-[#7B7B7B] mt-1">This usually takes 10–30 seconds</p>
            </div>
          )
          const r = a.result!
          const risk = r.riskLevel
          const cfg  = RISK_CONFIG[risk]
          return (
            <div className="space-y-5">
              {/* Risk level */}
              <div className={`${cfg.classes} border rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  {risk === 'CRITICAL' || risk === 'HIGH' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  <p className="font-bold text-lg">{cfg.label}</p>
                </div>
                <p className="text-sm">{r.riskExplanation}</p>
              </div>

              {/* Plain language explanation */}
              <div>
                <h3 className="text-sm font-bold text-[#2C2C2C] mb-2 flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-500" /> AI Explanation</h3>
                <p className="text-sm text-[#7B7B7B] leading-relaxed bg-[#F8F8F8] rounded-xl p-4">{r.patientFriendlyExplanation}</p>
              </div>

              {/* Findings */}
              {r.findings.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#2C2C2C] mb-2">Key Findings</h3>
                  <ul className="space-y-1.5">
                    {r.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#7B7B7B]">
                        <span className="text-[#4F8CFF] mt-0.5 shrink-0">▸</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emergency indicators */}
              {r.emergencyIndicators.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-700 mb-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Emergency Indicators</p>
                  {r.emergencyIndicators.map((e, i) => <p key={i} className="text-xs text-red-600">• {e}</p>)}
                </div>
              )}

              {/* Specialist recommendation */}
              <div className="bg-[#D9EDF7] rounded-xl p-3">
                <p className="text-xs font-bold text-[#4F8CFF] mb-0.5">Recommended Specialist</p>
                <p className="text-sm font-semibold text-[#2C2C2C]">{r.specialistRecommendation}</p>
              </div>

              {/* Next steps */}
              <div>
                <h3 className="text-sm font-bold text-[#2C2C2C] mb-2">Next Steps</h3>
                {r.nextSteps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-1.5">
                    <span className="w-5 h-5 bg-[#4F8CFF]/10 text-[#4F8CFF] rounded-full text-xs font-bold flex items-center justify-center shrink-0">{i+1}</span>
                    <p className="text-sm text-[#7B7B7B]">{s}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#7B7B7B] italic border-t border-[#EAEAEA] pt-3">{r.disclaimer}</p>
            </div>
          )
        })()}
      </VaModal>
    </div>
  )
}
