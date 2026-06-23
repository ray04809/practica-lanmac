import { useNavigate } from 'react-router-dom'
import { BookOpen, Target, Brain, Zap, ChevronRight, BarChart3 } from 'lucide-react'
import type { PracticeUser } from '../lib/types'
import { CEFR_LABELS, type CefrLevel } from '../lib/types'

interface Props {
  user: PracticeUser | null
}

export function Landing({ user }: Props) {
  const navigate = useNavigate()
  const hasLevel = user && user.detected_cefr
  const hasPracticed = user && user.total_exercises > 0

  return (
    <div className="space-y-12 py-8">
      {/* Hero */}
      <section className="text-center space-y-6 px-4">
        <div className="inline-flex items-center gap-2 bg-lanmac/10 px-4 py-1.5 rounded-full">
          <Brain className="w-4 h-4 text-lanmac" />
          <span className="text-sm font-semibold text-lanmac">SPEAK360 Neurociencia</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Practica inglés<br />
          <span className="text-lanmac">en 5 minutos</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Ejercicios adaptativos basados en neurociencia. Descubre tu nivel y mejora cada día.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          {!hasLevel ? (
            <button
              onClick={() => navigate('/placement')}
              className="flex items-center justify-center gap-2 bg-lanmac text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-lanmac-dark transition-colors shadow-lg shadow-lanmac/25"
            >
              <Target className="w-5 h-5" />
              Descubrir mi nivel
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/practice')}
                className="flex items-center justify-center gap-2 bg-lanmac text-white px-6 py-4 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors shadow-lg shadow-lanmac/25"
              >
                <Zap className="w-5 h-5" />
                Práctica diaria
              </button>
              <button
                onClick={() => navigate('/results')}
                className="flex items-center justify-center gap-2 bg-white text-lanmac border-2 border-lanmac px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Mi perfil
              </button>
            </>
          )}
        </div>

        {hasLevel && (
          <p className="text-sm text-gray-500">
            Tu nivel: <span className="font-bold text-lanmac">{user.detected_cefr} — {CEFR_LABELS[user.detected_cefr as CefrLevel]}</span>
            {user.current_streak > 0 && <> · Racha: <span className="font-bold text-streak">{user.current_streak} días</span></>}
          </p>
        )}

        {hasPracticed && !hasLevel && (
          <p className="text-sm text-gray-500">
            Has completado <span className="font-bold">{user.total_exercises}</span> ejercicios
          </p>
        )}
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4">
        {[
          { icon: Target, title: 'Test de nivel', desc: '10 preguntas adaptativas para medir tu inglés.' },
          { icon: BookOpen, title: 'Práctica diaria', desc: 'Ejercicios personalizados a tu nivel cada día.' },
          { icon: Brain, title: 'Neurociencia', desc: 'Metodología SPEAK360 para aprender más rápido.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-12 h-12 bg-lanmac/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-6 h-6 text-lanmac" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-lanmac rounded-2xl mx-4 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">¿Quieres aprender inglés de verdad?</h2>
        <p className="text-blue-100 mb-4">
          Únete a LANMAC y domina el inglés con nuestro método SPEAK360.
        </p>
        <a
          href="https://wa.me/18098706555?text=Hola%2C%20quiero%20información%20sobre%20los%20cursos%20de%20inglés"
          className="inline-flex items-center gap-2 bg-white text-lanmac px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          Solicitar información
          <ChevronRight className="w-5 h-5" />
        </a>
      </section>
    </div>
  )
}
