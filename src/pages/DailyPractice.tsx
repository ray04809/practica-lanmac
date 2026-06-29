import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExerciseCard } from '../components/ExerciseCard'
import { ProgressBar } from '../components/ProgressBar'
import { NeurocienciaTip } from '../components/NeurocienciaTip'
import { ScoreAnimation } from '../components/ScoreAnimation'
import { getExercises, createSession, submitResponse, completeSession } from '../lib/api'
import type { PracticeUser, Exercise, CefrLevel, SessionResult } from '../lib/types'

const TOTAL_QUESTIONS = 10

// LANMAC operates in America/Santo_Domingo (UTC-4, no DST).
// Compute "today" boundaries in that timezone so cooldown resets at local midnight.
const TZ = 'America/Santo_Domingo'

function todayInSantoDomingo(): { startUtc: Date; endUtc: Date } {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = fmt.formatToParts(now)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const d = parts.find((p) => p.type === 'day')?.value
  // Santo Domingo is UTC-4 year-round → local midnight is 04:00 UTC
  const startUtc = new Date(`${y}-${m}-${d}T04:00:00.000Z`)
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000)
  return { startUtc, endUtc }
}

function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

interface Props {
  user: PracticeUser
  onComplete: () => void
}

export function DailyPractice({ user, onComplete }: Props) {
  const navigate = useNavigate()
  const level = (user.detected_cefr || 'A2') as CefrLevel
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [bonusMode, setBonusMode] = useState(false)
  const [now, setNow] = useState<Date>(() => new Date())

  // Did the user already complete today's daily practice?
  const alreadyPracticedToday = useMemo(() => {
    if (!user.last_practice_at) return false
    const last = new Date(user.last_practice_at)
    const { startUtc, endUtc } = todayInSantoDomingo()
    return last >= startUtc && last < endUtc
  }, [user.last_practice_at])

  // If we are gated by cooldown, tick the countdown each second
  const countdown = useMemo(() => {
    const { endUtc } = todayInSantoDomingo()
    return formatCountdown(endUtc.getTime() - now.getTime())
  }, [now])

  useEffect(() => {
    if (!alreadyPracticedToday || bonusMode || sessionResult) return
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [alreadyPracticedToday, bonusMode, sessionResult])

  const loadExercises = useCallback(async () => {
    const ex = await getExercises(level, undefined, TOTAL_QUESTIONS)
    return ex
  }, [level])

  useEffect(() => {
    // If user already practiced today, don't auto-start a new session.
    if (alreadyPracticedToday && !bonusMode) {
      setLoading(false)
      return
    }
    let cancelled = false
    async function init() {
      try {
        const sid = await createSession(user.id, 'daily_practice', level)
        if (cancelled) return
        setSessionId(sid)
        const ex = await loadExercises()
        if (cancelled) return
        setExercises(ex)
      } catch (e) {
        console.error('Failed to start practice:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [user.id, level, loadExercises, alreadyPracticedToday, bonusMode])

  const handleSubmit = async (answer: string, timeMs: number) => {
    if (!sessionId || !exercises[currentIdx]) throw new Error('No session')
    const result = await submitResponse(sessionId, exercises[currentIdx].id, answer, timeMs)
    if (result.is_correct) setCorrect((c) => c + 1)
    return result
  }

  const handleNext = async () => {
    if (currentIdx + 1 >= exercises.length) {
      const sr = await completeSession(sessionId!, level)
      setSessionResult(sr)
      onComplete()
      return
    }
    setCurrentIdx(currentIdx + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-lanmac border-t-transparent rounded-full" />
      </div>
    )
  }

  // ============================================================
  // GATE: already practiced today (and not in extra-practice mode)
  // ============================================================
  if (alreadyPracticedToday && !bonusMode && !sessionResult) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6 text-center">
        <div className="text-6xl">🌅</div>
        <h2 className="text-2xl font-bold text-gray-900">Ya practicaste hoy</h2>
        <p className="text-gray-600">
          Tu cerebro consolida lo aprendido mientras descansas. Vuelve mañana para tu nueva sesión diaria y mantener tu racha.
        </p>

        <div className="bg-lanmac/5 border-2 border-lanmac/20 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wider text-lanmac font-semibold mb-2">
            Próxima sesión disponible en
          </div>
          <div className="text-4xl font-mono font-bold text-lanmac tabular-nums">
            {countdown}
          </div>
          <div className="text-xs text-gray-500 mt-2">Hora de Santo Domingo</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/results')}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Ver mi progreso
          </button>
          <button
            onClick={() => navigate('/conversation')}
            className="w-full py-3 border-2 border-lanmac text-lanmac rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Conversación en inglés (bonus)
          </button>
          <button
            onClick={() => navigate('/games')}
            className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Jugar mini-juegos
          </button>
          <button
            onClick={() => {
              // Extra session — explicitly opted into, doesn't count for streak server-side.
              setBonusMode(true)
              setLoading(true)
            }}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Práctica adicional (no cuenta para tu racha)
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (sessionResult) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">¡Sesión completada!</h2>
        <ScoreAnimation
          score={sessionResult.session.score_percentage}
          total={sessionResult.session.total_questions}
          correct={sessionResult.session.correct_answers}
          cefr={sessionResult.user.detected_cefr}
          streak={sessionResult.user.current_streak}
        />
        <NeurocienciaTip />
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">🌅</div>
          <div className="text-sm font-semibold text-amber-900">Vuelve mañana</div>
          <div className="text-xs text-amber-700 mt-1">
            Tu próxima práctica diaria estará disponible en {countdown}
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/conversation')}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Bonus: Conversación en inglés
          </button>
          <button
            onClick={() => navigate('/results')}
            className="w-full py-3 border-2 border-lanmac text-lanmac rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Ver mi perfil
          </button>
          <button
            onClick={() => navigate('/games')}
            className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Jugar mini-juegos
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const currentExercise = exercises[currentIdx]
  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">No hay ejercicios disponibles para tu nivel.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-lanmac underline">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {bonusMode ? 'Práctica adicional' : 'Práctica Diaria'}
        </h2>
        <p className="text-sm text-gray-500">
          Nivel {level}
          {bonusMode && <span className="ml-2 text-xs text-amber-600">(no cuenta para racha)</span>}
        </p>
      </div>

      <ProgressBar current={currentIdx + 1} total={exercises.length} correct={correct} />

      {currentIdx > 0 && currentIdx % 4 === 0 && (
        <NeurocienciaTip index={currentIdx} />
      )}

      <ExerciseCard
        key={currentExercise.id}
        exercise={currentExercise}
        onSubmit={handleSubmit}
        onNext={handleNext}
      />
    </div>
  )
}
