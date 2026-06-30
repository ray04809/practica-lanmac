import { useState } from 'react'
import { X, Mail, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getFingerprint } from '../lib/fingerprint'

interface Props {
  onRecovered: () => void
  onClose: () => void
}

export function RecoverModal({ onRecovered, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'not_found' | 'error'>('idle')

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const fp = await getFingerprint()
      const { data, error } = await supabase.rpc('recover_practice_user_by_email', {
        p_email: email.trim(),
        p_new_fingerprint: fp,
      })
      if (error) throw error
      const result = data as { found: boolean }
      if (!result.found) {
        setStatus('not_found')
        return
      }
      setStatus('success')
      setTimeout(() => onRecovered(), 1500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-lanmac/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-7 h-7 text-lanmac" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Recuperar mi progreso</h3>
          <p className="text-sm text-gray-500 mt-1">
            Ingresa el email que usaste cuando te registraste para recuperar tu nivel y estadísticas.
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-green-700 font-semibold">Progreso recuperado</p>
            <p className="text-sm text-gray-500 mt-1">Redirigiendo...</p>
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus('idle') }}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
              autoFocus
            />

            {status === 'not_found' && (
              <p className="text-sm text-red-500">
                No encontramos un perfil con ese email. Verifica que sea el correcto o toma el test de nivel.
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-500">
                Ocurrió un error. Intenta de nuevo.
              </p>
            )}

            <button
              type="submit"
              disabled={!email.trim() || status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Buscando...' : (
                <>Recuperar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
