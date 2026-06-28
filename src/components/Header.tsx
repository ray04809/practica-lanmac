import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

interface HeaderProps {
  streak?: number
  showStreak?: boolean
}

export function Header({ streak = 0, showStreak }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="https://lanmac.edu.do" className="flex items-center gap-2">
          <img
            src="https://lanmac.edu.do/wp-content/uploads/2024/02/LANMAC-Logo-200px.webp"
            alt="LANMAC"
            className="h-10 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <span className="text-lanmac font-bold text-lg hidden sm:inline">LANMAC</span>
        </a>

        <div className="flex items-center gap-3">
          {showStreak && streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full animate-streak-glow">
              <Flame className="w-4 h-4 text-streak" />
              <span className="text-sm font-bold text-streak">{streak}</span>
            </div>
          )}
          <a
            href="https://lanmac.edu.do"
            className="text-sm text-gray-500 hover:text-lanmac transition-colors hidden sm:block"
          >
            lanmac.edu.do
          </a>
        </div>
      </div>
    </header>
  )
}
