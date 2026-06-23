import { Brain } from 'lucide-react'
import { NEURO_TIPS } from '../lib/types'

interface Props {
  index?: number
}

export function NeurocienciaTip({ index }: Props) {
  const tip = NEURO_TIPS[index != null ? index % NEURO_TIPS.length : Math.floor(Math.random() * NEURO_TIPS.length)]
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 animate-slide-up">
      <Brain className="w-5 h-5 text-lanmac shrink-0 mt-0.5" />
      <div>
        <span className="text-xs font-semibold text-lanmac uppercase tracking-wide">SPEAK360 Neurociencia</span>
        <p className="text-sm text-gray-700 mt-0.5">{tip}</p>
      </div>
    </div>
  )
}
