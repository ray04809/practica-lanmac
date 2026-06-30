import { Bell, X } from 'lucide-react'
import { usePushNotifications } from '../hooks/usePushNotifications'

interface Props {
  fingerprintId: string | null
}

export function PushBanner({ fingerprintId }: Props) {
  const { showBanner, subscribe, dismiss } = usePushNotifications(fingerprintId)

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 flex items-start gap-3">
        <div className="w-10 h-10 bg-lanmac/10 rounded-xl flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-lanmac" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">Recordatorio diario</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Recibe una notificación cada día para no perder tu racha de práctica.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={subscribe}
              className="bg-lanmac text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-lanmac-dark transition-colors"
            >
              Activar
            </button>
            <button
              onClick={dismiss}
              className="text-gray-400 text-xs px-3 py-2 hover:text-gray-600 transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
