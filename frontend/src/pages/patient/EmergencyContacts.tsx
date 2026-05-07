import { useEffect, useState } from 'react'
import { Phone, Plus, Trash2, User, Shield } from 'lucide-react'
import { usePatientStore } from '../../store/patientStore'
import VaCard from '../../components/common/VaCard'
import VaButton from '../../components/common/VaButton'
import VaModal from '../../components/common/VaModal'
import toast from 'react-hot-toast'
import { MAX_EMERGENCY_CONTACTS } from '../../config/constants'

export default function EmergencyContacts() {
  const { emergencyContacts, loadEmergencyContacts, addEmergencyContact, deleteEmergencyContact } = usePatientStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' })

  useEffect(() => { loadEmergencyContacts() }, [])

  const handleAdd = async () => {
    if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
    await addEmergencyContact(form)
    setShowAdd(false)
    setForm({ name: '', phone: '', relationship: '' })
    toast.success('Contact added')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-va-charcoal dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-va-blue" /> Emergency Contacts
          </h1>
          <p className="text-va-gray-text text-sm mt-0.5">Up to {MAX_EMERGENCY_CONTACTS} contacts · Notified during SOS</p>
        </div>
        {emergencyContacts.length < MAX_EMERGENCY_CONTACTS && (
          <VaButton variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
            Add Contact
          </VaButton>
        )}
      </div>

      <div className="space-y-3">
        {emergencyContacts.length === 0 ? (
          <VaCard className="p-8 text-center text-va-gray-text">
            <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <div>No emergency contacts added</div>
            <VaButton className="mt-4" variant="primary" onClick={() => setShowAdd(true)}>Add First Contact</VaButton>
          </VaCard>
        ) : (
          emergencyContacts.map(contact => (
            <VaCard key={contact.id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-va-lavender to-va-mint flex items-center justify-center font-bold text-va-charcoal">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-va-charcoal dark:text-white">{contact.name}</div>
                <div className="text-sm text-va-gray-text">{contact.relationship} · {contact.phone}</div>
              </div>
              <div className="flex gap-2">
                <a href={"tel:" + contact.phone}>
                  <VaButton size="xs" variant="ghost" icon={<Phone className="w-3 h-3" />}>Call</VaButton>
                </a>
                <VaButton size="xs" variant="ghost" icon={<Trash2 className="w-3 h-3 text-va-emergency" />} onClick={() => deleteEmergencyContact(contact.id)} />
              </div>
            </VaCard>
          ))
        )}
      </div>

      <VaModal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Emergency Contact">
        <div className="space-y-4">
          {[
            { label: 'Full Name', field: 'name', placeholder: 'e.g., Ramesh Kumar' },
            { label: 'Phone Number', field: 'phone', placeholder: '+91 9XXXXXXXXX' },
            { label: 'Relationship', field: 'relationship', placeholder: 'Parent / Spouse / Sibling' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-va-gray-text mb-1.5">{label}</label>
              <input
                value={form[field as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-va-gray-light rounded-va text-sm focus:outline-none focus:ring-2 focus:ring-va-blue"
              />
            </div>
          ))}
          <VaButton variant="primary" className="w-full justify-center" onClick={handleAdd}>Save Contact</VaButton>
        </div>
      </VaModal>
    </div>
  )
}
