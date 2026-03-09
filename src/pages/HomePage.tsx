import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import type { GameStatus } from '../types'

type HomePageProps = {
  status: GameStatus
}

const quickLinks = [
  {
    title: 'Lobby Manager',
    detail: 'Create rooms, invite friends, and pick the hosts.',
    path: '/lobby',
  },
  {
    title: 'Playboard Live',
    detail: 'Trigger buzzers and shape the round in real time.',
    path: '/playboard',
  },
  {
    title: 'AI Showdown',
    detail: 'Vote on the funniest LLM and lock the crowd pick.',
    path: '/showdown',
  },
]

export default function HomePage({ status }: HomePageProps) {
  const navigate = useNavigate()

  return (
    <div className="page">
      <Hero
        status={status}
        onCreateLobby={() => navigate('/lobby')}
        onJoinLobby={() => navigate('/lobby')}
      />
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Control Center</p>
            <h3>Jump straight into the action.</h3>
          </div>
        </div>
        <div className="grid three">
          {quickLinks.map((link) => (
            <button
              className="panel link-card"
              key={link.path}
              type="button"
              onClick={() => navigate(link.path)}
            >
              <h4>{link.title}</h4>
              <p className="card-sub">{link.detail}</p>
              <span className="link-arrow">Open view →</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
