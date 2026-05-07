import { useState } from 'react'
import { Brain, Send, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiClient } from '../../api/client'
import VaButton from '../common/VaButton'

interface Message { role: 'user' | 'ai'; content: string }

interface Props { patientId: string; patientName: string }

export default function DoctorAIPanel({ patientId, patientName }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const r = await apiClient.post('/ai/doctor-assist-chat', { patient_id: patientId, question: q })
      setMessages(prev => [...prev, { role: 'ai', content: r.data.answer }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'AI service unavailable. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const QUICK = ['Summarize this patient', 'Suggest next tests', 'Check drug interactions', 'Explain latest report']

  return (
    <div className="flex flex-col h-96 bg-white dark:bg-dark-card border border-va-gray-light dark:border-dark-border rounded-va overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-va-blue to-va-purple text-white">
        <Brain className="w-4 h-4" />
        <span className="text-sm font-semibold">AI Assistant — {patientName}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <Brain className="w-10 h-10 mx-auto text-va-purple opacity-30 mb-3" />
            <p className="text-xs text-va-gray-text mb-3">Ask anything about this patient</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {QUICK.map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="text-xs bg-blue-50 text-va-blue border border-blue-200 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs rounded-va px-3 py-2 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-va-blue text-white'
                  : 'bg-va-gray-light dark:bg-dark-surface text-va-charcoal dark:text-white'
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-va-gray-light dark:bg-dark-surface rounded-va px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-va-purple" />
            </div>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-va-gray-light dark:border-dark-border flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about this patient..."
          className="flex-1 px-3 py-1.5 text-xs bg-va-gray-light dark:bg-dark-surface border-none rounded-va focus:outline-none focus:ring-1 focus:ring-va-blue"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="p-2 bg-va-blue text-white rounded-va disabled:opacity-50 hover:bg-opacity-90 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
