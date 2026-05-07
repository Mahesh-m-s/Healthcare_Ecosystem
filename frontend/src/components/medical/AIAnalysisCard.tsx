import { motion } from 'framer-motion'
import { Brain, Clock, ChevronRight } from 'lucide-react'
import VaBadge from '../common/VaBadge'
import { RISK_CONFIG } from '../../config/constants'
import type { AIAnalysis } from '../../types/medical.types'
import { format } from 'date-fns'

interface Props { analysis: AIAnalysis; onClick?: () => void; fileName?: string }

export default function AIAnalysisCard({ analysis, onClick, fileName }: Props) {
  const cfg = RISK_CONFIG[analysis.risk_level] || RISK_CONFIG.LOW
  const dotStyle = { backgroundColor: cfg.dot }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={onClick}
      className={`border rounded-va p-4 cursor-pointer transition-shadow hover:shadow-va-card bg-white dark:bg-dark-card ${onClick ? '' : 'cursor-default'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={dotStyle} />
          <div className="min-w-0">
            {fileName && <div className="text-sm font-medium text-va-charcoal dark:text-white truncate">{fileName}</div>}
            <div className="text-xs text-va-gray-text line-clamp-2 mt-0.5">{analysis.explanation}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <VaBadge risk={analysis.risk_level} />
          {onClick && <ChevronRight className="w-4 h-4 text-va-gray-text" />}
        </div>
      </div>
      {analysis.analyzed_at && (
        <div className="mt-2 flex items-center gap-1 text-xs text-va-gray-text">
          <Clock className="w-3 h-3" />
          {format(new Date(analysis.analyzed_at), 'dd MMM yyyy · HH:mm')}
          <span className="ml-1 flex items-center gap-1 text-va-purple">
            <Brain className="w-3 h-3" /> Gemini AI
          </span>
        </div>
      )}
    </motion.div>
  )
}
