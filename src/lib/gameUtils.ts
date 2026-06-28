// Shared game utilities for vocabulary games

// ── Seeded PRNG ──────────────────────────────────────────────

/**
 * Deterministic pseudo-random number generator from a string seed.
 * Returns a function that produces values in [0, 1) on each call.
 */
export function seededRandom(seed: string): () => number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1)
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61)
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296
  }
}

// ── Game Stats (localStorage) ────────────────────────────────

export interface GameStats {
  currentStreak: number
  bestStreak: number
  totalWins: number
  totalPlayed: number
  wordsToday: number
  lastPlayDate: string
}

const DEFAULT_STATS: GameStats = {
  currentStreak: 0,
  bestStreak: 0,
  totalWins: 0,
  totalPlayed: 0,
  wordsToday: 0,
  lastPlayDate: '',
}

function statsKey(gameType: string): string {
  return `lanmac_game_stats_${gameType}`
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getGameStats(gameType: string): GameStats {
  try {
    const raw = localStorage.getItem(statsKey(gameType))
    if (!raw) return { ...DEFAULT_STATS }
    const parsed = JSON.parse(raw) as GameStats
    // Reset daily counter if date changed
    if (parsed.lastPlayDate !== todayStr()) {
      parsed.wordsToday = 0
    }
    return parsed
  } catch {
    return { ...DEFAULT_STATS }
  }
}

export function updateStreak(gameType: string, won: boolean): GameStats {
  const stats = getGameStats(gameType)
  const today = todayStr()

  stats.totalPlayed++
  if (won) {
    stats.totalWins++
    stats.currentStreak++
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
  } else {
    stats.currentStreak = 0
  }

  if (stats.lastPlayDate !== today) {
    stats.wordsToday = 0
  }
  stats.wordsToday++
  stats.lastPlayDate = today

  localStorage.setItem(statsKey(gameType), JSON.stringify(stats))
  return stats
}

export function incrementWordsToday(gameType: string): GameStats {
  const stats = getGameStats(gameType)
  const today = todayStr()
  if (stats.lastPlayDate !== today) {
    stats.wordsToday = 0
  }
  stats.wordsToday++
  stats.lastPlayDate = today
  localStorage.setItem(statsKey(gameType), JSON.stringify(stats))
  return stats
}

// ── Word Search Grid Generator ───────────────────────────────

export type Direction = 'horizontal' | 'vertical' | 'diagonal'

export interface PlacedWord {
  word: string
  row: number
  col: number
  direction: Direction
  cells: [number, number][]
}

/**
 * Generate a word search grid with the given words placed.
 * Returns the grid (2D array of letters) and info about placed words.
 */
export function generateWordSearchGrid(
  words: string[],
  size: number
): { grid: string[][]; placedWords: PlacedWord[] } {
  const seed = words.join('-')
  const rng = seededRandom(seed)

  // Sort words by length (longest first for easier placement)
  const sorted = [...words].sort((a, b) => b.length - a.length)

  // Initialize empty grid
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '')
  )

  const placedWords: PlacedWord[] = []
  const directions: Direction[] = ['horizontal', 'vertical', 'diagonal']

  const deltas: Record<Direction, [number, number]> = {
    horizontal: [0, 1],
    vertical: [1, 0],
    diagonal: [1, 1],
  }

  for (const word of sorted) {
    const upper = word.toUpperCase()
    let placed = false
    let attempts = 0
    const maxAttempts = 100

    while (!placed && attempts < maxAttempts) {
      attempts++
      const dir = directions[Math.floor(rng() * directions.length)]
      const [dr, dc] = deltas[dir]

      const maxRow = size - (dr === 0 ? 1 : upper.length)
      const maxCol = size - (dc === 0 ? 1 : upper.length)

      if (maxRow < 0 || maxCol < 0) continue

      const row = Math.floor(rng() * (maxRow + 1))
      const col = Math.floor(rng() * (maxCol + 1))

      // Check if word fits without conflicts
      let fits = true
      const cells: [number, number][] = []
      for (let i = 0; i < upper.length; i++) {
        const r = row + dr * i
        const c = col + dc * i
        if (r >= size || c >= size) {
          fits = false
          break
        }
        const existing = grid[r][c]
        if (existing !== '' && existing !== upper[i]) {
          fits = false
          break
        }
        cells.push([r, c])
      }

      if (fits) {
        // Place the word
        for (let i = 0; i < upper.length; i++) {
          const r = row + dr * i
          const c = col + dc * i
          grid[r][c] = upper[i]
        }
        placedWords.push({ word: upper, row, col, direction: dir, cells })
        placed = true
      }
    }
  }

  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(rng() * letters.length)]
      }
    }
  }

  return { grid, placedWords }
}

// ── Sound Effects (Web Audio API) ────────────────────────────

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new AudioContext()
    }
    return audioCtx
  } catch {
    return null
  }
}

export function playCorrectSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(523, ctx.currentTime) // C5
  osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1) // E5
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.3)
}

export function playWrongSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.3)
}

export function playWinSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15)
    gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4)
    osc.start(ctx.currentTime + i * 0.15)
    osc.stop(ctx.currentTime + i * 0.15 + 0.4)
  })
}

export function playLoseSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const notes = [392, 349, 330, 262] // G4 F4 E4 C4 descending
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.2)
    gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.2)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.2 + 0.4)
    osc.start(ctx.currentTime + i * 0.2)
    osc.stop(ctx.currentTime + i * 0.2 + 0.4)
  })
}

export function playFoundSound() {
  const ctx = getAudioContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.setValueAtTime(880, ctx.currentTime)
  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.15)
}

// ── Timer formatting ─────────────────────────────────────────

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
