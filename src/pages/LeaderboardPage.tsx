import LeaderboardSection from "../components/LeaderboardSection"
import { useState } from "react"

const mockLeaderboard = [
  { id: "1", name: "StandUpMaster", wins: 42, tokens: 1540, streak: 8 },
  { id: "2", name: "JokeBot", wins: 38, tokens: 1200, streak: 5 },
  { id: "3", name: "ComedyKing", wins: 35, tokens: 1100, streak: 6 },
  { id: "4", name: "LaughterLover", wins: 29, tokens: 890, streak: 4 },
  { id: "5", name: "Punisher", wins: 22, tokens: 650, streak: 3 },
]

export default function LeaderboardPage() {
  const [data] = useState(mockLeaderboard);

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Champions</p>
          <h2>The Hall of Humor</h2>
        </div>
      </div>
      <LeaderboardSection leaderboard={data} />
    </div>
  )
}