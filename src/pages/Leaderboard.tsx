import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trophy, RefreshCw, Users, Target, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CEFR_COLORS, type CefrLevel, type PracticeUser } from '../lib/types'

interface Props {
  user: PracticeUser
}

type TabKey = 'exercises' | 'streak' | 'accuracy'

interface LeaderboardEntry {
  id: string
  detected_cefr: CefrLevel | null
  total_exercises: number
  total_correct: number
  current_streak: number
  best_streak: number
}

interface GlobalStats {
  totalUsers: number
  avgAccuracy: number
  highestStreak: number
}

const TABS: { key: TabKey; label: string }[] = [
  { key: 'exercises', label: 'Top Ejercicios' },
  { key: 'streak', label: 'Mejor Racha' },
  { key: 'accuracy', label: 'Mayor Precisión' },
]

function getAccuracy(entry: { total_correct: number; total_exercises: number }) {
  return entry.total_exercises > 0
    ? Math.round((entry.total_correct / entry.total_exercises) * 100)
    : 0
}

function CefrBadge({ level }: { level: CefrLevel | null }) {
  if (!level) return null
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: CEFR_COLORS[level] }}
    >
      {level}
    </span>
  )
}

function PodiumCard({
  rank,
  entry,
  tab,
  isCurrentUser,
}: {
  rank: number
  entry: LeaderboardEntry
  tab: TabKey
  isCurrentUser: boolean
}) {
  const medal = rank === 1 ? '\u{1F947}' : rank === 2 ? '\u{1F948}' : '\u{1F949}'
  const heights = ['h-32', 'h-24', 'h-20']
  const bgColors = [
    'from-yellow-400 to-amber-500',
    'from-gray-300 to-gray-400',
    'from-amber-600 to-amber-700',
  ]
  const order = [1, 0, 2] // Display order: 2nd, 1st, 3rd

  const stat =
    tab === 'exercises'
      ? `${entry.total_exercises} ej.`
      : tab === 'streak'
        ? `${entry.best_streak} dias`
        : `${getAccuracy(entry)}%`

  return (
    <div
      className={`flex flex-col items-center ${order[rank - 1] === 0 ? 'order-first sm:order-2' : order[rank - 1] === 1 ? 'order-2 sm:order-first' : 'order-last'}`}
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      <div className="text-4xl mb-1">{medal}</div>
      <div
        className={`rounded-xl px-4 py-2 text-center mb-2 ${isCurrentUser ? 'ring-2 ring-lanmac ring-offset-2' : ''}`}
      >
        <p className="font-bold text-gray-900 text-sm">Estudiante #{rank}</p>
        <CefrBadge level={entry.detected_cefr} />
      </div>
      <div
        className={`${heights[rank - 1]} w-20 sm:w-24 rounded-t-xl bg-gradient-to-b ${bgColors[rank - 1]} flex items-end justify-center pb-2`}
      >
        <span className="text-white font-bold text-sm">{stat}</span>
      </div>
    </div>
  )
}

