import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface VaModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer?: ReactNode
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl', full: 'max-w-4xl' }

export default function VaModal({ isOpen, onClose, title, subtitle, children, size = 'md', footer }: VaModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-modal flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
          >
            <div className={clsx('bg-white rounded-va-lg shadow-2xl w-full flex flex-col max-h-[90vh]', sizes[size])}>
              {title && (
                <div className="flex items-start justify-between p-6 border-b border-va-gray-light">
                  <div>
                    <h2 className="text-lg font-bold text-va-charcoal">{title}</h2>
                    {subtitle && <p className="text-sm text-va-gray-text mt-0.5">{subtitle}</p>}
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-va-white-off text-va-gray-text transition-colors ml-4">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
              {footer && <div className="p-6 border-t border-va-gray-light">{footer}</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
