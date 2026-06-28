import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Send, Clock, Volume2, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { PracticeUser, CefrLevel } from '../lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
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
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [topic, setTopic] = useState<string | null>(null)
  const [startTime] = useState(Date.now())
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_MS)
  const [finished, setFinished] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function init() {
      try {
        const { data } = await supabase.functions.invoke('practice-conversation', {
          body: { action: 'get_topic', cefr_level: level },
        })
        const t = data?.topic || 'your hobbies'
        setTopic(t)
        const { data: d2 } = await supabase.functions.invoke('practice-conversation', {
          body: {
            messages: [{ role: 'user', content: `[System: Start a casual conversation about "${t}". Greet the student and ask an open question about the topic. Keep it short.]` }],
            cefr_level: level,
          },
        })
        if (d2?.reply) {
          setMessages([{ role: 'assistant', content: d2.reply }])
        }
      } catch {
        setTopic('your hobbies')
        setMessages([{ role: 'assistant', content: "Hi there! Let's practice English together. What are some of your favorite hobbies?" }])
      }
    }
    init()
  }, [level])

  useEffect(() => {
    if (finished) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, MAX_DURATION_MS - (Date.now() - startTime))
      setTimeLeft(remaining)
      if (remaining <= 0) setFinished(true)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime, finished])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const userExchanges = messages.filter(m => m.role === 'user').length

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading || finished) return
    const userMsg = input.trim()
    setInput('')
    const updated: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(updated)

    if (userExchanges + 1 >= MAX_EXCHANGES) {
      setFinished(true)
      return
    }

    setLoading(true)
    try {
      const { data } = await supabase.functions.invoke('practice-conversation', {
        body: {
          messages: updated.map(m => ({ role: m.role, content: m.content })),
          cefr_level: level,
        },
      })
      if (data?.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I had a connection issue. Could you try again?" }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [input, loading, finished, messages, userExchanges, level])

  const playTTS = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.85
    speechSynthesis.speak(u)
  }

  const formatTime = (ms: number) => {
    const s = Math.ceil(ms / 1000)
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  }

  if (!topic) {
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
          <p className="text-gray-500 text-sm">Practicaste {userExchanges} intercambios sobre &ldquo;{topic}&rdquo;</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Resumen</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-lanmac">{userExchanges}</p>
              <p className="text-xs text-gray-500">Mensajes enviados</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">{Math.round((MAX_DURATION_MS - timeLeft) / 1000)}s</p>
              <p className="text-xs text-gray-500">Tiempo practicado</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            ¡Excelente trabajo! Cada conversación mejora tu fluidez.
            La clave es practicar un poco cada día.
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={() => navigate('/practice')} className="w-full py-3 bg-lanmac text-white rounded-xl font-semibold hover:bg-lanmac-dark transition-colors">
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
          <h2 className="text-sm font-bold text-gray-900">Conversación</h2>
          <p className="text-xs text-gray-400">Tema: {topic}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 30000 ? 'text-red-500' : 'text-gray-500'}`}>
          <Clock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-lanmac text-white rounded-br-md'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
            }`}>
              <p>{msg.content}</p>
              {msg.role === 'assistant' && (
                <button onClick={() => playTTS(msg.content)} className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-lanmac transition-colors">
                  <Volume2 className="w-3.5 h-3.5" />
                  Escuchar
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
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe en inglés..."
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-lanmac focus:outline-none text-sm"
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-lanmac text-white rounded-xl hover:bg-lanmac-dark transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          Escribe en inglés · {MAX_EXCHANGES - userExchanges} mensajes restantes
        </p>
      </div>
    </div>
  )
}
