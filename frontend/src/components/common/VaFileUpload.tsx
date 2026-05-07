import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { REPORT_TYPES, MAX_UPLOAD_MB } from '../../config/constants'
import type { ReportType } from '../../config/constants'
import VaButton from './VaButton'

interface VaFileUploadProps {
  onUpload: (file: File, reportType: ReportType) => Promise<void>
  isUploading?: boolean
  uploadProgress?: number
}

export default function VaFileUpload({ onUpload, isUploading, uploadProgress = 0 }: VaFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState<ReportType>('blood')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[], rejected: File[]) => {
    setError(null)
    if (rejected.length) { setError('File type not supported or too large (max 50MB)'); return }
    if (accepted[0]) setSelectedFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_UPLOAD_MB * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: false,
  })

  const handleSubmit = async () => {
    if (!selectedFile || !selectedType) return
    await onUpload(selectedFile, selectedType)
    setSelectedFile(null)
  }

  return (
    <div className="space-y-4">
      {/* Report type selector */}
      <div>
        <label className="block text-sm font-semibold text-va-charcoal mb-2">Report Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt.value}
              onClick={() => setSelectedType(rt.value)}
              className={clsx(
                'flex flex-col items-center gap-1 p-3 rounded-va border text-xs font-medium transition-all',
                selectedType === rt.value
                  ? 'border-va-blue bg-va-blue/5 text-va-blue'
                  : 'border-va-gray-light text-va-gray-text hover:border-va-blue/40'
              )}
            >
              <span className="text-xl">{rt.icon}</span>
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-va-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive ? 'border-va-blue bg-va-blue/5' : 'border-va-gray-light hover:border-va-blue/50 hover:bg-va-white-off'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-3 text-va-gray-text" />
        <p className="font-semibold text-va-charcoal text-sm">
          {isDragActive ? 'Drop it here' : 'Drag & drop your file'}
        </p>
        <p className="text-xs text-va-gray-text mt-1">PDF, JPG, PNG — max {MAX_UPLOAD_MB}MB</p>
      </div>

      {/* Selected file */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 bg-va-blue/5 border border-va-blue/20 rounded-va p-3"
          >
            <File className="w-5 h-5 text-va-blue flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-va-charcoal truncate">{selectedFile.name}</p>
              <p className="text-xs text-va-gray-text">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-va-gray-text hover:text-va-emergency">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress */}
      {isUploading && (
        <div>
          <div className="flex justify-between text-xs text-va-gray-text mb-1">
            <span>Uploading...</span><span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 bg-va-gray-light rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-va-blue rounded-full"
              initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-va-emergency text-sm">
          <AlertCircle className="w-4 h-4" />{error}
        </div>
      )}

      {selectedFile && !isUploading && (
        <VaButton fullWidth onClick={handleSubmit} icon={<CheckCircle2 className="w-4 h-4" />}>
          Upload & Analyze with AI
        </VaButton>
      )}
    </div>
  )
}
