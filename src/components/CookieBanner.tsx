import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-lanmac/10 rounded-full flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-lanmac" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-relaxed">
              Usamos cookies funcionales para guardar tu progreso de práctica.{' '}
              <a href="/legal/cookies" className="text-lanmac hover:underline">Más información</a>
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={accept}
                className="px-4 py-2 bg-lanmac text-white text-sm font-semibold rounded-lg hover:bg-lanmac-dark transition-colors"
              >
                Aceptar
              </button>
              <button
                onClick={decline}
                className="px-4 py-2 text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors"
              >
                Solo esenciales
              </button>
            </div>
          </div>
          <button onClick={decline} className="text-gray-300 hover:text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
