import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  Trophy,
  Clock,
  Star,
} from 'lucide-react'
import { getDailyCategory, getWordsByDifficulty, type WordEntry } from '../../lib/wordLists'
import {
  getGameStats,
  updateStreak,
  formatTime,
  playCorrectSound,
  playWrongSound,
  playWinSound,
  playLoseSound,
} from '../../lib/gameUtils'
import type { GameStats } from '../../lib/gameUtils'

type Difficulty = 'easy' | 'medium' | 'hard'
type GameState = 'playing' | 'won' | 'lost'

const MAX_WRONG = 6
const HINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 3,
  medium: 2,
  hard: 1,
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Facil',
  medium: 'Medio',
  hard: 'Dificil',
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// ── Hangman SVG ──────────────────────────────────────────────

function HangmanSVG({ wrongCount }: { wrongCount: number }) {
  return (
    <svg viewBox="0 0 200 220" className="w-full max-w-[200px] mx-auto">
      {/* Gallows */}
      <line x1="20" y1="210" x2="180" y2="210" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="210" x2="60" y2="30" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="30" x2="130" y2="30" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="30" x2="130" y2="55" stroke="#374151" strokeWidth="4" strokeLinecap="round" />

      {/* Head */}
      {wrongCount >= 1 && (
        <circle
          cx="130" cy="75" r="20"
          stroke="#2563EB" strokeWidth="3" fill="none"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Body */}
      {wrongCount >= 2 && (
        <line
          x1="130" y1="95" x2="130" y2="150"
          stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Left arm */}
      {wrongCount >= 3 && (
        <line
          x1="130" y1="110" x2="105" y2="135"
          stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Right arm */}
      {wrongCount >= 4 && (
        <line
          x1="130" y1="110" x2="155" y2="135"
          stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Left leg */}
      {wrongCount >= 5 && (
        <line
          x1="130" y1="150" x2="110" y2="185"
          stroke="#2563EB" strokeWidth="3" strokeLinecap="round"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Right leg */}
      {wrongCount >= 6 && (
        <line
          x1="130" y1="150" x2="150" y2="185"
          stroke="#ef4444" strokeWidth="3" strokeLinecap="round"
          className="animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      {/* Face on loss */}
      {wrongCount >= 6 && (
        <>
          <line x1="122" y1="70" x2="128" y2="76" stroke="#ef4444" strokeWidth="2" />
          <line x1="128" y1="70" x2="122" y2="76" stroke="#ef4444" strokeWidth="2" />
          <line x1="132" y1="70" x2="138" y2="76" stroke="#ef4444" strokeWidth="2" />
          <line x1="138" y1="70" x2="132" y2="76" stroke="#ef4444" strokeWidth="2" />
          <path d="M120 86 Q130 80 140 86" stroke="#ef4444" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  )
}

// ── Main Component ───────────────────────────────────────────

export function HangMan() {
  const navigate = useNavigate()
  const today = new Date()
  const category = getDailyCategory(today)

  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [wordEntry, setWordEntry] = useState<WordEntry | null>(null)
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [hintsLeft, setHintsLeft] = useState(HINTS_BY_DIFFICULTY.medium)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [soundOn, setSoundOn] = useState(true)
  const [stats, setStats] = useState<GameStats>(() => getGameStats('hangman'))
  const [timer, setTimer] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pick a word based on difficulty and word index
  const pickWord = useCallback(
    (diff: Difficulty, idx: number) => {
      const words = getWordsByDifficulty(today, diff, 10)
      const entry = words[idx % words.length]
      return entry
    },
    [today]
  )

  // Initialize game
  const startGame = useCallback(
    (diff?: Difficulty, newIdx?: number) => {
      const d = diff ?? difficulty
      const i = newIdx ?? wordIndex
      const entry = pickWord(d, i)
      setWordEntry(entry)
      setGuessedLetters(new Set())
      setHintsLeft(HINTS_BY_DIFFICULTY[d])
      setGameState('playing')
      setTimer(0)
      setShowResult(false)
      if (diff) setDifficulty(d)
    },
    [difficulty, wordIndex, pickWord]
  )

  // Init on mount
  useEffect(() => {
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameState])

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (gameState !== 'playing') return
      const letter = e.key.toUpperCase()
      if (ALPHABET.includes(letter) && !guessedLetters.has(letter)) {
        handleGuess(letter)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, guessedLetters, wordEntry])

  if (!wordEntry) return null

  const word = wordEntry.word.toUpperCase()
  const wrongLetters = [...guessedLetters].filter((l) => !word.includes(l))
  const wrongCount = wrongLetters.length
  const correctLetters = [...guessedLetters].filter((l) => word.includes(l))
  const allRevealed = word.split('').every((l) => guessedLetters.has(l))

  function handleGuess(letter: string) {
    if (gameState !== 'playing' || guessedLetters.has(letter)) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    const isCorrect = word.includes(letter)

    if (isCorrect) {
      if (soundOn) playCorrectSound()
      // Check win
      const nowAllRevealed = word.split('').every((l) => newGuessed.has(l))
      if (nowAllRevealed) {
        setGameState('won')
        setShowResult(true)
        if (soundOn) setTimeout(() => playWinSound(), 300)
        const newStats = updateStreak('hangman', true)
        setStats(newStats)
      }
    } else {
      if (soundOn) playWrongSound()
      const newWrongCount = [...newGuessed].filter((l) => !word.includes(l)).length
      if (newWrongCount >= MAX_WRONG) {
        setGameState('lost')
        setShowResult(true)
        if (soundOn) setTimeout(() => playLoseSound(), 300)
        const newStats = updateStreak('hangman', false)
        setStats(newStats)
      }
    }
  }

  function useHint() {
    if (hintsLeft <= 0 || gameState !== 'playing') return
    const unguessed = word.split('').filter((l) => !guessedLetters.has(l))
    if (unguessed.length === 0) return
    const randomLetter = unguessed[Math.floor(Math.random() * unguessed.length)]
    setHintsLeft((h) => h - 1)
    handleGuess(randomLetter)
  }

  function handleNewGame() {
    const nextIdx = wordIndex + 1
    setWordIndex(nextIdx)
    startGame(difficulty, nextIdx)
  }

  function handleDifficultyChange(diff: Difficulty) {
    setWordIndex(0)
    startGame(diff, 0)
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] py-6 px-4 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/games')}
          className="flex items-center gap-1 text-gray-500 hover:text-lanmac transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Juegos
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {formatTime(timer)}
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Category Badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 bg-lanmac/10 text-lanmac text-sm font-medium px-3 py-1 rounded-full">
          <Star className="w-3.5 h-3.5" />
          {category.nameEs} — {category.name}
        </span>
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2">
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => handleDifficultyChange(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              difficulty === d
                ? 'bg-lanmac text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {DIFFICULTY_LABELS[d]}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-streak">
          <Flame className="w-4 h-4" />
          <span className="font-bold">{stats.currentStreak}</span>
          <span className="text-gray-400">racha</span>
        </div>
        <div className="flex items-center gap-1 text-lanmac">
          <Trophy className="w-4 h-4" />
          <span className="font-bold">{stats.bestStreak}</span>
          <span className="text-gray-400">mejor</span>
        </div>
        <div className="flex items-center gap-1 text-success">
          <Star className="w-4 h-4" />
          <span className="font-bold">{stats.wordsToday}</span>
          <span className="text-gray-400">hoy</span>
        </div>
      </div>

      {/* Hangman Drawing */}
      <div className="flex justify-center">
        <div className={`transition-transform duration-300 ${
          gameState === 'lost' ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}>
          <HangmanSVG wrongCount={wrongCount} />
        </div>
      </div>

      {/* Wrong count indicator */}
      <div className="flex justify-center gap-1">
        {Array.from({ length: MAX_WRONG }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < wrongCount ? 'bg-danger scale-110' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Word Display */}
      <div className="flex justify-center gap-2 flex-wrap">
        {word.split('').map((letter, i) => {
          const revealed = guessedLetters.has(letter) || gameState === 'lost'
          return (
            <div
              key={i}
              className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center border-b-4 text-xl sm:text-2xl font-bold transition-all duration-300 ${
                gameState === 'lost' && !guessedLetters.has(letter)
                  ? 'border-danger text-danger'
                  : revealed
                  ? 'border-lanmac text-gray-900'
                  : 'border-gray-300'
              } ${
                revealed && guessedLetters.has(letter)
                  ? 'animate-[bounceIn_0.3s_ease-out]'
                  : ''
              }`}
            >
              {revealed ? letter : ''}
            </div>
          )
        })}
      </div>

      {/* Hint - Spanish translation */}
      <p className="text-center text-sm text-gray-400">
        Pista: <span className="font-medium text-gray-600">{wordEntry.hint}</span>
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={useHint}
          disabled={hintsLeft <= 0 || gameState !== 'playing'}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            hintsLeft > 0 && gameState === 'playing'
              ? 'bg-warning/10 text-warning hover:bg-warning/20'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Pista ({hintsLeft})
        </button>
        <button
          onClick={handleNewGame}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Nueva palabra
        </button>
      </div>

      {/* Keyboard */}
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5">
          {ALPHABET.map((letter) => {
            const isGuessed = guessedLetters.has(letter)
            const isCorrect = isGuessed && word.includes(letter)
            const isWrong = isGuessed && !word.includes(letter)

            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || gameState !== 'playing'}
                className={`h-10 sm:h-11 rounded-lg font-bold text-sm transition-all duration-200 ${
                  isCorrect
                    ? 'bg-success text-white scale-95'
                    : isWrong
                    ? 'bg-danger/20 text-danger/50 scale-90'
                    : gameState !== 'playing'
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-lanmac hover:text-lanmac hover:shadow-md active:scale-95'
                }`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Win/Lose Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-[fadeIn_0.3s_ease-out]">
          <div className={`bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-[scaleIn_0.3s_ease-out] ${
            gameState === 'won' ? 'ring-4 ring-success/30' : 'ring-4 ring-danger/30'
          }`}>
            {gameState === 'won' ? (
              <>
                <div className="text-5xl mb-3 animate-[bounceIn_0.5s_ease-out]">
                  <Trophy className="w-16 h-16 text-warning mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Excelente!</h2>
                <p className="text-gray-500 mb-2">Adivinaste la palabra</p>
                <p className="text-3xl font-bold text-lanmac mb-4">{word}</p>
                <p className="text-sm text-gray-400 mb-1">({wordEntry.hint})</p>
                <div className="flex justify-center gap-4 mb-6 text-sm">
                  <div>
                    <span className="font-bold text-gray-900">{formatTime(timer)}</span>
                    <p className="text-gray-400">Tiempo</p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{wrongCount}</span>
                    <p className="text-gray-400">Errores</p>
                  </div>
                  <div>
                    <span className="font-bold text-streak">{stats.currentStreak}</span>
                    <p className="text-gray-400">Racha</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3">
                  <span className="inline-block animate-[shake_0.5s_ease-in-out]">
                    <HangmanSVG wrongCount={6} />
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sigue intentando!</h2>
                <p className="text-gray-500 mb-2">La palabra era:</p>
                <p className="text-3xl font-bold text-danger mb-4">{word}</p>
                <p className="text-sm text-gray-400 mb-6">({wordEntry.hint})</p>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleNewGame}
                className="flex-1 bg-lanmac text-white py-3 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
              >
                Nueva palabra
              </button>
              <button
                onClick={() => navigate('/games')}
                className="px-4 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
