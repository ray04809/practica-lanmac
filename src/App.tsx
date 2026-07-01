import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { PushBanner } from './components/PushBanner'
import { CookieBanner } from './components/CookieBanner'
import { Landing } from './pages/Landing'
import { PlacementTest } from './pages/PlacementTest'
import { DailyPractice } from './pages/DailyPractice'
import { Results } from './pages/Results'
import { Conversation } from './pages/Conversation'
import { Leaderboard } from './pages/Leaderboard'
import { Games } from './pages/Games'
import { HangMan } from './pages/games/HangMan'
import { WordSearch } from './pages/games/WordSearch'
import { LegalPrivacy } from './pages/LegalPrivacy'
import { LegalTerms } from './pages/LegalTerms'
import { LegalCookies } from './pages/LegalCookies'
import { useUser } from './hooks/useUser'

function AppContent() {
  const { user, loading, refresh } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-4 border-lanmac border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header streak={user?.current_streak} showStreak={!!user && user.total_exercises > 0} />
      <main className="flex-1 max-w-4xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Landing user={user} onRefresh={refresh} />} />
          <Route
            path="/placement"
            element={
              user ? <PlacementTest user={user} onComplete={refresh} /> : <Landing user={null} />
            }
          />
          <Route
            path="/practice"
            element={
              user ? <DailyPractice user={user} onComplete={refresh} /> : <Landing user={null} />
            }
          />
          <Route
            path="/conversation"
            element={
              user ? <Conversation user={user} /> : <Landing user={null} />
            }
          />
          <Route
            path="/results"
            element={user ? <Results user={user} /> : <Landing user={null} />}
          />
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard user={user} /> : <Landing user={null} />}
          />
          <Route path="/games" element={<Games />} />
          <Route path="/games/hangman" element={<HangMan />} />
          <Route path="/games/wordsearch" element={<WordSearch />} />
          <Route path="/legal/privacidad" element={<LegalPrivacy />} />
          <Route path="/legal/terminos" element={<LegalTerms />} />
          <Route path="/legal/cookies" element={<LegalCookies />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">404</h2>
                <p className="text-gray-500 mb-6">Página no encontrada</p>
                <a href="/" className="bg-lanmac text-white px-6 py-3 rounded-xl font-semibold hover:bg-lanmac-dark transition-colors">
                  Volver al inicio
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
      <PushBanner fingerprintId={user?.fingerprint ?? null} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
