import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import PlayboardPage from './pages/PlayboardPage'
import ShowdownPage from './pages/ShowdownPage'
import LeaderboardPage from './pages/LeaderboardPage'
import RewardsPage from './pages/RewardsPage'
import { gameStatus } from './data/mock'

function App() {
  const [status, setStatus] = useState(gameStatus)

  const handleTokenDelta = (delta: number) => {
    setStatus((prev) => ({
      ...prev,
      tokens: Math.max(0, prev.tokens + delta),
    }))
  }

  const handleSpendTokens = (amount: number) => {
    handleTokenDelta(-amount)
  }

  return (
    <div className="app">
      <AppHeader status={status} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage status={status} />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route
            path="/playboard"
            element={<PlayboardPage status={status} onTokenDelta={handleTokenDelta} />}
          />
          <Route path="/showdown" element={<ShowdownPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/rewards"
            element={
              <RewardsPage
                tokens={status.tokens}
                onSpendTokens={handleSpendTokens}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}

export default App
