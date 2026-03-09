import type { LeaderboardEntry } from '../types'

type LeaderboardSectionProps = {
  leaderboard: LeaderboardEntry[]
}

export default function LeaderboardSection({
  leaderboard,
}: LeaderboardSectionProps) {
  return (
    <section className="section" id="leaderboard">
      <div className="section-header">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h3>Who is running the comedy empire?</h3>
        </div>
        <button className="ghost" type="button">
          View Season Stats
        </button>
      </div>
      <div className="panel">
        <div className="leaderboard">
          <div className="leaderboard-row header">
            <span>Player</span>
            <span>Wins</span>
            <span>Tokens</span>
            <span>Best Streak</span>
          </div>
          {leaderboard.map((entry, index) => (
            <div className="leaderboard-row" key={entry.id}>
              <span>
                <strong>#{index + 1}</strong> {entry.name}
              </span>
              <span>{entry.wins}</span>
              <span>{entry.tokens}</span>
              <span>{entry.bestStreak}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
