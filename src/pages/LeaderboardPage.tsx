import LeaderboardSection from '../components/LeaderboardSection'
import { leaderboard } from '../data/mock'

export default function LeaderboardPage() {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h2>Track the MVPs and token kings.</h2>
        </div>
        <span className="tag">Season 1</span>
      </div>
      <LeaderboardSection leaderboard={leaderboard} />
    </div>
  )
}
