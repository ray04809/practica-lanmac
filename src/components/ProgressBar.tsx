interface ProgressBarProps {
  current: number
  total: number
  correct: number
}

export function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0
  const correctPct = current > 0 ? (correct / current) * 100 : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Pregunta {current} de {total}</span>
        <span className={correctPct >= 70 ? 'text-success' : correctPct >= 40 ? 'text-warning' : 'text-danger'}>
          {Math.round(correctPct)}% correctas
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-lanmac rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
