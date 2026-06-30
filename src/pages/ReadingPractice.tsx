import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Mic, MicOff, RotateCcw, ArrowLeft, Volume2, ChevronRight } from 'lucide-react'
import { getRandomPassage } from '../lib/readingPassages'
import type { PracticeUser, CefrLevel } from '../lib/types'

interface Props {
  user: PracticeUser
}

interface WordResult {
  word: string
  status: 'pending' | 'correct' | 'wrong'
}

// Normalize text for comparison: lowercase, remove punctuation
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9' ]/g, '')
    .trim()
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean)
}

// Simple word-level diff: for each expected word, check if it appears in spoken words (order-aware)
function compareTexts(
  expected: string[],
  spoken: string[]
): WordResult[] {
  const results: WordResult[] = []
  let spokenIdx = 0

  for (const word of expected) {
    // Try to find the word in remaining spoken words (allow some flexibility)
    let found = false
    // Look ahead up to 3 positions for a match
    for (let look = 0; look < 4 && spokenIdx + look < spoken.length; look++) {
      if (spoken[spokenIdx + look] === word) {
        // Mark skipped spoken words (extra words the user said)
        spokenIdx += look + 1
        found = true
        break
      }
    }
    results.push({ word, status: found ? 'correct' : 'wrong' })
  }

  return results
}

// Check if SpeechRecognition is available
function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognition)
    | null
}

export function ReadingPractice({ user }: Props) {
  const navigate = useNavigate()
  const level = (user.detected_cefr || 'A2') as CefrLevel
  // Clamp level to supported range
  const effectiveLevel = (['A1', 'A2', 'B1', 'B2'] as CefrLevel[]).includes(level)
    ? level
    : 'A2'

  const [passage, setPassage] = useState(() => getRandomPassage(effectiveLevel as CefrLevel))
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [wordResults, setWordResults] = useState<WordResult[] | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [supported] = useState(() => !!getSpeechRecognition())
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  const speakText = useCallback((text: string) => {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.85
    speechSynthesis.speak(u)
  }, [])

  const startRecording = useCallback(() => {
    const SRClass = getSpeechRecognition()
    if (!SRClass) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.')
      return
    }

    setError(null)
    setWordResults(null)
    setScore(null)
    setTranscript('')
    finalTranscriptRef.current = ''

    const recognition = new SRClass()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }
      finalTranscriptRef.current = final
      setTranscript(final + interim)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado. Habilítalo en la configuración del navegador.')
      } else if (event.error !== 'aborted') {
        setError('Error en el reconocimiento de voz. Intenta de nuevo.')
      }
      setRecording(false)
    }

    recognition.onend = () => {
      setRecording(false)
      // Process results
      const spokenText = finalTranscriptRef.current.trim()
      if (spokenText) {
        const expectedWords = tokenize(passage.text)
        const spokenWords = tokenize(spokenText)
        const results = compareTexts(expectedWords, spokenWords)
        setWordResults(results)
        const correctCount = results.filter((r) => r.status === 'correct').length
        setScore(Math.round((correctCount / results.length) * 100))
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [passage.text])

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
  }, [])

  const nextPassage = useCallback(() => {
    setPassage(getRandomPassage(effectiveLevel as CefrLevel))
    setWordResults(null)
    setScore(null)
    setTranscript('')
    setError(null)
    finalTranscriptRef.current = ''
  }, [effectiveLevel])

  const retry = useCallback(() => {
    setWordResults(null)
    setScore(null)
    setTranscript('')
    setError(null)
    finalTranscriptRef.current = ''
  }, [])

  if (!supported) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <MicOff className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Navegador no compatible</h2>
        <p className="text-gray-500 text-sm">
          Tu navegador no soporta reconocimiento de voz. Por favor usa Google Chrome o Microsoft Edge para esta actividad.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-lanmac text-white px-6 py-3 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">Lectura en voz alta</h2>
          <p className="text-xs text-gray-400">Nivel {effectiveLevel}</p>
        </div>
        <div className="w-5" /> {/* spacer */}
      </div>

      {/* Passage Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">{passage.title}</h3>
          <button
            onClick={() => speakText(passage.text)}
            className="flex items-center gap-1 text-xs text-lanmac hover:text-lanmac-dark transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            Escuchar
          </button>
        </div>

        {wordResults ? (
          <div className="leading-relaxed text-base">
            {wordResults.map((wr, i) => (
              <span
                key={i}
                className={`${
                  wr.status === 'correct'
                    ? 'text-green-600 bg-green-50'
                    : 'text-red-600 bg-red-50'
                } px-0.5 rounded`}
              >
                {wr.word}{' '}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed text-base">{passage.text}</p>
        )}
      </div>

      {/* Live transcript */}
      {recording && transcript && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">Escuchando...</p>
          <p className="text-sm text-gray-700 italic">{transcript}</p>
        </div>
      )}

      {/* Score */}
      {score !== null && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center space-y-3">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-4 ${
              score >= 80
                ? 'border-green-500 bg-green-50'
                : score >= 50
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-red-500 bg-red-50'
            }`}
          >
            <span
              className={`text-2xl font-bold ${
                score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}
            >
              {score}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {score >= 90
              ? '!Excelente pronunciación! Sigue así.'
              : score >= 70
                ? 'Muy bien. Practica las palabras en rojo.'
                : score >= 50
                  ? 'Buen esfuerzo. Escucha el texto y repite.'
                  : 'Sigue practicando. Escucha el modelo primero.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={retry}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Repetir
            </button>
            <button
              onClick={nextPassage}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-lanmac text-white rounded-xl text-sm font-semibold hover:bg-lanmac-dark transition-colors"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Record Button */}
      {score === null && (
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-full flex items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 transition-all text-sm font-semibold select-none ${
            recording
              ? 'border-red-400 bg-red-50 text-red-700 animate-pulse'
              : 'border-lanmac bg-blue-50 text-lanmac hover:bg-blue-100 cursor-pointer'
          }`}
        >
          {recording ? (
            <>
              <MicOff className="w-6 h-6" />
              Toca para terminar
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              Toca para leer en voz alta
            </>
          )}
        </button>
      )}

      {/* Instructions */}
      {score === null && !recording && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-lanmac mt-0.5 shrink-0" />
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Instrucciones:</strong></p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Primero lee el texto en silencio</li>
                <li>Puedes escuchar el modelo tocando "Escuchar"</li>
                <li>Cuando estés listo, toca el botón del micrófono</li>
                <li>Lee el texto en voz alta, claro y a buen ritmo</li>
                <li>Toca de nuevo para terminar</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
