import { useState } from 'react'
import { Globe, Loader2, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../../config/constants'
import { apiClient } from '../../api/client'

interface Props {
  text: string
  onTranslated: (translated: string, lang: string) => void
}

export default function TranslationToggle({ text, onTranslated }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeLang, setActiveLang] = useState('en')

  const translate = async (langCode: string, langLabel: string) => {
    if (langCode === 'en') { onTranslated(text, 'en'); setActiveLang('en'); setOpen(false); return }
    setLoading(true)
    try {
      const r = await apiClient.post('/ai/translate', { text, target_language: langCode })
      onTranslated(r.data.translated_text, langCode)
      setActiveLang(langCode)
    } catch { /* silently fail */ } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const active = LANGUAGES.find(l => l.code === activeLang)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-va-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full px-3 py-1.5 transition-colors"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
        <span>{active?.native || 'English'}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va shadow-va-hover py-1 min-w-32">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => translate(lang.code, lang.label)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-va-gray-light dark:hover:bg-dark-surface transition-colors flex justify-between ${activeLang === lang.code ? 'text-va-blue font-medium' : 'text-va-charcoal dark:text-white'}`}
            >
              <span>{lang.label}</span>
              <span className="text-va-gray-text">{lang.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
