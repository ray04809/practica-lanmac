import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Mic, MicOff, Clock, ArrowLeft, Volume2, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { PracticeUser, CefrLevel } from '../lib/types'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Check if SpeechRecognition is available
function getSpeechRecognition(): (new () => SpeechRecognition) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognition)
    | null
}

interface Props {
  user: PracticeUser
}

export function ConversationPractice({ user }: Props) {
  const navigate = useNavigate()
  const level = (user.detected_cefr || 'A2') as CefrLevel

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported] = useState(() => !!getSpeechRecognition())
  const [initializing, setInitializing] = useState(true)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const finalTranscriptRef = useRef('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const isSpeakingRef = useRef(false)

  // Timer
  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, finished])

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, transcript])

  // Speak text using SpeechSynthesis
  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.9
      isSpeakingRef.current = true
      u.onend = () => {
        isSpeakingRef.current = false
        resolve()
      }
      u.onerror = () => {
        isSpeakingRef.current = false
        resolve()
      }
      speechSynthesis.speak(u)
    })
  }, [])

  // Call AI backend
  const callAI = useCallback(
    async (conversationHistory: ChatMessage[], userMessage?: string) => {
      const historyForAPI = conversationHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      if (userMessage) {
        historyForAPI.push({ role: 'user', content: userMessage })
      }

      const { data, error: invokeErr } = await supabase.functions.invoke('voice-practice', {
        body: {
          messages: historyForAPI,
          cefr_level: level,
          user_name: user.full_name || undefined,
        },
      })

      if (invokeErr) throw invokeErr
      if (!data?.response) throw new Error('No response from AI')

      return data.response as string
    },
    [level, user.full_name]
  )

  // Initial greeting
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const greeting = await callAI([])
        if (cancelled) return
        const msg: ChatMessage = {
          role: 'assistant',
          content: greeting,
          timestamp: Date.now(),
        }
        setMessages([msg])
        await speak(greeting)
      } catch (err) {
        console.error('Init error:', err)
        if (!cancelled) {
          setError('No pudimos iniciar la conversación. Intenta de nuevo.')
        }
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }
    init()
    return () => {
      cancelled = true
      speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
      speechSynthesis.cancel()
    }
  }, [])

  const startRecording = useCallback(() => {
    if (loading || finished || isSpeakingRef.current) return

    const SRClass = getSpeechRecognition()
    if (!SRClass) return

    setError(null)
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
        setError('Permiso de micrófono denegado.')
      } else if (event.error !== 'aborted') {
        setError('Error en el reconocimiento. Intenta de nuevo.')
      }
      setRecording(false)
    }

    recognition.onend = () => {
      setRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
  }, [loading, finished])

  const stopAndSend = useCallback(async () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    setRecording(false)

    // Small delay for final transcript to settle
    await new Promise((r) => setTimeout(r, 300))

    const spokenText = finalTranscriptRef.current.trim()
    if (!spokenText) {
      setError('No te escuché. Intenta de nuevo.')
      setTranscript('')
      return
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: spokenText,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setTranscript('')
    setLoading(true)

    try {
      const response = await callAI([...messages, userMsg])
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
      await speak(response)
    } catch (err) {
      console.error('AI call error:', err)
      setError('Error al obtener respuesta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [messages, callAI, speak])

  const replayMessage = useCallback(
    (text: string) => {
      speak(text)
    },
    [speak]
  )

  const endSession = useCallback(() => {
    speechSynthesis.cancel()
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
    }
    setFinished(true)
  }, [])

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  if (!supported) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <MicOff className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Navegador no compatible</h2>
        <p className="text-gray-500 text-sm">
          Tu navegador no soporta reconocimiento de voz. Usa Google Chrome o Microsoft Edge.
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

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-lanmac border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 text-sm">Preparando tu tutor de inglés...</p>
        </div>
      </div>
    )
  }

  if (finished) {
    const userMessages = messages.filter((m) => m.role === 'user')
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">!Sesión completada!</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Resumen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-lanmac">{userMessages.length}</p>
              <p className="text-xs text-gray-500">Mensajes enviados</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{formatTime(elapsed)}</p>
              <p className="text-xs text-gray-500">Tiempo practicado</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Cada minuto de conversación en inglés fortalece tu fluidez. !Sigue practicando!
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/practice')}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Volver a practicar
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-gray-900">Conversación con IA</h2>
          <p className="text-xs text-gray-400">Nivel {level}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-mono text-gray-500">
          <Clock className="w-4 h-4" />
          {formatTime(elapsed)}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-lanmac text-white rounded-br-md'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
              }`}
            >
              <p>{msg.content}</p>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => replayMessage(msg.content)}
                  className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-lanmac transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Reproducir
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {recording && transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-blue-100 text-blue-800 border border-blue-200 italic">
              {transcript}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{error}</div>
      )}

      {/* Controls */}
      <div className="px-4 py-4 border-t border-gray-100 bg-white space-y-2">
        <div className="flex gap-2">
          <button
            onClick={recording ? stopAndSend : startRecording}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 transition-all text-sm font-semibold select-none ${
              recording
                ? 'border-red-400 bg-red-50 text-red-700 animate-pulse'
                : loading
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-wait'
                  : 'border-lanmac bg-blue-50 text-lanmac hover:bg-blue-100 cursor-pointer'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Pensando...
              </>
            ) : recording ? (
              <>
                <MicOff className="w-5 h-5" />
                Enviar
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Hablar
              </>
            )}
          </button>
          <button
            onClick={endSession}
            className="px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Terminar
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">
          Habla en inglés · Tu tutor adapta el nivel
        </p>
      </div>
    </div>
  )
}
