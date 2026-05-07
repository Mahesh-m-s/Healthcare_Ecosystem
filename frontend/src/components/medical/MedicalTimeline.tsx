import { motion } from 'framer-motion'
import { FileText, Stethoscope, Pill, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import VaBadge from '../common/VaBadge'

interface TimelineItem {
  id: string; type: 'report' | 'appointment' | 'prescription' | 'emergency'
  title: string; subtitle?: string; date: string
  risk_level?: string; status?: string
}

export default function MedicalTimeline({ items }: { items: TimelineItem[] }) {
  const ICON_MAP = { report: FileText, appointment: Stethoscope, prescription: Pill, emergency: AlertCircle }
  const COLOR_MAP = {
    report:       'bg-blue-100 text-va-blue border-blue-200',
    appointment:  'bg-emerald-100 text-va-success border-emerald-200',
    prescription: 'bg-purple-100 text-va-purple border-purple-200',
    emergency:    'bg-red-100 text-va-emergency border-red-200',
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-va-gray-light dark:bg-dark-border" />
      <div className="space-y-4">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.type] || FileText
          const colorCls = COLOR_MAP[item.type] || COLOR_MAP.report
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 relative"
            >
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${colorCls}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va p-3 hover:shadow-va-card transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-va-charcoal dark:text-white text-sm">{item.title}</div>
                    {item.subtitle && <div className="text-xs text-va-gray-text mt-0.5">{item.subtitle}</div>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.risk_level && <VaBadge risk={item.risk_level as any} />}
                    {item.status && !item.risk_level && <VaBadge status={item.status as any} />}
                    <span className="text-xs text-va-gray-text">{format(new Date(item.date), 'dd MMM')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
