import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Loader2, Stethoscope, Building2, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import VaButton from '../../components/common/VaButton'

const ROLES = [
  { key: 'patient',  label: 'Patient',  icon: User,       desc: 'Access your health records, AI analysis & emergency SOS' },
  { key: 'doctor',   label: 'Doctor',   icon: Stethoscope,desc: 'View patient charts, write prescriptions, AI assistant' },
  { key: 'hospital', label: 'Hospital', icon: Building2,  desc: 'Manage beds, emergencies, staff & operations' },
] as const

export default function UniversalLoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuthStore()
  const [role, setRole] = useState<'patient' | 'doctor' | 'hospital'>('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    await login({ email, password, role })
    // navigation handled inside store after successful login
    const r = useAuthStore.getState().user?.role
    if (r === 'patient')  navigate('/patient')
    else if (r === 'doctor')   navigate('/doctor')
    else if (r === 'hospital') navigate('/hospital')
  }

  return (
    <div className="min-h-screen bg-va-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-va-lg shadow-va-card mb-4">
            <span className="text-3xl">⚕️</span>
          </div>
          <h1 className="text-2xl font-bold text-va-charcoal">VaidyaAstra</h1>
          <p className="text-va-gray-text text-sm mt-1">AI-Powered Universal Healthcare OS</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-va-xl shadow-va-glass p-8"
        >
          <h2 className="text-lg font-semibold text-va-charcoal mb-6">Sign In</h2>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-va border-2 transition-all text-xs font-medium ${
                  role === key
                    ? 'border-va-blue bg-blue-50 text-va-blue'
                    : 'border-va-gray-light text-va-gray-text hover:border-va-blue hover:text-va-blue'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-va-gray-text mb-6 text-center">
            {ROLES.find(r => r.key === role)?.desc}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-va-gray-text mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-va-gray-light rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-va-gray-text mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-va-gray-text" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 border border-va-gray-light rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-va-gray-text"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-va-emergency text-xs bg-red-50 border border-red-200 rounded-va px-3 py-2"
              >
                {error}
              </motion.div>
            )}

            <VaButton
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={loading}
              icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </VaButton>
          </form>

          {role === 'patient' && (
            <p className="text-center text-sm text-va-gray-text mt-4">
              New patient?{' '}
              <Link to="/register" className="text-va-blue hover:underline font-medium">
                Create account
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
