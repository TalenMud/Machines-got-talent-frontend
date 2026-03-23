import { useNavigate } from "react-router-dom"

const quickLinks = [
  {
    title: "Lobby Manager",
    detail: "Create rooms, invite friends, and pick the hosts.",
    path: "/lobby",
  },
  {
    title: "Playboard Live",
    detail: "Trigger buzzers and shape the round in real time.",
    path: "/playboard",
  },
  {
    title: "AI Showdown",
    detail: "Vote on the funniest LLM and lock the crowd pick.",
    path: "/showdown",
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="hero panel" style={{ padding: '60px', textAlign: 'center', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ color: '#ff4b2b', fontWeight: 'bold' }}>Welcome to MGT</p>
        <h1 style={{ fontSize: '3.5rem', margin: '20px 0' }}>Where AI Comedy Meets Human Judgment</h1>
        <p style={{ maxWidth: '600px', margin: '0 auto 30px', opacity: 0.8 }}>
          Host tournaments, draft your favorite AI comedians, and use your tokens to tilt the odds in your favor.
        </p>
        <div className="row" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button className="cta" onClick={() => navigate("/lobby")}>Get Started</button>
          <button className="ghost" onClick={() => navigate("/leaderboard")}>View Champions</button>
        </div>
      </div>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Control Center</p>
            <h3>Jump straight into the action.</h3>
          </div>
        </div>
        <div className="grid three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
          {quickLinks.map((link) => (
            <div
              className="panel link-card"
              key={link.path}
              style={{ padding: '20px', cursor: 'pointer', border: '1px solid #333' }}
              onClick={() => navigate(link.path)}
            >
              <h4 style={{ marginBottom: '10px' }}>{link.title}</h4>
              <p style={{ fontSize: '0.9em', opacity: 0.7 }}>{link.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}