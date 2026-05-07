import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import { usePatientStore } from '../../store/patientStore'
import VaCard from '../../components/common/VaCard'
import VaButton from '../../components/common/VaButton'
import AIResponseCard from '../../components/ai/AIResponseCard'
import ReportCard from '../../components/medical/ReportCard'

export default function AIAnalysisView() {
  const navigate = useNavigate()
  const { fileId } = useParams<{ fileId: string }>()
  const { vault, analyses, loadVault, loadAnalysis } = usePatientStore()

  useEffect(() => { loadVault() }, [])

  const file = vault.find(f => f.id === fileId)
  const analysis = fileId ? analyses[fileId] : undefined

  useEffect(() => {
    if (fileId && !analysis) loadAnalysis(fileId)
  }, [fileId])

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-va hover:bg-va-gray-light transition-colors">
          <ArrowLeft className="w-5 h-5 text-va-gray-text" />
        </button>
        <h1 className="text-xl font-bold text-va-charcoal dark:text-white">AI Analysis</h1>
      </div>
      {file && <ReportCard file={file} />}
      {analysis && <AIResponseCard analysis={analysis} />}
      {!file && !analysis && (
        <VaCard className="p-8 text-center text-va-gray-text">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <div>Select a file from your Medical Vault</div>
          <VaButton className="mt-4" variant="primary" onClick={() => navigate('/patient/vault')}>Open Vault</VaButton>
        </VaCard>
      )}
    </div>
  )
}
