import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import AppHeader from "./components/AppHeader";
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import PlayboardPage from "./pages/PlayboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import RewardsPage from "./pages/RewardsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { apiFetch } from "./api/client";

function App() {
  const [user, setUser] = useState<any>(null);

  // Sync user state with localStorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Auth sync error", e);
      }
    }
  }, []);

  // Periodic Profile Refresh (to sync Win Count and Balance from DB)
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const updatedUser = await apiFetch<any>("/auth/me");
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        console.error("Failed to sync profile", err);
      }
    };

    fetchProfile();
    const interval = setInterval(fetchProfile, 30000); // Sync every 30s
    return () => clearInterval(interval);
  }, [user?.id]);

  const refreshUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  return (
    <div className="app">
      <AppHeader user={user} onLogout={refreshUser} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={refreshUser} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/playboard" element={<PlayboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
