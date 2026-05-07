import { motion } from 'framer-motion'
import { FileText, Image, Loader2, Brain } from 'lucide-react'
import VaBadge from '../common/VaBadge'
import { REPORT_TYPES } from '../../config/constants'
import type { MedicalFile } from '../../types/medical.types'
import { format } from 'date-fns'

interface Props { file: MedicalFile; onClick?: () => void; onAnalyze?: () => void; analyzing?: boolean }

export default function ReportCard({ file, onClick, onAnalyze, analyzing }: Props) {
  const reportType = REPORT_TYPES.find(r => r.value === file.report_type)
  const isImage = ['jpg', 'jpeg', 'png'].some(ext => file.original_name.toLowerCase().endsWith(ext))

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va p-4 cursor-pointer hover:shadow-va-card transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-va-gray-light dark:bg-dark-surface rounded-va flex items-center justify-center text-xl shrink-0">
          {reportType?.icon || '📄'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-va-charcoal dark:text-white text-sm truncate">{file.original_name}</div>
          <div className="text-xs text-va-gray-text">
            {reportType?.label || file.report_type} · {format(new Date(file.uploaded_at), 'dd MMM yyyy')}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {file.ai_analysis ? (
            <VaBadge risk={file.ai_analysis.risk_level as any} />
          ) : onAnalyze ? (
            <button
              onClick={e => { e.stopPropagation(); onAnalyze() }}
              className="flex items-center gap-1 text-xs text-va-purple bg-purple-50 border border-purple-200 rounded-full px-2.5 py-1 hover:bg-purple-100 transition-colors"
            >
              {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          ) : (
            <span className="text-xs text-va-gray-text bg-va-gray-light px-2 py-0.5 rounded-full">Not analyzed</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
