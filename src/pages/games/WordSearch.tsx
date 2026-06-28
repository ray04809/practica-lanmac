import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Star,
  Trophy,
  CheckCircle2,
} from 'lucide-react'
import { getDailyCategory, getDailyWords } from '../../lib/wordLists'
import {
  generateWordSearchGrid,
  getGameStats,
  updateStreak,
  formatTime,
  playFoundSound,
  playWinSound,
  playCorrectSound,
  type PlacedWord,
} from '../../lib/gameUtils'
import type { GameStats } from '../../lib/gameUtils'

const GRID_SIZE = 10
const WORD_COUNT = 8
const MAX_HINTS = 3

const FOUND_COLORS = [
  'rgba(37, 99, 235, 0.25)',   // blue
  'rgba(34, 197, 94, 0.25)',   // green
  'rgba(249, 115, 22, 0.25)',  // orange
  'rgba(168, 85, 247, 0.25)',  // purple
  'rgba(236, 72, 153, 0.25)',  // pink
  'rgba(20, 184, 166, 0.25)',  // teal
  'rgba(245, 158, 11, 0.25)',  // amber
  'rgba(239, 68, 68, 0.25)',   // red
  'rgba(99, 102, 241, 0.25)',  // indigo
  'rgba(6, 182, 212, 0.25)',   // cyan
]

const FOUND_BORDER_COLORS = [
  '#2563EB', '#22c55e', '#f97316', '#a855f7', '#ec4899',
  '#14b8a6', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4',
]

interface SelectedCell {
  row: number
  col: number
}

