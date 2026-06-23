import { useState } from 'react'
import { X, Gift } from 'lucide-react'

interface Props {
  onSubmit: (name: string, email: string, phone: string) => Promise<void>
  onSkip: () => void
}

export function LeadCaptureModal({ onSubmit, onSkip }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(name.trim(), email.trim(), phone.trim())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up relative">
        <button onClick={onSkip} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-lanmac/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-7 h-7 text-lanmac" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">¡Obtén tu plan personalizado!</h3>
          <p className="text-sm text-gray-500 mt-1">
            Recibe un plan de estudio basado en tus resultados y tips exclusivos de SPEAK360.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="809-000-0000 (opcional)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim()}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors disabled:opacity-50"
          >
            {submitting ? 'Enviando...' : 'Recibir mi plan gratis'}
          </button>
        </form>

        <button onClick={onSkip} className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600">
          Continuar sin registrarme
        </button>
      </div>
    </div>
  )
}
