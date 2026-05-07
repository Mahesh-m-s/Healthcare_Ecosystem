import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, FileText, Pill, Calendar, Stethoscope } from 'lucide-react'
import { format } from 'date-fns'
import { usePatientStore } from '../../store/patientStore'
import { RISK_CONFIG } from '../../config/constants'

export default function MedicalHistory() {
  const { vault, analyses, appointments, loadVault, loadAppointments } = usePatientStore()
  useEffect(() => { loadVault(); loadAppointments() }, [])

  const timeline = [
    ...vault.map(f => ({ date: f.uploadDate, type:'report' as const, data: f })),
    ...appointments.map(a => ({ date: a.appointmentDate, type:'appointment' as const, data: a })),
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-500" /> Medical History
        </h1>
        <p className="text-sm text-[#7B7B7B] mt-0.5">Chronological timeline of your health records</p>
      </div>

      {timeline.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAEAEA] p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <History className="w-12 h-12 mx-auto mb-3 text-[#EAEAEA]" />
          <p className="text-sm font-medium text-[#7B7B7B]">No history yet</p>
          <p className="text-xs text-[#7B7B7B] mt-1">Upload reports and book appointments to build your timeline</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#EAEAEA]" />
          <div className="space-y-4 pl-14">
            {timeline.map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }}
                className="relative">
                <div className="absolute -left-9 w-8 h-8 rounded-full border-2 border-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex items-center justify-center"
                  style={{ background: item.type === 'report' ? '#DCD6F7' : '#DDEEE8' }}>
                  {item.type === 'report'
                    ? <FileText className="w-4 h-4 text-indigo-600" />
                    : <Calendar className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {item.type === 'report' ? (
                        <>
                          <p className="text-sm font-bold text-[#2C2C2C] truncate">{item.data.originalName}</p>
                          <p className="text-xs text-[#7B7B7B] capitalize mt-0.5">{item.data.reportType.replace('_',' ')}</p>
                          {(() => {
                            const a = analyses[item.data.fileUuid]
                            const risk = a?.result?.riskLevel
                            const cfg = risk ? RISK_CONFIG[risk] : null
                            return cfg ? <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.classes}`}>{risk}</span> : null
                          })()}
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-[#2C2C2C]">
                            {item.data.doctorName ? `Dr. ${item.data.doctorName}` : 'Appointment'}
                          </p>
                          <p className="text-xs text-[#7B7B7B] capitalize mt-0.5">{item.data.type} · {item.data.status}</p>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-[#7B7B7B] shrink-0 font-medium">{format(new Date(item.date), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
