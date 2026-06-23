import { Trophy, TrendingUp, Flame } from 'lucide-react'
import { CEFR_LABELS, CEFR_COLORS, type CefrLevel } from '../lib/types'

interface Props {
  score: number
  total: number
  correct: number
  cefr: CefrLevel
  streak: number
  isPlacement?: boolean
}

export function ScoreAnimation({ score, total, correct, cefr, streak, isPlacement }: Props) {
  return (
    <div className="text-center space-y-6 animate-slide-up">
      <div className="animate-score-pop">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold shadow-lg"
          style={{ backgroundColor: CEFR_COLORS[cefr] }}
        >
          {Math.round(score)}%
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-900">
          {correct} de {total} correctas
        </p>
        {isPlacement && (
          <p className="text-sm text-gray-500 mt-1">
            Tu nivel estimado es{' '}
            <span className="font-bold" style={{ color: CEFR_COLORS[cefr] }}>
              {cefr} — {CEFR_LABELS[cefr]}
            </span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{Math.round(score)}%</p>
          <p className="text-xs text-gray-500">Puntuación</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <TrendingUp className="w-5 h-5 text-lanmac mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{cefr}</p>
          <p className="text-xs text-gray-500">Nivel</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <Flame className="w-5 h-5 text-streak mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{streak}</p>
          <p className="text-xs text-gray-500">Racha</p>
        </div>
      </div>
    </div>
  )
}
