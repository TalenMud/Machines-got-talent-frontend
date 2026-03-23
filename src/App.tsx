import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppHeader from "./components/AppHeader";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import PlayboardPage from "./pages/PlayboardPage";
import ShowdownPage from "./pages/ShowdownPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import RewardsPage from "./pages/RewardsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [tokens, setTokens] = useState(100);

  const handleSpendTokens = (amount: number) => {
    setTokens(prev => Math.max(0, prev - amount));
  }

  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/playboard" element={<PlayboardPage />} />
          <Route path="/showdown" element={<ShowdownPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route 
            path="/rewards" 
            element={<RewardsPage />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;