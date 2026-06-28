import { useNavigate } from 'react-router-dom'
import { Trophy, Target, Flame, BookOpen, TrendingUp, Zap } from 'lucide-react'
import { CEFR_LABELS, CEFR_COLORS, type CefrLevel } from '../lib/types'
import type { PracticeUser } from '../lib/types'

interface Props {
  user: PracticeUser
}

export function Results({ user }: Props) {
  const navigate = useNavigate()
  const accuracy = user.total_exercises > 0
    ? Math.round((user.total_correct / user.total_exercises) * 100)
    : 0
  const cefr = (user.detected_cefr || 'A1') as CefrLevel

  if (!user.detected_cefr && user.total_exercises === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Target className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Aún no tienes resultados</h2>
        <p className="text-gray-500">Toma el test de nivel para descubrir tu inglés.</p>
        <button
          onClick={() => navigate('/placement')}
          className="bg-lanmac text-white px-8 py-3 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
        >
          Tomar test de nivel
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-8 px-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
        <p className="text-sm text-gray-500">Tu progreso en LANMAC Practice</p>
      </div>

      {/* Level badge */}
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg"
          style={{ backgroundColor: CEFR_COLORS[cefr] }}
        >
          {cefr}
        </div>
        <p className="mt-3 text-lg font-semibold text-gray-900">{CEFR_LABELS[cefr]}</p>
        <p className="text-sm text-gray-500">Nivel detectado</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: BookOpen, label: 'Ejercicios', value: user.total_exercises, color: 'text-lanmac' },
          { icon: Trophy, label: 'Precisión', value: `${accuracy}%`, color: 'text-warning' },
          { icon: Flame, label: 'Racha actual', value: user.current_streak, color: 'text-streak' },
          { icon: TrendingUp, label: 'Mejor racha', value: user.best_streak, color: 'text-purple-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Correctas</span>
          <span className="text-gray-900 font-bold">{user.total_correct} / {user.total_exercises}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${accuracy}%`,
              backgroundColor: CEFR_COLORS[cefr],
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/practice')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
        >
          <Zap className="w-5 h-5" />
          Práctica diaria
        </button>
        <button
          onClick={() => navigate('/placement')}
          className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Repetir test de nivel
        </button>
      </div>

      {/* CTA */}
      <div className="bg-lanmac rounded-2xl p-6 text-center text-white">
        <h3 className="text-lg font-bold mb-1">¿Listo para el siguiente nivel?</h3>
        <p className="text-sm text-blue-100 mb-3">
          Inscríbete en LANMAC y lleva tu inglés al máximo.
        </p>
        <a
          href={`https://wa.me/18098706555?text=Hola%2C%20completé%20el%20test%20de%20nivel%20y%20obtuve%20${cefr}%2C%20quiero%20más%20información`}
          className="inline-block bg-white text-lanmac px-6 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          Hablar con un asesor
        </a>
      </div>
    </div>
  )
}
