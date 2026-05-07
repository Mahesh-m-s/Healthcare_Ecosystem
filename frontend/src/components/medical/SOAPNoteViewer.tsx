import { Stethoscope, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import type { SOAPNote } from '../../types/medical.types'

export default function SOAPNoteViewer({ note }: { note: SOAPNote }) {
  const n = note as any
  const FIELDS = [
    { key: 'subjective',  label: 'S — Subjective',  color: 'border-va-blue' },
    { key: 'objective',   label: 'O — Objective',   color: 'border-va-success' },
    { key: 'assessment',  label: 'A — Assessment',  color: 'border-va-warning' },
    { key: 'plan',        label: 'P — Plan',         color: 'border-va-purple' },
  ] as const

  return (
    <div className="bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-va-gray-light dark:bg-dark-surface">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-va-blue" />
          <span className="text-sm font-medium text-va-charcoal dark:text-white">{n.visit_type || 'Clinical Visit'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-va-gray-text">
          {n.doctor_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />Dr. {n.doctor_name}</span>}
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(note.created_at), 'dd MMM yyyy')}</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, color }) => n[key] && (
          <div key={key} className={`border-l-4 ${color} pl-3 py-1`}>
            <div className="text-xs font-bold text-va-gray-text uppercase tracking-wider mb-1">{label}</div>
            <div className="text-sm text-va-charcoal dark:text-white leading-relaxed">{n[key]}</div>
          </div>
        ))}
      </div>
      {n.follow_up && (
        <div className="px-4 py-2 border-t border-va-gray-light dark:border-dark-border text-xs text-va-gray-text">
          Follow-up: <span className="font-medium text-va-charcoal dark:text-white">{format(new Date(n.follow_up), 'dd MMM yyyy')}</span>
        </div>
      )}
    </div>
  )
}
