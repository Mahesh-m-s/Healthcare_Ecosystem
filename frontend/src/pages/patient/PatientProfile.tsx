import { useAuthStore } from '../../store/authStore'
import { User, Heart, AlertCircle, Phone, Mail } from 'lucide-react'
import type { Patient } from '../../types/user.types'

export default function PatientProfile() {
  const { user } = useAuthStore()
  const patient = user as Patient|null

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">
      <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2"><User className="w-5 h-5 text-[#4F8CFF]" /> My Profile</h1>

      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#4F8CFF] text-white flex items-center justify-center text-2xl font-black">
            {patient?.fullName?.charAt(0) ?? 'P'}
          </div>
          <div>
            <p className="text-lg font-black text-[#2C2C2C]">{patient?.fullName}</p>
            <p className="text-sm text-[#7B7B7B]">{patient?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label:'Blood Group', value: patient?.bloodGroup ?? '–', icon: Heart, color:'text-red-500 bg-red-50' },
            { label:'Age', value: patient?.dateOfBirth ? `${Math.floor((Date.now()-new Date(patient.dateOfBirth).getTime())/3.156e10)} yrs` : '–', icon: User, color:'text-[#4F8CFF] bg-[#D9EDF7]' },
            { label:'Phone', value: patient?.phone ?? '–', icon: Phone, color:'text-purple-500 bg-purple-50' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#F8F8F8] rounded-xl p-3">
              <div className={`w-7 h-7 rounded-lg ${color.split(' ')[1]} flex items-center justify-center mb-2`}>
                <Icon className={`w-3.5 h-3.5 ${color.split(' ')[0]}`} />
              </div>
              <p className="text-xs text-[#7B7B7B]">{label}</p>
              <p className="text-sm font-bold text-[#2C2C2C]">{value}</p>
            </div>
          ))}
        </div>

        {(patient?.allergies?.length ?? 0) > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mb-2"><AlertCircle className="w-3.5 h-3.5" /> Allergies</p>
            <div className="flex flex-wrap gap-1.5">
              {patient!.allergies.map(a => <span key={a} className="text-xs bg-white text-amber-700 border border-amber-300 rounded-full px-2.5 py-0.5 font-medium">{a}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
