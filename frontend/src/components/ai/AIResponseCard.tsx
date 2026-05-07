import { motion } from 'framer-motion'
import { Brain, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import VaBadge from '../common/VaBadge'
import type { AIAnalysis } from '../../types/medical.types'
import { RISK_CONFIG } from '../../config/constants'

interface Props {
  analysis: AIAnalysis
  compact?: boolean
}

export default function AIResponseCard({ analysis, compact = false }: Props) {
  const [expanded, setExpanded] = useState(!compact)
  const riskCfg = RISK_CONFIG[analysis.risk_level] || RISK_CONFIG.LOW

  const borderColor = {
    LOW:      'border-emerald-200',
    MEDIUM:   'border-amber-200',
    HIGH:     'border-orange-200',
    CRITICAL: 'border-red-300',
  }[analysis.risk_level] || 'border-va-gray-light'

  const HeaderIcon = {
    LOW:      CheckCircle,
    MEDIUM:   Info,
    HIGH:     AlertTriangle,
    CRITICAL: AlertTriangle,
  }[analysis.risk_level] || Info

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 ${borderColor} rounded-va overflow-hidden bg-white dark:bg-dark-card`}
    >
      {/* Header */}
      <div className={`${riskCfg.classes} border-b ${borderColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span className="text-sm font-semibold">AI Analysis Result</span>
          <VaBadge risk={analysis.risk_level} />
        </div>
        {compact && (
          <button onClick={() => setExpanded(!expanded)} className="ml-2">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {(!compact || expanded) && (
        <div className="p-4 space-y-4">
          {/* Explanation */}
          {analysis.explanation && (
            <div>
              <div className="text-xs font-bold text-va-gray-text uppercase tracking-wider mb-1">Summary</div>
              <p className="text-sm text-va-charcoal dark:text-white leading-relaxed">{analysis.explanation}</p>
            </div>
          )}

          {/* Findings */}
          {analysis.findings && analysis.findings.length > 0 && (
            <div>
              <div className="text-xs font-bold text-va-gray-text uppercase tracking-wider mb-1.5">Key Findings</div>
              <ul className="space-y-1">
                {analysis.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <HeaderIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70" />
                    <span className="text-va-charcoal dark:text-white">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency indicators */}
          {analysis.emergency_indicators && analysis.emergency_indicators.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 rounded-va p-3">
              <div className="text-xs font-bold text-va-emergency mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Emergency Indicators
              </div>
              <ul className="space-y-0.5">
                {analysis.emergency_indicators.map((e, i) => (
                  <li key={i} className="text-xs text-va-emergency flex items-center gap-1">
                    <span>•</span> {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {analysis.next_steps && analysis.next_steps.length > 0 && (
            <div>
              <div className="text-xs font-bold text-va-gray-text uppercase tracking-wider mb-1.5">Recommended Next Steps</div>
              <ol className="space-y-1">
                {analysis.next_steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="font-bold text-va-blue shrink-0">{i + 1}.</span>
                    <span className="text-va-charcoal dark:text-white">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Specialist */}
          {analysis.specialist_referral && (
            <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-dark-surface rounded-va px-3 py-2">
              <Brain className="w-4 h-4 text-va-blue shrink-0" />
              <span className="text-va-gray-text">See a</span>
              <span className="font-semibold text-va-blue">{analysis.specialist_referral}</span>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-va-gray-text italic border-t border-va-gray-light dark:border-dark-border pt-3">
            AI-generated analysis. Not a substitute for professional medical advice. Consult a qualified physician.
          </p>
        </div>
      )}
    </motion.div>
  )
}
