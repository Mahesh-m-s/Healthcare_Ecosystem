import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Phone, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useEmergencyStore } from '../../store/emergencyStore'
import { EMERGENCY_PHONE } from '../../config/constants'

interface SOSButtonProps { compact?: boolean }

export default function SOSButton({ compact = false }: SOSButtonProps) {
  const { triggerSOS, isTriggering, activeEmergency } = useEmergencyStore()
  const [confirm, setConfirm] = useState(false)

  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setConfirm(true)}
        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[#FF4B4B] text-sm font-bold hover:bg-red-100 transition-all"
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <AlertTriangle className="w-4 h-4" />
        </motion.div>
        Emergency SOS
      </motion.button>
    )
  }

  return (
    <>
      {/* Full SOS button */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Ping rings */}
          {!activeEmergency && (
            <>
              <motion.div className="absolute inset-0 rounded-full bg-[#FF4B4B]/20"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }} />
              <motion.div className="absolute inset-0 rounded-full bg-[#FF4B4B]/10"
                animate={{ scale: [1, 2], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeOut' }} />
            </>
          )}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => !activeEmergency && setConfirm(true)}
            disabled={isTriggering}
            className="relative w-28 h-28 rounded-full bg-[#FF4B4B] text-white flex flex-col items-center justify-center gap-1 shadow-[0_0_32px_rgba(255,75,75,0.5)] hover:shadow-[0_0_48px_rgba(255,75,75,0.7)] transition-shadow disabled:opacity-70"
          >
            {isTriggering ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <AlertTriangle className="w-7 h-7" />
                <span className="text-sm font-black tracking-widest">SOS</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-[#2C2C2C]">Emergency Button</p>
          <p className="text-xs text-[#7B7B7B] mt-0.5">Press to alert hospitals & family</p>
        </div>

        <a href={`tel:${EMERGENCY_PHONE}`}
          className="flex items-center gap-2 text-xs text-[#7B7B7B] hover:text-[#FF4B4B] transition-colors">
          <Phone className="w-3.5 h-3.5" />
          Call {EMERGENCY_PHONE} (National Emergency)
        </a>
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {confirm && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirm(false)} />
            <motion.div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[70] max-w-sm mx-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className="bg-white rounded-2xl p-6 shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-[#FF4B4B]" />
                </div>
                <h3 className="text-lg font-bold text-[#2C2C2C] mb-2">Confirm Emergency</h3>
                <p className="text-sm text-[#7B7B7B] mb-6">This will alert nearby hospitals, dispatch an ambulance, and notify your emergency contacts.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#EAEAEA] text-sm font-medium text-[#7B7B7B] hover:bg-[#F8F8F8]">
                    Cancel
                  </button>
                  <button onClick={() => { setConfirm(false); triggerSOS() }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#FF4B4B] text-white text-sm font-bold hover:bg-red-500 shadow-[0_0_16px_rgba(255,75,75,0.4)]">
                    SEND EMERGENCY
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