export function Leaderboard({ user }: Props) {
  const [tab, setTab] = useState<TabKey>('exercises')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalUsers: 0,
    avgAccuracy: 0,
    highestStreak: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    const orderCol = tab === 'exercises' ? 'total_exercises' : 'best_streak'

    const [leaderboardRes, statsRes] = await Promise.all([
      tab === 'accuracy'
        ? supabase
            .from('practice_users')
            .select('id, detected_cefr, total_exercises, total_correct, current_streak, best_streak')
            .gt('total_exercises', 4)
            .order('total_correct', { ascending: false })
            .limit(50)
        : supabase
            .from('practice_users')
            .select('id, detected_cefr, total_exercises, total_correct, current_streak, best_streak')
            .gt('total_exercises', 0)
            .order(orderCol, { ascending: false })
            .limit(20),
      supabase
        .from('practice_users')
        .select('id, total_exercises, total_correct, best_streak')
        .gt('total_exercises', 0),
    ])

    if (leaderboardRes.data) {
      let sorted = leaderboardRes.data as LeaderboardEntry[]
      if (tab === 'accuracy') {
        sorted = sorted
          .sort((a, b) => getAccuracy(b) - getAccuracy(a))
          .slice(0, 20)
      }
      setEntries(sorted)
    }

    if (statsRes.data && statsRes.data.length > 0) {
      const all = statsRes.data as { id: string; total_exercises: number; total_correct: number; best_streak: number }[]
      const totalUsers = all.length
      const totalCorrect = all.reduce((s, u) => s + u.total_correct, 0)
      const totalExercises = all.reduce((s, u) => s + u.total_exercises, 0)
      const avgAccuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0
      const highestStreak = Math.max(...all.map((u) => u.best_streak))
      setGlobalStats({ totalUsers, avgAccuracy, highestStreak })
    }
  }, [tab])

  useEffect(() => {
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  const userRankIndex = useMemo(
    () => entries.findIndex((e) => e.id === user.id),
    [entries, user.id]
  )

  const userPosition = useMemo(() => {
    if (userRankIndex >= 0) return userRankIndex + 1
    // User not in top 20 — estimate position
    if (user.total_exercises === 0) return null
    if (tab === 'exercises') {
      const lastVal = entries.length > 0 ? entries[entries.length - 1].total_exercises : 0
      return user.total_exercises >= lastVal ? entries.length + 1 : null
    }
    if (tab === 'streak') {
      const lastVal = entries.length > 0 ? entries[entries.length - 1].best_streak : 0
      return user.best_streak >= lastVal ? entries.length + 1 : null
    }
    const userAcc = getAccuracy(user)
    const lastAcc = entries.length > 0 ? getAccuracy(entries[entries.length - 1]) : 0
    return userAcc >= lastAcc ? entries.length + 1 : null
  }, [entries, user, tab, userRankIndex])

  const getStatValue = (entry: LeaderboardEntry) => {
    if (tab === 'exercises') return `${entry.total_exercises} ejercicios`
    if (tab === 'streak') return `${entry.best_streak} dias`
    return `${getAccuracy(entry)}% precision`
  }

  const hasEnoughData = entries.length >= 3

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lanmac/10 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-lanmac" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Clasificacion</h2>
            <p className="text-sm text-gray-500">Top practicantes de LANMAC</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          title="Actualizar"
        >
          <RefreshCw className={`w-5 h-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Usuarios activos', value: globalStats.totalUsers, color: 'text-lanmac' },
          { icon: Target, label: 'Precision media', value: `${globalStats.avgAccuracy}%`, color: 'text-warning' },
          { icon: Flame, label: 'Mayor racha', value: globalStats.highestStreak, color: 'text-streak' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              tab === key
                ? 'bg-white text-lanmac shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-3 border-lanmac border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !hasEnoughData ? (
        /* Empty state */
        <div className="text-center py-16 space-y-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Aun no hay suficientes datos</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Necesitamos al menos 3 practicantes activos para mostrar la clasificacion. Sigue practicando.
          </p>
        </div>
      ) : (
        <>
          {/* Podium — top 3 */}
          <div className="flex items-end justify-center gap-4 pt-4 pb-2">
            {entries.slice(0, 3).map((entry, i) => (
              <PodiumCard
                key={entry.id}
                rank={i + 1}
                entry={entry}
                tab={tab}
                isCurrentUser={entry.id === user.id}
              />
            ))}
          </div>

          {/* Ranking list (4-20) */}
          {entries.length > 3 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Desktop table header */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Estudiante</div>
                <div className="col-span-3">Nivel</div>
                <div className="col-span-3 text-right">
                  {tab === 'exercises' ? 'Ejercicios' : tab === 'streak' ? 'Racha' : 'Precision'}
                </div>
              </div>

              {entries.slice(3).map((entry, i) => {
                const rank = i + 4
                const isMe = entry.id === user.id
                return (
                  <div
                    key={entry.id}
                    className={`
                      px-4 py-3 border-t border-gray-50 transition-colors
                      ${isMe ? 'bg-lanmac/5 border-l-4 border-l-lanmac' : 'hover:bg-gray-50'}
                      /* Mobile: stacked card layout */
                      flex flex-col gap-1 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center
                    `}
                    style={{ animationDelay: `${rank * 50}ms` }}
                  >
                    {/* Mobile layout */}
                    <div className="flex items-center justify-between sm:hidden">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-6">#{rank}</span>
                        <div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {isMe ? 'Tu' : `Estudiante #${rank}`}
                          </span>
                          {isMe && (
                            <span className="ml-2 text-xs bg-lanmac/10 text-lanmac px-1.5 py-0.5 rounded-full font-semibold">
                              Tu
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CefrBadge level={entry.detected_cefr} />
                        <span className="text-sm font-bold text-gray-900">
                          {tab === 'exercises'
                            ? entry.total_exercises
                            : tab === 'streak'
                              ? entry.best_streak
                              : `${getAccuracy(entry)}%`}
                        </span>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:block col-span-1">
                      <span className="text-sm font-bold text-gray-400">#{rank}</span>
                    </div>
                    <div className="hidden sm:flex col-span-5 items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {isMe ? 'Tu' : `Estudiante #${rank}`}
                      </span>
                      {isMe && (
                        <span className="text-xs bg-lanmac/10 text-lanmac px-1.5 py-0.5 rounded-full font-semibold">
                          Tu
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:block col-span-3">
                      <CefrBadge level={entry.detected_cefr} />
                    </div>
                    <div className="hidden sm:block col-span-3 text-right">
                      <span className="font-bold text-gray-900">
                        {tab === 'exercises'
                          ? entry.total_exercises
                          : tab === 'streak'
                            ? entry.best_streak
                            : `${getAccuracy(entry)}%`}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {tab === 'exercises' ? 'ej.' : tab === 'streak' ? 'dias' : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Current user position if not in top 20 */}
          {userRankIndex < 0 && user.total_exercises > 0 && (
            <div className="bg-lanmac/5 border-2 border-dashed border-lanmac/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-lanmac/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-lanmac">Tu</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Tu posicion</p>
                  <p className="text-xs text-gray-500">{getStatValue(user as unknown as LeaderboardEntry)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CefrBadge level={user.detected_cefr as CefrLevel} />
                <span className="text-lg font-bold text-lanmac">
                  {userPosition ? `#${userPosition}` : '+20'}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
