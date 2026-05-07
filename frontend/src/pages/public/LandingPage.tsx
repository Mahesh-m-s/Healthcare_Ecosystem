import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, Ambulance, Shield, Globe, Stethoscope, Building2, User,
  ArrowRight, CheckCircle, Zap, Heart, FileText, MapPin, Star
} from 'lucide-react'
import VaButton from '../../components/common/VaButton'

const FEATURES = [
  { icon: Brain,     title: 'Gemini AI Analysis',      desc: 'Upload MRI, CT, X-Ray, blood reports — get instant AI-powered diagnosis and risk assessment.',  color: 'text-va-purple', bg: 'bg-purple-50' },
  { icon: Ambulance, title: 'Emergency SOS System',    desc: 'One-tap SOS triggers GPS-based ambulance dispatch, AI triage, and real-time hospital coordination.', color: 'text-va-emergency', bg: 'bg-red-50' },
  { icon: Shield,    title: 'Medical Vault',            desc: 'Encrypted lifetime storage for all your medical records, prescriptions and reports.',               color: 'text-va-blue',   bg: 'bg-blue-50' },
  { icon: Globe,     title: '12 Indian Languages',     desc: 'Full platform support in Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali and more.',              color: 'text-va-success', bg: 'bg-emerald-50' },
  { icon: MapPin,    title: 'Google Maps Integration', desc: 'Find nearby hospitals, track ambulances live, and navigate to the nearest emergency care.',         color: 'text-amber-600',  bg: 'bg-amber-50' },
  { icon: FileText,  title: 'Insurance AI Advisor',    desc: 'Upload your insurance policy and ask questions — AI explains your coverage in plain language.',     color: 'text-va-charcoal', bg: 'bg-va-gray-light' },
]

const PORTALS = [
  {
    role: 'patient', icon: User, title: 'Patient Portal',
    color: 'from-va-lavender to-va-blue-light',
    features: ['Medical Vault & AI Analysis', 'Emergency SOS Button', 'Doctor Booking', 'Symptom Checker', 'Hospital Finder'],
    cta: 'Register as Patient', path: '/register',
  },
  {
    role: 'hospital', icon: Building2, title: 'Hospital Portal',
    color: 'from-va-mint to-va-lime',
    features: ['Live Bed Management', 'Emergency Command Center', 'Doctor Management', 'Patient Monitoring', 'Ambulance Tracking'],
    cta: 'Hospital Login', path: '/login',
  },
  {
    role: 'doctor', icon: Stethoscope, title: 'Doctor Portal',
    color: 'from-blue-100 to-purple-100',
    features: ['AI Patient Summaries', 'SOAP Clinical Notes', 'Prescription Writer', 'MRI/CT Viewer', 'Emergency Alerts'],
    cta: 'Doctor Login', path: '/login',
  },
]

const STATS = [
  { value: '6', label: 'AI Services', sub: 'Powered by Gemini' },
  { value: '12', label: 'Languages', sub: 'Indian languages' },
  { value: '3', label: 'Portals', sub: 'Patient · Hospital · Doctor' },
  { value: '50MB', label: 'File Vault', sub: 'Per upload limit' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-sm border-b border-va-gray-light">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-va-charcoal text-lg">
            <span className="text-2xl">⚕️</span> VaidyaAstra
          </div>
          <div className="flex items-center gap-3">
            <VaButton variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</VaButton>
            <VaButton variant="primary" size="sm" onClick={() => navigate('/register')}>Get Started</VaButton>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-va-gradient pt-20 pb-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-70 rounded-full px-4 py-1.5 text-sm text-va-blue font-medium mb-6 shadow-va-card">
              <Zap className="w-4 h-4" /> Powered by Google Gemini AI
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-va-charcoal leading-tight mb-6">
              AI-Powered Universal<br />
              <span className="text-va-blue">Healthcare Operating System</span>
            </h1>
            <p className="text-lg text-va-gray-text max-w-2xl mx-auto mb-8">
              VaidyaAstra connects Patients, Hospitals, and Doctors in one intelligent platform —
              with AI diagnosis, emergency SOS, and real-time coordination across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <VaButton variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} onClick={() => navigate('/register')}>
                Start as Patient — Free
              </VaButton>
              <VaButton variant="secondary" size="lg" onClick={() => navigate('/login')}>
                Hospital / Doctor Login
              </VaButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 -mt-12">
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ value, label, sub }) => (
            <div key={label} className="bg-white rounded-va-lg shadow-va-card p-5 text-center">
              <div className="text-3xl font-black text-va-blue">{value}</div>
              <div className="font-semibold text-va-charcoal text-sm mt-0.5">{label}</div>
              <div className="text-xs text-va-gray-text mt-0.5">{sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-va-charcoal mb-3">Everything Healthcare Needs</h2>
          <p className="text-va-gray-text max-w-xl mx-auto">One platform for patients, hospitals, and doctors — built for India's scale.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div key={title} {...fadeUp(i * 0.07)}>
              <div className="bg-white rounded-va-lg shadow-va-card p-6 h-full hover:shadow-va-hover transition-shadow">
                <div className={`w-11 h-11 rounded-va ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-va-charcoal mb-2">{title}</h3>
                <p className="text-sm text-va-gray-text leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portal Cards */}
      <section className="bg-va-gradient py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-va-charcoal mb-3">Three Powerful Portals</h2>
            <p className="text-va-gray-text">Tailored experiences for every healthcare stakeholder.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTALS.map(({ icon: Icon, title, color, features, cta, path }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.1)}>
                <div className="bg-white rounded-va-xl shadow-va-card p-6 h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-va bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-va-charcoal" />
                  </div>
                  <h3 className="font-bold text-va-charcoal text-lg mb-3">{title}</h3>
                  <ul className="space-y-2 flex-1 mb-5">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-va-gray-text">
                        <CheckCircle className="w-4 h-4 text-va-success shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <VaButton variant="primary" className="w-full justify-center" onClick={() => navigate(path)}>
                    {cta}
                  </VaButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <section className="bg-va-emergency py-16 px-4 text-white text-center">
        <motion.div {...fadeUp()}>
          <Heart className="w-10 h-10 mx-auto mb-4 animate-pulse-slow" />
          <h2 className="text-3xl font-bold mb-3">Emergency? We're Ready.</h2>
          <p className="text-white text-opacity-80 max-w-md mx-auto mb-6">
            VaidyaAstra's emergency system dispatches ambulances within seconds using AI triage and Google Maps routing.
          </p>
          <VaButton
            variant="secondary"
            size="lg"
            className="bg-white text-va-emergency border-white hover:bg-opacity-90"
            onClick={() => navigate('/register')}
          >
            Register — It's Free
          </VaButton>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-va-charcoal text-white py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">⚕️</span> VaidyaAstra
          </div>
          <p className="text-white text-opacity-50 text-sm">
            AI-Powered Universal Healthcare OS · Built for India
          </p>
          <p className="text-white text-opacity-30 text-xs">
            All API keys via env vars only · Never hardcoded
          </p>
        </div>
      </footer>
    </div>
  )
}
