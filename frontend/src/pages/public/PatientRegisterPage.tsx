import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Phone, Eye, EyeOff, ChevronRight, CheckCircle, Loader2, Calendar } from 'lucide-react'
import { apiClient } from '../../api/client'
import VaButton from '../../components/common/VaButton'
import toast from 'react-hot-toast'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't know"]

const STEPS = [
  { label: 'Account',  icon: User },
  { label: 'Personal', icon: Calendar },
  { label: 'Health',   icon: CheckCircle },
]

export default function PatientRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    date_of_birth: '', gender: 'Male', blood_group: "Don't know",
    allergies: '', emergency_contact_name: '', emergency_contact_phone: '',
  })

  const set = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: v }))

  const handleNext = () => {
    if (step === 0) {
      if (!form.name || !form.email || !form.password || form.password.length < 8) {
        toast.error('Please fill all fields. Password must be at least 8 characters.')
        return
      }
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post('/auth/register/patient', {
        ...form,
        allergies: form.allergies ? form.allergies.split(',').map(a => a.trim()).filter(Boolean) : [],
      })
      toast.success('Registration successful! Please log in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-3 py-2.5 border border-va-gray-light rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"

  return (
    <div className="min-h-screen bg-va-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-va-lg shadow-va-card mb-3">
            <span className="text-2xl">⚕️</span>
          </div>
          <h1 className="text-xl font-bold text-va-charcoal">Create Patient Account</h1>
          <p className="text-va-gray-text text-sm mt-1">VaidyaAstra — Your Health, Secured</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-va-xl shadow-va-glass p-8"
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      i < step  ? 'bg-va-success text-white' :
                      i === step ? 'bg-va-blue text-white' :
                                   'bg-va-gray-light text-va-gray-text'
                    }`}>
                      {i < step ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs mt-1 ${i === step ? 'text-va-blue font-medium' : 'text-va-gray-text'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px flex-1 mx-3 mb-4 ${i < step ? 'bg-va-success' : 'bg-va-gray-light'}`} style={{ width: 40 }} />
                  )}
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 9XXXXXXXXX" className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                      <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" className={`${inputCls} pl-9 pr-9`} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-va-gray-text">
                        {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Date of Birth</label>
                    <input type="date" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Gender</label>
                    <div className="flex gap-2">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button key={g} type="button" onClick={() => set('gender', g)}
                          className={`flex-1 py-2 rounded-va border text-sm transition-all ${form.gender === g ? 'border-va-blue bg-blue-50 text-va-blue' : 'border-va-gray-light text-va-gray-text'}`}
                        >{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Blood Group</label>
                    <div className="grid grid-cols-3 gap-2">
                      {BLOOD_GROUPS.map(bg => (
                        <button key={bg} type="button" onClick={() => set('blood_group', bg)}
                          className={`py-2 rounded-va border text-sm transition-all ${form.blood_group === bg ? 'border-va-blue bg-blue-50 text-va-blue font-medium' : 'border-va-gray-light text-va-gray-text'}`}
                        >{bg}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Allergies <span className="font-normal">(comma-separated)</span></label>
                    <input value={form.allergies} onChange={e => set('allergies', e.target.value)} placeholder="e.g., Penicillin, Shellfish, Latex" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Emergency Contact Name</label>
                    <input value={form.emergency_contact_name} onChange={e => set('emergency_contact_name', e.target.value)} placeholder="Parent / Spouse / Guardian" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-va-gray-text mb-1.5 block">Emergency Contact Phone</label>
                    <input type="tel" value={form.emergency_contact_phone} onChange={e => set('emergency_contact_phone', e.target.value)} placeholder="+91 9XXXXXXXXX" className={inputCls} />
                  </div>
                  <VaButton
                    type="submit"
                    variant="primary"
                    className="w-full justify-center mt-2"
                    disabled={loading}
                    icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </VaButton>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 2 && (
            <VaButton variant="primary" className="w-full justify-center mt-6" icon={<ChevronRight className="w-4 h-4" />} onClick={handleNext}>
              Continue
            </VaButton>
          )}

          <p className="text-center text-sm text-va-gray-text mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-va-blue hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
