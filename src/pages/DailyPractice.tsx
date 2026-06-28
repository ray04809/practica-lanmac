import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExerciseCard } from '../components/ExerciseCard'
import { ProgressBar } from '../components/ProgressBar'
import { NeurocienciaTip } from '../components/NeurocienciaTip'
import { ScoreAnimation } from '../components/ScoreAnimation'
import { getExercises, createSession, submitResponse, completeSession } from '../lib/api'
import type { PracticeUser, Exercise, CefrLevel, SessionResult } from '../lib/types'

const TOTAL_QUESTIONS = 10

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

  const loadExercises = useCallback(async () => {
    const ex = await getExercises(level, undefined, TOTAL_QUESTIONS)
    return ex
  }, [level])

  useEffect(() => {
    async function init() {
      try {
        const sid = await createSession(user.id, 'daily_practice', level)
        setSessionId(sid)
        const ex = await loadExercises()
        setExercises(ex)
      } catch (e) {
        console.error('Failed to start practice:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [user.id, level, loadExercises])

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
        <div className="space-y-3">
          <button
            onClick={() => {
              setSessionResult(null)
              setCurrentIdx(0)
              setCorrect(0)
              setLoading(true)
              ;(async () => {
                const sid = await createSession(user.id, 'daily_practice', level)
                setSessionId(sid)
                const ex = await loadExercises()
                setExercises(ex)
                setLoading(false)
              })()
            }}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Practicar de nuevo
          </button>
          <button
            onClick={() => navigate('/conversation')}
            className="w-full py-3 border-2 border-lanmac text-lanmac rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            Bonus: Conversación en inglés
          </button>
          <button
            onClick={() => navigate('/results')}
            className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Ver mi perfil
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
        <h2 className="text-xl font-bold text-gray-900">Práctica Diaria</h2>
        <p className="text-sm text-gray-500">Nivel {level}</p>
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
