import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { GameStatus } from '../types'

const navItems = [
  { label: 'Lobby', to: '/lobby' },
  { label: 'Playboard', to: '/playboard' },
  { label: 'Showdown', to: '/showdown' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Rewards', to: '/rewards' },
]

type AppHeaderProps = {
  status: GameStatus
}

export default function AppHeader({ status }: AppHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="app-header">
      <Link className="brand" to="/">
        <div className="logo-mark">MGT</div>
        <div>
          <p className="eyebrow">Machines got talent</p>
          <h1>Comedy Control Room</h1>
        </div>
      </Link>
      <nav className="app-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `nav-pill${isActive ? ' active' : ''}`
            }
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-meta">
        <div>
          <p className="meta-label">Room Code</p>
          <p className="meta-value">{status.roomCode}</p>
        </div>
        <div>
          <p className="meta-label">Host</p>
          <p className="meta-value">{status.host}</p>
        </div>
        <button className="cta" type="button" onClick={() => navigate('/playboard')}>
          Start Round
        </button>
      </div>
    </header>
  )
}
