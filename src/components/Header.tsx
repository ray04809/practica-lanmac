import { useEffect, useState } from 'react'
import { Flame, MessageCircle, LogIn } from 'lucide-react'

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
        <a href="https://lanmac.edu.do" className="flex items-center">
          <img
            src="/logo-lanmac.png"
            alt="LANMAC"
            className="h-10 w-auto"
          />
        </a>

        <div className="flex items-center gap-2">
          {showStreak && streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full animate-streak-glow">
              <Flame className="w-4 h-4 text-streak" />
              <span className="text-sm font-bold text-streak">{streak}</span>
            </div>
          )}
          <a
            href="https://wa.me/18098706555?text=Hola%20LANA%2C%20quiero%20info%20sobre%20los%20cursos"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Habla con LANA</span>
          </a>
          <a
            href="https://portal.lanmac.edu.do"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-lanmac px-4 py-1.5 rounded-lg hover:bg-lanmac-dark transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Portal</span>
          </a>
        </div>
      </div>
    </header>
  )
}
