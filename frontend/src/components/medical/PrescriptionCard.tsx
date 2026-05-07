import { Pill, Calendar, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import type { Prescription } from '../../types/medical.types'

export default function PrescriptionCard({ prescription }: { prescription: Prescription }) {
  const [expanded, setExpanded] = useState(false)
  const rx = prescription as any

  return (
    <div className="border border-va-gray-light dark:border-dark-border rounded-va overflow-hidden bg-white dark:bg-dark-card">
      <div className="flex items-center justify-between px-4 py-3 bg-va-gray-light dark:bg-dark-surface">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-va-blue" />
          <span className="text-sm font-medium text-va-charcoal dark:text-white">
            Prescription — {format(new Date(rx.created_at || Date.now()), 'dd MMM yyyy')}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${rx.is_active ? 'bg-emerald-100 text-va-success' : 'bg-va-gray-light text-va-gray-text'}`}>
            {rx.is_active ? 'Active' : 'Expired'}
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronUp className="w-4 h-4 text-va-gray-text" /> : <ChevronDown className="w-4 h-4 text-va-gray-text" />}
        </button>
      </div>
      {expanded && (
        <div className="p-4 space-y-3">
          {rx.diagnosis && (
            <div className="text-sm">
              <span className="text-va-gray-text">Diagnosis: </span>
              <span className="font-medium text-va-charcoal dark:text-white">{rx.diagnosis}</span>
            </div>
          )}
          {prescription.medications?.map((med: any, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm p-2 bg-va-gray-light dark:bg-dark-surface rounded-va">
              <Pill className="w-3.5 h-3.5 text-va-blue mt-0.5 shrink-0" />
              <div>
                <div className="font-medium text-va-charcoal dark:text-white">{med.name} · {med.dosage}</div>
                <div className="text-xs text-va-gray-text">{med.frequency} · {med.duration}{med.instructions ? ` · ${med.instructions}` : ''}</div>
              </div>
            </div>
          ))}
          {rx.notes && <div className="text-xs text-va-gray-text italic">{rx.notes}</div>}
          {rx.doctor_name && (
            <div className="flex items-center gap-1 text-xs text-va-gray-text">
              <User className="w-3 h-3" /> Dr. {rx.doctor_name}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
