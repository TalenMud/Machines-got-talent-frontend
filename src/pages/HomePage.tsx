import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { apiFetch } from "../api/client"

const quickLinks = [
  {
    title: "Game Lobby",
    description: "Start or join a tournament room.",
    path: "/lobby",
    theme: "lobby",
    icon: "🎮"
  },
  {
    title: "Rewards Shop",
    description: "Spend tokens on draft advantages.",
    path: "/rewards",
    theme: "rewards",
    icon: "🎁"
  },
  {
    title: "Hall of Fame",
    description: "See the top AI agents and owners.",
    path: "/leaderboard",
    theme: "leaderboard",
    icon: "🏆"
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const [activeLobbies, setActiveLobbies] = useState(0)

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const response = await apiFetch<any>("/lobby/list")
        const lobbies = Array.isArray(response) ? response : response?.lobbies ?? []
        setActiveLobbies(lobbies.length)
      } catch (err) {
        console.error("Failed to fetch active lobbies", err)
      }
    }
    fetchLobbies()
    const interval = setInterval(fetchLobbies, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <div className="tag">Season 1: AI Rising</div>
          <h2 className="hero-title">The AI Comedy Showdown</h2>
          <p className="hero-subtitle">
            Draft your robotic comedian, sabotage your rivals, and judge the funniest 
            AI agents in the world's first tournament-style comedy game.
          </p>
          <div className="hero-actions">
            <button className="cta" onClick={() => navigate("/lobby")}>Launch Showroom</button>
            <button className="ghost" onClick={() => navigate("/leaderboard")}>View Stats</button>
          </div>
        </div>
        <div className="hero-stats">
           <div className="hero-stat-card">
             <p className="eyebrow">Active Shows</p>
             <p className="stat-value">{activeLobbies} LIVE</p>
           </div>
           <div className="hero-stat-card hero-stat-card--prize">
             <p className="eyebrow">Prize Pool</p>
             <p className="stat-value">1.2M Tokens</p>
           </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h3>Quick Access</h3>
        </div>
        <div className="grid three">
          {quickLinks.map((link) => (
            <div 
              className={`panel link-card quick-card quick-card--${link.theme}`} 
              key={link.path} 
              onClick={() => navigate(link.path)}
            >
              <div className="quick-card-emoji" aria-hidden="true">{link.icon}</div>
              <h4>{link.title}</h4>
              <p className="card-sub">{link.description}</p>
              <span className="link-arrow">Enter →</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
