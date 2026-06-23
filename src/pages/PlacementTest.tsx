import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExerciseCard } from '../components/ExerciseCard'
import { ProgressBar } from '../components/ProgressBar'
import { NeurocienciaTip } from '../components/NeurocienciaTip'
import { ScoreAnimation } from '../components/ScoreAnimation'
import { LeadCaptureModal } from '../components/LeadCaptureModal'
import { getExercises, createSession, submitResponse, completeSession, convertToLead } from '../lib/api'
import type { PracticeUser, Exercise, CefrLevel, SessionResult } from '../lib/types'

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const TOTAL_QUESTIONS = 10

interface Props {
  user: PracticeUser
  onComplete: () => void
}

export function PlacementTest({ user, onComplete }: Props) {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentLevel, setCurrentLevel] = useState<CefrLevel>('A2')
  const [levelIdx, setLevelIdx] = useState(1)
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [loading, setLoading] = useState(true)
  const [usedIds, setUsedIds] = useState<string[]>([])

  const loadExercises = useCallback(async (level: CefrLevel, exclude: string[]) => {
    const ex = await getExercises(level, undefined, 3, exclude)
    return ex
  }, [])

  useEffect(() => {
    async function init() {
      try {
        const sid = await createSession(user.id, 'placement_test', 'A2')
        setSessionId(sid)
        const ex = await loadExercises('A2', [])
        setExercises(ex)
        setUsedIds(ex.map((e) => e.id))
      } catch (e) {
        console.error('Failed to start placement:', e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [user.id, loadExercises])

  const handleSubmit = async (answer: string, timeMs: number) => {
    if (!sessionId || !exercises[currentIdx]) throw new Error('No session')
    const result = await submitResponse(sessionId, exercises[currentIdx].id, answer, timeMs)
    if (result.is_correct) {
      setCorrect((c) => c + 1)
      setConsecutiveCorrect((c) => c + 1)
      setConsecutiveWrong(0)
    } else {
      setConsecutiveWrong((c) => c + 1)
      setConsecutiveCorrect(0)
    }
    return result
  }

  const handleNext = async () => {
    const nextQuestionNum = currentIdx + 2
    if (nextQuestionNum > TOTAL_QUESTIONS) {
      const finalLevel = LEVELS[levelIdx] || currentLevel
      const sr = await completeSession(sessionId!, finalLevel)
      setSessionResult(sr)
      setShowLeadCapture(true)
      return
    }

    let newLevelIdx = levelIdx
    if (consecutiveCorrect >= 2 && levelIdx < LEVELS.length - 1) {
      newLevelIdx = levelIdx + 1
      setConsecutiveCorrect(0)
    } else if (consecutiveWrong >= 2 && levelIdx > 0) {
      newLevelIdx = levelIdx - 1
      setConsecutiveWrong(0)
    }

    if (newLevelIdx !== levelIdx) {
      setLevelIdx(newLevelIdx)
      setCurrentLevel(LEVELS[newLevelIdx])
    }

    const nextExInBuffer = currentIdx + 1 < exercises.length
    if (nextExInBuffer) {
      setCurrentIdx(currentIdx + 1)
    } else {
      const ex = await loadExercises(LEVELS[newLevelIdx], usedIds)
      setExercises((prev) => [...prev, ...ex])
      setUsedIds((prev) => [...prev, ...ex.map((e) => e.id)])
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handleLeadSubmit = async (name: string, email: string, phone: string) => {
    await convertToLead(user.id, name, email, phone)
    setShowLeadCapture(false)
    onComplete()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-lanmac border-t-transparent rounded-full" />
      </div>
    )
  }

  if (sessionResult && !showLeadCapture) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <ScoreAnimation
          score={sessionResult.session.score_percentage}
          total={sessionResult.session.total_questions}
          correct={sessionResult.session.correct_answers}
          cefr={sessionResult.session.cefr_result || sessionResult.user.detected_cefr}
          streak={sessionResult.user.current_streak}
          isPlacement
        />
        <div className="space-y-3">
          <button
            onClick={() => navigate('/practice')}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Comenzar práctica diaria
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
        <p className="text-gray-500">Cargando ejercicios...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Test de Nivel</h2>
        <p className="text-sm text-gray-500">Evaluando nivel: {currentLevel}</p>
      </div>

      <ProgressBar current={currentIdx + 1} total={TOTAL_QUESTIONS} correct={correct} />

      {currentIdx > 0 && currentIdx % 3 === 0 && (
        <NeurocienciaTip index={currentIdx} />
      )}

      <ExerciseCard
        key={currentExercise.id}
        exercise={currentExercise}
        onSubmit={handleSubmit}
        onNext={handleNext}
      />

      {showLeadCapture && (
        <LeadCaptureModal
          onSubmit={handleLeadSubmit}
          onSkip={() => {
            setShowLeadCapture(false)
            onComplete()
          }}
        />
      )}
    </div>
  )
}
