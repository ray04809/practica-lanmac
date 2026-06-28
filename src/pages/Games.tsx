import { useNavigate } from 'react-router-dom'
import { Gamepad2, Search, Triangle, Sparkles, Calendar } from 'lucide-react'
import { getDailyCategory } from '../lib/wordLists'

const today = new Date()
const dailyCategory = getDailyCategory(today)

interface GameCard {
  title: string
  description: string
  icon: typeof Gamepad2
  route: string
  color: string
  available: boolean
}

const GAMES: GameCard[] = [
  {
    title: 'Hangman',
    description: 'Adivina la palabra letra por letra antes de que se complete el dibujo.',
    icon: Gamepad2,
    route: '/games/hangman',
    color: 'from-blue-500 to-blue-700',
    available: true,
  },
  {
    title: 'Sopa de Letras',
    description: 'Encuentra las palabras escondidas en la cuadricula de letras.',
    icon: Search,
    route: '/games/wordsearch',
    color: 'from-emerald-500 to-emerald-700',
    available: true,
  },
  {
    title: 'Lexi Tri',
    description: 'Forma palabras combinando silabas en un tablero triangular.',
    icon: Triangle,
    route: '/games/lexitri',
    color: 'from-purple-500 to-purple-700',
    available: false,
  },
]

export function Games() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8 py-8 px-4">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-lanmac/10 px-4 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4 text-lanmac" />
          <span className="text-sm font-semibold text-lanmac">Juegos de Vocabulario</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Aprende jugando
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Practica vocabulario en ingles con juegos divertidos. Las palabras cambian cada dia.
        </p>
      </section>

      {/* Daily Theme */}
      <div className="bg-gradient-to-r from-lanmac to-lanmac-dark rounded-2xl p-5 text-white text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-blue-200" />
          <span className="text-sm text-blue-200 font-medium">Vocabulario del dia</span>
        </div>
        <p className="text-xl font-bold">{dailyCategory.nameEs} — {dailyCategory.name}</p>
        <p className="text-sm text-blue-200 mt-1">
          {dailyCategory.words.length} palabras para practicar hoy
        </p>
      </div>

      {/* Game Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map((game) => {
          const Icon = game.icon
          return (
            <button
              key={game.title}
              onClick={() => game.available && navigate(game.route)}
              disabled={!game.available}
              className={`relative text-left rounded-2xl overflow-hidden transition-all duration-300 ${
                game.available
                  ? 'hover:scale-[1.02] hover:shadow-xl cursor-pointer active:scale-[0.98]'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className={`bg-gradient-to-br ${game.color} p-6 h-full`}>
                {/* Coming Soon badge */}
                {!game.available && (
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                    Proximamente
                  </div>
                )}

                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                <p className="text-sm text-white/80 leading-relaxed">{game.description}</p>

                {game.available && (
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 bg-white/15 px-3 py-1.5 rounded-lg">
                    Jugar ahora
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-4">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-lanmac transition-colors"
        >
          Volver al inicio
        </button>
      </section>
    </div>
  )
}
