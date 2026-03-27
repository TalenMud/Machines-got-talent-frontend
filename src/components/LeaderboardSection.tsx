type LeaderboardEntry = {
  id: string;
  name: string;
  wins: number;
  tokens: number;
  streak: number;
}

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
      </div>
      <div className="panel leaderboard-panel">
        <div className="leaderboard">
          <div className="leaderboard-row header">
            <span>Rank & Player</span>
            <span>Wins</span>
            <span>Tokens</span>
            <span>Best Streak</span>
          </div>
          {leaderboard.map((entry, index) => (
            <div className={`leaderboard-row${index < 3 ? " podium" : ""}`} key={entry.id}>
              <span className="leaderboard-player">
                <strong>#{index + 1}</strong> {entry.name}
              </span>
              <span>{entry.wins}</span>
              <span>{entry.tokens}</span>
              <span>{entry.streak}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
