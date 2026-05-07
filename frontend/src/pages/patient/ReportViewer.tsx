import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Download } from 'lucide-react'
import { usePatientStore } from '../../store/patientStore'
import VaCard from '../../components/common/VaCard'
import VaButton from '../../components/common/VaButton'
import AIResponseCard from '../../components/ai/AIResponseCard'
import { API_BASE_URL } from '../../config/constants'
import { format } from 'date-fns'

export default function ReportViewer() {
  const navigate = useNavigate()
  const { fileId } = useParams<{ fileId: string }>()
  const { vault, analyses, loadVault, loadAnalysis } = usePatientStore()

  useEffect(() => { loadVault() }, [])

  const file = vault.find(f => f.id === fileId)
  const analysis = fileId ? analyses[fileId] : undefined

  useEffect(() => {
    if (fileId && !analysis) loadAnalysis(fileId)
  }, [fileId])

  if (!file) return (
    <div className="text-center py-16 text-va-gray-text">
      <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
      <div>File not found</div>
      <VaButton className="mt-4" variant="ghost" onClick={() => navigate('/patient/vault')}>Back to Vault</VaButton>
    </div>
  )

  const isPdf  = file.original_name.toLowerCase().endsWith('.pdf')
  const isImg  = ['jpg','jpeg','png'].some(e => file.original_name.toLowerCase().endsWith(e))
  const fileUrl = API_BASE_URL + '/files/' + file.id

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-va hover:bg-va-gray-light transition-colors">
          <ArrowLeft className="w-5 h-5 text-va-gray-text" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-va-charcoal dark:text-white">{file.original_name}</h1>
          <div className="text-xs text-va-gray-text">{file.report_type} · {format(new Date(file.uploaded_at), 'dd MMM yyyy')}</div>
        </div>
        <a href={fileUrl} download={file.original_name}>
          <VaButton size="sm" variant="ghost" icon={<Download className="w-4 h-4" />}>Download</VaButton>
        </a>
      </div>

      <VaCard className="overflow-hidden">
        {isImg ? (
          <img src={fileUrl} alt={file.original_name} className="w-full max-h-screen object-contain bg-va-charcoal" />
        ) : isPdf ? (
          <iframe src={fileUrl} className="w-full h-screen" title={file.original_name} />
        ) : (
          <div className="p-8 text-center text-va-gray-text">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <div>Preview not available for this file type</div>
          </div>
        )}
      </VaCard>

      {analysis && <AIResponseCard analysis={analysis} />}
    </div>
  )
}
