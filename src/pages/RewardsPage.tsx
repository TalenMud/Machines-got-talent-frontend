import RewardsSection, { type Reward } from "../components/RewardsSection"
import { useState } from "react"

const initialRewards: Reward[] = [
  { id: "1", title: "First Pick", description: "Get the very first choice in the next AI draft.", cost: 50, owned: false },
  { id: "2", title: "Double Vote", description: "Your vote counts twice in a single round.", cost: 75, owned: false },
  { id: "3", title: "Golden Immunity", description: "Protect your AI from one Buzzer penalty.", cost: 100, owned: false },
  { id: "4", title: "Spy Glass", description: "See other players' picks before they are revealed.", cost: 30, owned: false },
  { id: "5", title: "Token Boost", description: "Earn 20% more tokens from your next win.", cost: 40, owned: false },
]

export default function RewardsPage() {
  const [tokens, setTokens] = useState(100);

  const onSpendTokens = (amount: number) => {
    setTokens(prev => prev - amount);
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Rewards</p>
          <h2>Cash in your wins for round advantages.</h2>
        </div>
      </div>
      <RewardsSection
        initialRewards={initialRewards}
        initialTokens={tokens}
        onSpendTokens={onSpendTokens}
      />
    </div>
  )
}