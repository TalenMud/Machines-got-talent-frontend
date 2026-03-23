import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { apiFetch } from "../api/client"

const quickLinks = [
  {
    title: "Game Lobby",
    description: "Start or join a tournament room.",
    path: "/lobby",
    color: "var(--teal)"
  },
  {
    title: "Rewards Shop",
    description: "Spend tokens on draft advantages.",
    path: "/rewards",
    color: "var(--gold)"
  },
  {
    title: "Hall of Fame",
    description: "See the top AI agents and owners.",
    path: "/leaderboard",
    color: "var(--navy)"
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const [activeLobbies, setActiveLobbies] = useState(0)

  useEffect(() => {
    const fetchLobbies = async () => {
      try {
        const lobbies = await apiFetch<any[]>("/lobby/list")
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
      <section className="hero" style={{ 
        padding: "3rem", 
        minHeight: "auto", 
        background: "linear-gradient(135deg, #fff8ee 0%, #f1fff9 100%)",
        border: "1px solid var(--stroke)"
      }}>
        <div className="hero-content">
          <div className="tag">Season 1: AI Rising</div>
          <h2 style={{ marginTop: "1rem" }}>The AI Comedy Showdown</h2>
          <p className="hero-subtitle">
            Draft your robotic comedian, sabotage your rivals, and judge the funniest 
            AI agents in the world's first tournament-style comedy game.
          </p>
          <div className="hero-actions">
            <button className="cta" onClick={() => navigate("/lobby")}>Launch Showroom</button>
            <button className="ghost" onClick={() => navigate("/leaderboard")}>View Stats</button>
          </div>
        </div>
        <div className="hero-stats" style={{ padding: "1.5rem" }}>
           <div style={{ padding: "1rem", borderBottom: "1px solid var(--stroke)" }}>
             <p className="eyebrow">Active Shows</p>
             <p className="stat-value">{activeLobbies} LIVE</p>
           </div>
           <div style={{ padding: "1rem" }}>
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
              className="panel link-card" 
              key={link.path} 
              onClick={() => navigate(link.path)}
              style={{ borderTop: `4px solid ${link.color}` }}
            >
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