import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Upload, Brain, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import apiClient from '../../api/client'
import { usePatientStore } from '../../store/patientStore'
import { useDropzone } from 'react-dropzone'

interface InsuranceResult {
  coverageStatus: 'COVERED'|'PARTIAL'|'NOT_COVERED'
  coveragePercentage: number
  coveredServices: string[]
  exclusions: string[]
  claimProcess: string[]
  networkHospitals: string[]
  summary: string
}

export default function InsuranceAdvisor() {
  const { emergencyContacts } = usePatientStore()
  const [file, setFile] = useState<File|null>(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InsuranceResult|null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => accepted[0] && setFile(accepted[0]),
    accept: { 'application/pdf':['.pdf'], 'image/*':['.jpg','.png'] },
    multiple: false,
  })

  const analyze = async () => {
    setLoading(true)
    try {
      const form = new FormData()
      if (file) form.append('policy_file', file)
      form.append('query', query || 'What does this insurance cover?')
      const { data } = await apiClient.post('/ai/insurance-check', form, { headers: {'Content-Type':'multipart/form-data'} })
      setResult(data)
    } catch { setResult(null) }
    setLoading(false)
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-[#2C2C2C] flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" /> Insurance AI Advisor
        </h1>
        <p className="text-sm text-[#7B7B7B] mt-0.5">Upload your policy — AI extracts coverage details instantly</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-amber-400 bg-amber-50' : 'border-[#EAEAEA] hover:border-amber-300 hover:bg-amber-50/30'}`}>
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-amber-500" />
          <p className="text-sm font-semibold text-[#2C2C2C]">{file ? file.name : 'Upload insurance policy'}</p>
          <p className="text-xs text-[#7B7B7B] mt-1">PDF, JPG, PNG accepted</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#2C2C2C] mb-1.5">Ask a specific question (optional)</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Is knee surgery covered? What is my deductible?"
            className="w-full px-4 py-2.5 bg-[#F8F8F8] border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-amber-400" />
        </div>

        <motion.button whileTap={{ scale:0.97 }} onClick={analyze} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 shadow-[0_0_16px_rgba(245,158,11,0.3)] disabled:opacity-60">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing policy...</> : <><Brain className="w-4 h-4" /> Analyze with AI</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="space-y-4">
            <div className={`rounded-2xl border-2 p-5 ${result.coverageStatus === 'COVERED' ? 'bg-green-50 border-green-200' : result.coverageStatus === 'PARTIAL' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3">
                {result.coverageStatus === 'COVERED' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
                 result.coverageStatus === 'PARTIAL' ? <AlertTriangle className="w-6 h-6 text-amber-600" /> : <XCircle className="w-6 h-6 text-[#FF4B4B]" />}
                <div>
                  <p className="font-black text-lg text-[#2C2C2C]">{result.coverageStatus.replace('_',' ')}</p>
                  <p className="text-sm text-[#7B7B7B]">{result.coveragePercentage}% coverage estimated</p>
                </div>
              </div>
              <p className="text-sm text-[#7B7B7B] mt-3 leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Covered Services</p>
                {result.coveredServices.map((s,i) => <p key={i} className="text-xs text-[#7B7B7B] py-0.5">✓ {s}</p>)}
              </div>
              <div className="bg-white rounded-2xl border border-[#EAEAEA] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <p className="text-xs font-bold text-[#FF4B4B] mb-2 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Exclusions</p>
                {result.exclusions.map((e,i) => <p key={i} className="text-xs text-[#7B7B7B] py-0.5">✗ {e}</p>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
