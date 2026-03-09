import RewardsSection from '../components/RewardsSection'
import { rewards } from '../data/mock'

type RewardsPageProps = {
  tokens: number
  onSpendTokens: (amount: number) => void
}

export default function RewardsPage({ tokens, onSpendTokens }: RewardsPageProps) {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Rewards</p>
          <h2>Cash in your wins for round advantages.</h2>
        </div>
        <span className="tag">Storefront</span>
      </div>
      <RewardsSection
        initialRewards={rewards}
        initialTokens={tokens}
        onSpendTokens={onSpendTokens}
      />
    </div>
  )
}
