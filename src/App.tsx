import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Landing } from './pages/Landing'
import { PlacementTest } from './pages/PlacementTest'
import { DailyPractice } from './pages/DailyPractice'
import { Results } from './pages/Results'
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
          <Route path="/" element={<Landing user={user} />} />
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
            path="/results"
            element={user ? <Results user={user} /> : <Landing user={null} />}
          />
        </Routes>
      </main>
      <Footer />
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
