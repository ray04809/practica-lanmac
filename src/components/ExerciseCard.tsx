import { useState, useRef } from 'react'
import { Check, X, Volume2, Mic, MicOff, Send } from 'lucide-react'
import type { Exercise, SubmitResult } from '../lib/types'

const MATCH_COLORS = [
  'border-blue-400 bg-blue-50',
  'border-emerald-400 bg-emerald-50',
  'border-purple-400 bg-purple-50',
  'border-amber-400 bg-amber-50',
  'border-rose-400 bg-rose-50',
  'border-cyan-400 bg-cyan-50',
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Props {
  exercise: Exercise
  onSubmit: (answer: string, timeMs: number) => Promise<SubmitResult>
  onNext: () => void
}

export function ExerciseCard({ exercise, onSubmit, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [fillAnswer, setFillAnswer] = useState('')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [recording, setRecording] = useState(false)
  const startTime = useRef(Date.now())
  const mediaRecorder = useRef<MediaRecorder | null>(null)

  const [matchData] = useState(() => {
    if (exercise.exercise_type !== 'match') return null
    const pairs = (exercise.options as string[]).map(opt => {
      const idx = opt.indexOf(' → ')
      if (idx === -1) return { left: opt, right: opt }
      return { left: opt.substring(0, idx), right: opt.substring(idx + 3) }
    })
    return { pairs, shuffledRight: shuffle(pairs.map(p => p.right)) }
  })
  const [activeLeft, setActiveLeft] = useState<number | null>(null)
  const [userMatches, setUserMatches] = useState<Map<number, number>>(new Map())

  const handleSelect = async (option: string) => {
    if (result) return
    setSelected(option)
    setSubmitting(true)
    try {
      const r = await onSubmit(option, Date.now() - startTime.current)
      setResult(r)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFillSubmit = async () => {
    if (!fillAnswer.trim() || result) return
    setSubmitting(true)
    try {
      const r = await onSubmit(fillAnswer.trim(), Date.now() - startTime.current)
      setResult(r)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMatchSubmit = async () => {
    if (!matchData || submitting) return
    const answer = matchData.pairs.map((pair, i) => {
      const rightIdx = userMatches.get(i)
      const right = rightIdx !== undefined ? matchData.shuffledRight[rightIdx] : ''
      return `${pair.left} → ${right}`
    }).join(',')
    setSubmitting(true)
    try {
      const r = await onSubmit(answer, Date.now() - startTime.current)
      setResult(r)
    } finally {
      setSubmitting(false)
    }
  }

  const handleMatchSelect = (rightIdx: number) => {
    if (activeLeft === null || result) return
    const next = new Map(userMatches)
    for (const [k, v] of next) if (v === rightIdx) next.delete(k)
    next.set(activeLeft, rightIdx)
    setUserMatches(next)
    const nextUnmatched = matchData!.pairs.findIndex((_, i) => !next.has(i))
    setActiveLeft(nextUnmatched >= 0 ? nextUnmatched : null)
  }

  const handleSpeak = async () => {
    if (recording) {
      mediaRecorder.current?.stop()
      setRecording(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 3
      setRecording(true)

      recognition.onresult = async (event: any) => {
        setRecording(false)
        setSubmitting(true)
        try {
          const alternatives: string[] = []
          for (let i = 0; i < event.results[0].length; i++) {
            alternatives.push(event.results[0][i].transcript.toLowerCase().trim())
          }
          const target = exercise.correct_answer.toLowerCase().replace(/[?.!,]/g, '').trim()
          const matched = alternatives.some(a => {
            const clean = a.replace(/[?.!,]/g, '').trim()
            return clean === target || clean.includes(target) || target.includes(clean)
          })
          const answer = matched ? exercise.correct_answer : alternatives[0] || '[no-audio]'
          const r = await onSubmit(answer, Date.now() - startTime.current)
          setResult(r)
        } finally {
          setSubmitting(false)
        }
      }

      recognition.onerror = async (event: any) => {
        setRecording(false)
        if (event.error === 'not-allowed') {
          alert('Permite acceso al micrófono en la configuración de tu navegador.')
        } else if (event.error === 'no-speech') {
          alert('No se detectó voz. Intenta hablar más cerca del micrófono.')
        } else {
          setSubmitting(true)
          try {
            const r = await onSubmit('[no-audio]', Date.now() - startTime.current)
            setResult(r)
          } finally {
            setSubmitting(false)
          }
        }
      }

      recognition.onend = () => setRecording(false)
      recognition.start()

      setTimeout(() => {
        try { recognition.stop() } catch {}
      }, 8000)
    } else {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome para esta función.')
    }
  }

  const playTTS = () => {
    // Prefer pre-generated MP3 (OpenAI TTS-HD) when available — gives consistent
    // audio across devices. Fall back to browser SpeechSynthesis only if missing.
    if (exercise.audio_url) {
      try {
        const audio = new Audio(exercise.audio_url)
        audio.play().catch((err) => {
          console.warn('Falling back to SpeechSynthesis (audio.play failed):', err)
          speakWithBrowserTTS()
        })
        return
      } catch {
        speakWithBrowserTTS()
        return
      }
    }
    speakWithBrowserTTS()
  }

  const speakWithBrowserTTS = () => {
    const utterance = new SpeechSynthesisUtterance(
      exercise.exercise_type === 'listen_choose' ? exercise.prompt : exercise.correct_answer
    )
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    speechSynthesis.speak(utterance)
  }

  const isChoiceType =
    exercise.exercise_type === 'multiple_choice' ||
    exercise.exercise_type === 'true_false' ||
    exercise.exercise_type === 'listen_choose' ||
    exercise.exercise_type === 'image_choose'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-lanmac/10 text-lanmac uppercase">
          {exercise.skill}
        </span>
        <span className="text-xs text-gray-400">{exercise.cefr_level}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-1">
        {exercise.exercise_type === 'true_false' ? '¿Es correcta esta oración?' : exercise.prompt}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        {exercise.exercise_type === 'true_false' ? '' : exercise.prompt_es}
      </p>
      {exercise.exercise_type === 'true_false' && (
        <p className="text-base text-gray-800 font-medium mb-4 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 italic">
          "{exercise.prompt}"
        </p>
      )}
      {exercise.exercise_type !== 'true_false' && <div className="mb-4" />}

      {exercise.exercise_type === 'listen_choose' && (
        <button
          onClick={playTTS}
          className="mb-4 flex items-center gap-2 bg-lanmac/10 text-lanmac px-4 py-2 rounded-lg hover:bg-lanmac/20 transition-colors"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm font-medium">Escuchar</span>
        </button>
      )}

      {isChoiceType && (
        <div className="space-y-2">
          {(exercise.options as string[]).map((opt) => {
            const displayLabel = exercise.exercise_type === 'true_false'
              ? (opt === 'True' ? 'Correcta ✓' : opt === 'False' ? 'Incorrecta ✗' : opt)
              : opt
            let classes = 'w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium '
            if (result) {
              if (opt === result.correct_answer)
                classes += 'border-success bg-green-50 text-green-800'
              else if (opt === selected && !result.is_correct)
                classes += 'border-danger bg-red-50 text-red-800'
              else classes += 'border-gray-100 text-gray-400'
            } else if (opt === selected) {
              classes += 'border-lanmac bg-blue-50 text-lanmac'
            } else {
              classes += 'border-gray-200 hover:border-lanmac-light hover:bg-blue-50/50 text-gray-700'
            }
            return (
              <button key={opt} onClick={() => handleSelect(opt)} disabled={!!result || submitting} className={classes}>
                {displayLabel}
              </button>
            )
          })}
        </div>
      )}

      {exercise.exercise_type === 'match' && matchData && !result && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 text-center">Toca un elemento de la izquierda, luego su pareja a la derecha</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {matchData.pairs.map((pair, i) => {
                const isMatched = userMatches.has(i)
                const isActive = activeLeft === i
                return (
                  <button
                    key={i}
                    onClick={() => setActiveLeft(isActive ? null : i)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      isActive ? 'border-lanmac bg-blue-50 text-lanmac ring-2 ring-lanmac/30' :
                      isMatched ? `${MATCH_COLORS[i % MATCH_COLORS.length]} text-gray-800` :
                      'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {pair.left}
                  </button>
                )
              })}
            </div>
            <div className="space-y-2">
              {matchData.shuffledRight.map((item, i) => {
                const matchedByIdx = [...userMatches.entries()].find(([, ri]) => ri === i)?.[0]
                const isUsed = matchedByIdx !== undefined
                return (
                  <button
                    key={i}
                    onClick={() => handleMatchSelect(i)}
                    disabled={activeLeft === null}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      isUsed ? `${MATCH_COLORS[matchedByIdx % MATCH_COLORS.length]} text-gray-800` :
                      activeLeft !== null ? 'border-gray-200 text-gray-700 hover:border-lanmac hover:bg-blue-50/50 cursor-pointer' :
                      'border-gray-100 text-gray-400'
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>
          {userMatches.size === matchData.pairs.length && (
            <button
              onClick={handleMatchSubmit}
              disabled={submitting}
              className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors disabled:opacity-50"
            >
              {submitting ? 'Verificando...' : 'Verificar'}
            </button>
          )}
        </div>
      )}

      {exercise.exercise_type === 'match' && matchData && result && (
        <div className="space-y-2">
          {matchData.pairs.map((pair, i) => {
            const rightIdx = userMatches.get(i)
            const userRight = rightIdx !== undefined ? matchData.shuffledRight[rightIdx] : '?'
            const isCorrect = userRight === pair.right
            return (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm ${
                isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
              }`}>
                {isCorrect ? <Check className="w-4 h-4 text-green-600 shrink-0" /> : <X className="w-4 h-4 text-red-600 shrink-0" />}
                <span className="font-medium">{pair.left}</span>
                <span className="text-gray-400">→</span>
                <span className={isCorrect ? 'text-green-700' : 'text-red-700 line-through'}>{userRight}</span>
                {!isCorrect && <span className="text-green-700 font-medium ml-1">({pair.right})</span>}
              </div>
            )
          })}
        </div>
      )}

      {exercise.exercise_type === 'fill_blank' && !result && (
        <div className="flex gap-2">
          <input
            type="text"
            value={fillAnswer}
            onChange={(e) => setFillAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFillSubmit()}
            placeholder="Escribe tu respuesta..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
            autoFocus
          />
          <button
            onClick={handleFillSubmit}
            disabled={!fillAnswer.trim() || submitting}
            className="px-4 py-3 bg-lanmac text-white rounded-xl hover:bg-lanmac-dark transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      )}

      {exercise.exercise_type === 'fill_blank' && result && (
        <div className={`px-4 py-3 rounded-xl border-2 text-sm font-medium ${
          result.is_correct ? 'border-success bg-green-50 text-green-800' : 'border-danger bg-red-50 text-red-800'
        }`}>
          Tu respuesta: {fillAnswer}
        </div>
      )}

      {exercise.exercise_type === 'speak_record' && !result && (
        <button
          onClick={handleSpeak}
          className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
            recording
              ? 'border-danger bg-red-50 text-red-700 animate-pulse'
              : 'border-lanmac bg-blue-50 text-lanmac hover:bg-blue-100'
          }`}
        >
          {recording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          {recording ? 'Detener grabación...' : 'Mantén presionado para hablar'}
        </button>
      )}

      {result && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <div className={`flex items-center gap-2 text-sm font-semibold ${
            result.is_correct ? 'text-success' : 'text-danger'
          }`}>
            {result.is_correct ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {result.is_correct ? '¡Correcto!' : 'Incorrecto'}
          </div>
          {!result.is_correct && exercise.exercise_type !== 'match' && (
            <p className="text-sm text-gray-600">
              Respuesta correcta: <strong>{
                exercise.exercise_type === 'true_false'
                  ? (result.correct_answer === 'True' ? 'Correcta (la oración es válida)' : 'Incorrecta (la oración tiene un error)')
                  : result.correct_answer
              }</strong>
            </p>
          )}
          <p className="text-sm text-gray-500">{result.explanation_es}</p>
          <button
            onClick={onNext}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
