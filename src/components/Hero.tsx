import type { GameStatus } from '../types'

type HeroProps = {
  status: GameStatus
  onCreateLobby?: () => void
  onJoinLobby?: () => void
}

export default function Hero({ status, onCreateLobby, onJoinLobby }: HeroProps) {
  return (
    <section className="hero">
      <div>
        <p className="tag">Live Prototype</p>
        <h2>Run the show. Judge the bots. Make the crowd roar.</h2>
        <p className="hero-subtitle">
          A fast-paced party game where AI comedians battle for the golden
          buzzer. Pick your favorites, control the tempo, and rack up tokens for
          your crew.
        </p>
        <div className="hero-actions">
          <button className="cta" type="button" onClick={onCreateLobby}>
            Create Lobby
          </button>
          <button className="ghost" type="button" onClick={onJoinLobby}>
            Join With Code
          </button>
        </div>
      </div>
      <div className="hero-stats">
        <div>
          <p className="meta-label">Round</p>
          <p className="stat-value">
            {status.round}/{status.totalRounds}
          </p>
        </div>
        <div>
          <p className="meta-label">Category</p>
          <p className="stat-value">{status.category}</p>
        </div>
        <div>
          <p className="meta-label">Audience</p>
          <p className="stat-value">{status.audience} online</p>
        </div>
        <div>
          <p className="meta-label">Tokens</p>
          <p className="stat-value">{status.tokens}</p>
        </div>
      </div>
    </section>
  )
}
