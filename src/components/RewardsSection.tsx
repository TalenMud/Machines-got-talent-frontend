import { useEffect, useState } from 'react'
import type { Reward } from '../types'

type RewardsSectionProps = {
  initialRewards: Reward[]
  initialTokens: number
  onSpendTokens?: (amount: number) => void
}

export default function RewardsSection({
  initialRewards,
  initialTokens,
  onSpendTokens,
}: RewardsSectionProps) {
  const [rewards, setRewards] = useState(() => initialRewards)
  const [tokens, setTokens] = useState(initialTokens)

  useEffect(() => {
    setTokens(initialTokens)
  }, [initialTokens])

  const handlePurchase = (reward: Reward) => {
    if (reward.owned || reward.cost > tokens) return
    setRewards((prev) =>
      prev.map((item) =>
        item.id === reward.id ? { ...item, owned: true } : item,
      ),
    )
    setTokens((prev) => prev - reward.cost)
    onSpendTokens?.(reward.cost)
  }

  return (
    <section className="section" id="rewards">
      <div className="section-header">
        <div>
          <p className="eyebrow">Rewards</p>
          <h3>Spend tokens to tilt the odds.</h3>
        </div>
        <div className="token-chip">{tokens} tokens</div>
      </div>
      <div className="grid three">
        {rewards.map((reward) => {
          const isOwned = reward.owned
          const disabled = reward.cost > tokens && !isOwned
          return (
            <div
              className={`panel reward${isOwned ? ' owned' : ''}${
                disabled ? ' disabled' : ''
              }`}
              key={reward.id}
            >
              <h4>{reward.title}</h4>
              <p className="card-sub">{reward.description}</p>
              <div className="row">
                <span className="price">{reward.cost} tokens</span>
                <button
                  className={isOwned ? 'ghost' : 'cta'}
                  type="button"
                  disabled={disabled || isOwned}
                  onClick={() => handlePurchase(reward)}
                >
                  {isOwned ? 'Owned' : disabled ? 'Not enough' : 'Buy'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
