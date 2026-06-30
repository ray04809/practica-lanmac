import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Clock, Volume2, ArrowLeft, Mic, MicOff, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { PracticeUser, CefrLevel } from '../lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  corrections?: { original: string; corrected: string; explanation: string }[]
}

const MAX_DURATION_MS = 2 * 60 * 1000
const MAX_EXCHANGES = 8

interface Props {
  user: PracticeUser
}

export function Conversation({ user }: Props) {
  const navigate = useNavigate()
  const level = (user.detected_cefr || 'A2') as CefrLevel
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [topic, setTopic] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [startTime] = useState(Date.now())
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_MS)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const playerRef = useRef<HTMLAudioElement | null>(null)

  // Auto-play helper for assistant audio
  const playAudio = useCallback((dataUrl: string) => {
    try {
      if (playerRef.current) {
        playerRef.current.pause()
        playerRef.current.src = ''
      }
      const audio = new Audio(dataUrl)
      playerRef.current = audio
      audio.play().catch((err) => console.warn('Audio play failed', err))
    } catch (err) {
      console.warn('Audio playback error', err)
    }
  }, [])

  // Init: pick topic, call voice-conversation start
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const { data: topicData } = await supabase.functions.invoke('practice-conversation', {
          body: { action: 'get_topic', cefr_level: level },
        })
        const t = topicData?.topic || 'your hobbies'
        if (cancelled) return
        setTopic(t)

        const { data: startData, error: startErr } = await supabase.functions.invoke('voice-conversation', {
          body: {
            action: 'start',
            user_id: user.id,
            topic: t,
            user_name: user.full_name || 'there',
            user_cefr: level,
          },
        })
        if (cancelled) return
        if (startErr) throw startErr

        if (!startData?.session_id) {
          // Daily limit reached
          setError(startData?.greeting || 'Ya usaste tu tiempo de hoy. Vuelve mañana.')
          setFinished(true)
          return
        }

        setSessionId(startData.session_id)
        const greetingMsg: Message = {
          role: 'assistant',
          content: startData.greeting,
          audioUrl: startData.greeting_audio_url || undefined,
        }
        setMessages([greetingMsg])
        if (startData.greeting_audio_url) playAudio(startData.greeting_audio_url)
      } catch (err: unknown) {
        console.error('init error', err)
        setError('No pudimos iniciar la conversación. Intenta de nuevo en un momento.')
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }
    init()
    return () => {
      cancelled = true
      // cleanup mic stream on unmount
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (playerRef.current) {
        playerRef.current.pause()
        playerRef.current.src = ''
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, user.id])

  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, MAX_DURATION_MS - (Date.now() - startTime))
      setTimeLeft(remaining)
      if (remaining <= 0) setFinished(true)
    }, 500)
    return () => clearInterval(interval)
  }, [startTime, finished])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const userExchanges = messages.filter((m) => m.role === 'user').length

  // Convert blob -> base64 (no prefix)
  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        // data:audio/webm;base64,XXXX  -> XXXX
        const comma = result.indexOf(',')
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

  const startRecording = useCallback(async () => {
    if (loading || finished || !sessionId) return
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : ''
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      mediaRecorderRef.current = rec
      audioChunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      rec.onstop = async () => {
        const tracks = streamRef.current?.getTracks() || []
        tracks.forEach((t) => t.stop())
        streamRef.current = null

        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        audioChunksRef.current = []
        if (blob.size < 1000) {
          setRecording(false)
          setError('Grabación demasiado corta. Mantén presionado mientras hablas.')
          return
        }
        await sendAudio(blob)
      }
      rec.start()
      setRecording(true)
    } catch (err: unknown) {
      console.error('mic permission error', err)
      setError('No pudimos acceder a tu micrófono. Revisa los permisos del navegador.')
      setRecording(false)
    }
  }, [loading, finished, sessionId])

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current
    if (rec && rec.state !== 'inactive') {
      rec.stop()
    }
    setRecording(false)
  }, [])

  const sendAudio = useCallback(
    async (blob: Blob) => {
      if (!sessionId) return
      setLoading(true)
      try {
        const audio_base64 = await blobToBase64(blob)
        // Build conversation history for the model (tutor expects {role:'tutor'|'student', text})
        const conversation_history = messages.map((m) => ({
          role: m.role === 'assistant' ? 'tutor' : 'student',
          text: m.content,
        }))

        const { data, error: invokeErr } = await supabase.functions.invoke('voice-conversation', {
          body: {
            action: 'message',
            session_id: sessionId,
            user_id: user.id,
            audio_base64,
            conversation_history,
          },
        })
        if (invokeErr) throw invokeErr

        const transcription = (data?.transcription || '').trim()
        const tutorText = data?.tutor_text || ''
        const tutorAudio = data?.tutor_audio_url || undefined
        const corrections = (data?.corrections || []) as Message['corrections']

        if (!transcription && !tutorText) {
          setError('No pude escucharte. Intenta de nuevo.')
          return
        }

        setMessages((prev) => {
          const next = [...prev]
          if (transcription) next.push({ role: 'user', content: transcription })
          if (tutorText) {
            next.push({
              role: 'assistant',
              content: tutorText,
              audioUrl: tutorAudio,
              corrections: corrections && corrections.length ? corrections : undefined,
            })
          }
          return next
        })

        if (tutorAudio) playAudio(tutorAudio)

        if (data?.time_remaining_seconds === 0) {
          setFinished(true)
          return
        }
        if (userExchanges + 1 >= MAX_EXCHANGES) {
          setFinished(true)
        }
      } catch (err: unknown) {
        console.error('voice-conversation error', err)
        setError('Hubo un problema procesando tu audio. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    },
    [sessionId, messages, user.id, userExchanges, playAudio]
  )

  const replayAssistant = (audioUrl?: string, text?: string) => {
    if (audioUrl) {
      playAudio(audioUrl)
      return
    }
    if (text) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.85
      speechSynthesis.speak(u)
    }
  }

  const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000)
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-lanmac border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 text-sm">Preparando conversación...</p>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Conversación completada!</h2>
          {topic && (
            <p className="text-gray-500 text-sm">
              Practicaste {userExchanges} intercambios sobre &ldquo;{topic}&rdquo;
            </p>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Resumen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-lanmac">{userExchanges}</p>
              <p className="text-xs text-gray-500">Turnos de voz</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((MAX_DURATION_MS - timeLeft) / 1000)}s
              </p>
              <p className="text-xs text-gray-500">Tiempo practicado</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ¡Excelente trabajo! Cada conversación mejora tu fluidez. La clave es practicar un poco cada día.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/practice')}
            className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
          >
            Volver a practicar
          </button>
          <button onClick={() => navigate('/')} className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm">
            Ir al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-gray-900">Conversación de voz</h2>
          {topic && <p className="text-xs text-gray-400">Tema: {topic}</p>}
        </div>
        <div className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 30000 ? 'text-red-500' : 'text-gray-500'}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

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
                  onClick={() => replayAssistant(msg.audioUrl, msg.content)}
                  className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-lanmac transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Reproducir
                </button>
              )}
              {msg.corrections && msg.corrections.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                  {msg.corrections.map((c, ci) => (
                    <div key={ci} className="text-xs text-gray-600">
                      <span className="line-through text-red-500">{c.original}</span>{' '}
                      <span className="text-green-600 font-medium">→ {c.corrected}</span>
                      <p className="text-[11px] text-gray-500 italic">{c.explanation}</p>
                    </div>
                  ))}
                </div>
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
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{error}</div>
      )}

      <div className="px-4 py-4 border-t border-gray-100 bg-white">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={recording ? stopRecording : undefined}
          onTouchStart={(e) => {
            e.preventDefault()
            startRecording()
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            stopRecording()
          }}
          disabled={loading || !sessionId}
          className={`w-full flex items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 transition-all text-sm font-semibold select-none ${
            recording
              ? 'border-red-400 bg-red-50 text-red-700 animate-pulse'
              : loading
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-wait'
                : 'border-lanmac bg-blue-50 text-lanmac hover:bg-blue-100 cursor-pointer'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Procesando...
            </>
          ) : recording ? (
            <>
              <MicOff className="w-6 h-6" />
              Suelta para enviar
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              Mantén presionado para hablar
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          {MAX_EXCHANGES - userExchanges} turnos restantes · Habla en inglés
        </p>
      </div>
    </div>
  )
}