export function WordSearch() {
  const navigate = useNavigate()
  const today = new Date()
  const category = getDailyCategory(today)

  const [grid, setGrid] = useState<string[][]>([])
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([])
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [selecting, setSelecting] = useState(false)
  const [startCell, setStartCell] = useState<SelectedCell | null>(null)
  const [endCell, setEndCell] = useState<SelectedCell | null>(null)
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set())
  const [foundCellMap, setFoundCellMap] = useState<Map<string, number>>(new Map())
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS)
  const [hintedCells, setHintedCells] = useState<Set<string>>(new Set())
  const [soundOn, setSoundOn] = useState(true)
  const [timer, setTimer] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState<GameStats>(() => getGameStats('wordsearch'))
  const [score, setScore] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Generate grid
  const initGame = useCallback(() => {
    const dailyWords = getDailyWords(today, WORD_COUNT)
    const wordStrings = dailyWords.map((w) => w.word)
    const { grid: newGrid, placedWords: placed } = generateWordSearchGrid(wordStrings, GRID_SIZE)
    setGrid(newGrid)
    setPlacedWords(placed)
    setFoundWords(new Set())
    setFoundCellMap(new Map())
    setHighlightedCells(new Set())
    setHintedCells(new Set())
    setHintsLeft(MAX_HINTS)
    setStartCell(null)
    setEndCell(null)
    setSelecting(false)
    setTimer(0)
    setGameComplete(false)
    setShowResult(false)
    setScore(0)
  }, [today])

  useEffect(() => {
    initGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer
  useEffect(() => {
    if (!gameComplete && grid.length > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameComplete, grid])

  // Get cells between two points (if valid line)
  function getCellsBetween(start: SelectedCell, end: SelectedCell): [number, number][] | null {
    const dr = end.row - start.row
    const dc = end.col - start.col

    // Must be horizontal, vertical, or diagonal
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null

    const steps = Math.max(Math.abs(dr), Math.abs(dc))
    if (steps === 0) return [[start.row, start.col]]

    const stepR = dr === 0 ? 0 : dr / Math.abs(dr)
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc)

    const cells: [number, number][] = []
    for (let i = 0; i <= steps; i++) {
      cells.push([start.row + stepR * i, start.col + stepC * i])
    }
    return cells
  }

  // Check if selected cells match a word
  function checkSelection(cells: [number, number][]) {
    const selectedWord = cells.map(([r, c]) => grid[r][c]).join('')

    for (const pw of placedWords) {
      if (foundWords.has(pw.word)) continue

      const wordFromCells = pw.cells.map(([r, c]) => grid[r][c]).join('')
      if (selectedWord === wordFromCells || selectedWord === wordFromCells.split('').reverse().join('')) {
        // Found a word!
        const newFound = new Set(foundWords)
        newFound.add(pw.word)
        setFoundWords(newFound)

        // Assign color to found cells
        const colorIdx = newFound.size - 1
        const newCellMap = new Map(foundCellMap)
        for (const [r, c] of pw.cells) {
          newCellMap.set(`${r}-${c}`, colorIdx % FOUND_COLORS.length)
        }
        setFoundCellMap(newCellMap)

        // Score: 10 points per letter
        const wordScore = pw.word.length * 10
        setScore((s) => s + wordScore)

        if (soundOn) playFoundSound()

        // Check if all found
        if (newFound.size === placedWords.length) {
          const bonus = 50
          setScore((s) => s + bonus)
          setGameComplete(true)
          setShowResult(true)
          if (soundOn) setTimeout(() => playWinSound(), 300)
          const newStats = updateStreak('wordsearch', true)
          setStats(newStats)
        }
        return true
      }
    }
    return false
  }

  // Selection handlers
  function handleCellMouseDown(row: number, col: number) {
    if (gameComplete) return
    setSelecting(true)
    setStartCell({ row, col })
    setEndCell({ row, col })
    setHighlightedCells(new Set([`${row}-${col}`]))
  }

  function handleCellMouseEnter(row: number, col: number) {
    if (!selecting || !startCell || gameComplete) return
    setEndCell({ row, col })

    const cells = getCellsBetween(startCell, { row, col })
    if (cells) {
      setHighlightedCells(new Set(cells.map(([r, c]) => `${r}-${c}`)))
    }
  }

  function handleCellMouseUp() {
    if (!selecting || !startCell || !endCell || gameComplete) return
    setSelecting(false)

    const cells = getCellsBetween(startCell, endCell)
    if (cells && cells.length > 1) {
      checkSelection(cells)
    }
    setHighlightedCells(new Set())
    setStartCell(null)
    setEndCell(null)
  }

  // Touch handlers for mobile
  function handleTouchStart(row: number, col: number) {
    handleCellMouseDown(row, col)
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!selecting || !gridRef.current) return
    e.preventDefault()
    const touch = e.touches[0]
    const gridEl = gridRef.current
    const rect = gridEl.getBoundingClientRect()
    const cellSize = rect.width / GRID_SIZE
    const col = Math.floor((touch.clientX - rect.left) / cellSize)
    const row = Math.floor((touch.clientY - rect.top) / cellSize)
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      handleCellMouseEnter(row, col)
    }
  }

  function handleTouchEnd() {
    handleCellMouseUp()
  }

  // Hint: highlight first letter of a random unfound word
  function useHint() {
    if (hintsLeft <= 0 || gameComplete) return
    const unfound = placedWords.filter((pw) => !foundWords.has(pw.word))
    if (unfound.length === 0) return

    const word = unfound[Math.floor(Math.random() * unfound.length)]
    const [r, c] = word.cells[0]
    const newHinted = new Set(hintedCells)
    newHinted.add(`${r}-${c}`)
    setHintedCells(newHinted)
    setHintsLeft((h) => h - 1)
    if (soundOn) playCorrectSound()
  }

  if (grid.length === 0) return null

  return (
    <div className="min-h-[calc(100vh-7rem)] py-6 px-4 space-y-5">
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
          <div className="flex items-center gap-1 text-sm font-bold text-lanmac">
            <Star className="w-4 h-4" />
            {score}
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 bg-lanmac/10 text-lanmac text-sm font-medium px-3 py-1 rounded-full">
          <Star className="w-3.5 h-3.5" />
          {category.nameEs} — {category.name}
        </span>
      </div>

      {/* Progress */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-500">Progreso</span>
          <span className="font-bold text-lanmac">{foundWords.size}/{placedWords.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lanmac to-lanmac-light rounded-full transition-all duration-500"
            style={{ width: `${placedWords.length > 0 ? (foundWords.size / placedWords.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Main Content - Grid + Word List */}
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-center max-w-3xl mx-auto">
        {/* Grid */}
        <div
          ref={gridRef}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-3 w-full max-w-[420px] mx-auto lg:mx-0 select-none touch-none"
          onMouseUp={handleCellMouseUp}
          onMouseLeave={() => {
            if (selecting) handleCellMouseUp()
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {grid.map((row, ri) =>
              row.map((letter, ci) => {
                const key = `${ri}-${ci}`
                const isHighlighted = highlightedCells.has(key)
                const foundColorIdx = foundCellMap.get(key)
                const isFound = foundColorIdx !== undefined
                const isHinted = hintedCells.has(key)

                return (
                  <button
                    key={key}
                    onMouseDown={() => handleCellMouseDown(ri, ci)}
                    onMouseEnter={() => handleCellMouseEnter(ri, ci)}
                    onTouchStart={() => handleTouchStart(ri, ci)}
                    className={`aspect-square flex items-center justify-center text-sm sm:text-base font-bold rounded-md transition-all duration-150 ${
                      isFound
                        ? 'text-gray-800 scale-95'
                        : isHighlighted
                        ? 'bg-lanmac/20 text-lanmac scale-105 shadow-sm'
                        : isHinted
                        ? 'bg-warning/20 text-warning ring-2 ring-warning/40 animate-pulse'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-lanmac/10'
                    }`}
                    style={
                      isFound
                        ? {
                            backgroundColor: FOUND_COLORS[foundColorIdx % FOUND_COLORS.length],
                            border: `2px solid ${FOUND_BORDER_COLORS[foundColorIdx % FOUND_BORDER_COLORS.length]}`,
                          }
                        : undefined
                    }
                  >
                    {letter}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Word List Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 w-full lg:w-56 shrink-0">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Palabras a encontrar</h3>
          <div className="space-y-2">
            {placedWords.map((pw, idx) => {
              const isFound = foundWords.has(pw.word)
              return (
                <div
                  key={pw.word}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                    isFound ? 'opacity-60' : ''
                  }`}
                >
                  {isFound ? (
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: FOUND_BORDER_COLORS[idx % FOUND_BORDER_COLORS.length] }}
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span
                    className={`font-medium tracking-wider ${
                      isFound ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {pw.word}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 space-y-2">
            <button
              onClick={useHint}
              disabled={hintsLeft <= 0 || gameComplete}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                hintsLeft > 0 && !gameComplete
                  ? 'bg-warning/10 text-warning hover:bg-warning/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Pista ({hintsLeft})
            </button>
            <button
              onClick={initGame}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Nuevo juego
            </button>
          </div>
        </div>
      </div>

      {/* Win Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl ring-4 ring-success/30 animate-[scaleIn_0.3s_ease-out]">
            <div className="mb-3">
              <Trophy className="w-16 h-16 text-warning mx-auto animate-[bounceIn_0.5s_ease-out]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Todas encontradas!</h2>
            <p className="text-gray-500 mb-4">Completaste la sopa de letras</p>

            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div>
                <span className="text-2xl font-bold text-lanmac">{score}</span>
                <p className="text-gray-400">Puntos</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">{formatTime(timer)}</span>
                <p className="text-gray-400">Tiempo</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-streak">{stats.currentStreak}</span>
                <p className="text-gray-400">Racha</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={initGame}
                className="flex-1 bg-lanmac text-white py-3 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors"
              >
                Jugar otra vez
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
      `}</style>
    </div>
  )
}
