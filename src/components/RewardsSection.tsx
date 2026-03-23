import { useState } from "react";

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  owned: boolean;
}

interface RewardsSectionProps {
  initialRewards: Reward[];
  initialTokens: number;
  onSpendTokens?: (amount: number) => void;
}

export default function RewardsSection({
  initialRewards,
  initialTokens,
  onSpendTokens,
}: RewardsSectionProps) {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [tokens, setTokens] = useState(initialTokens);

  const handlePurchase = (reward: Reward) => {
    if (reward.owned || reward.cost > tokens) return;
    setRewards((prev) =>
      prev.map((item) =>
        item.id === reward.id ? { ...item, owned: true } : item
      )
    );
    setTokens((prev) => prev - reward.cost);
    onSpendTokens?.(reward.cost);
  };

  return (
    <section className="section" id="rewards">
      <div className="section-header">
        <div>
          <p className="eyebrow">Rewards</p>
          <h3>Spend tokens to tilt the odds.</h3>
        </div>
        <div className="token-chip" style={{ background: "#333", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold" }}>
          {tokens} tokens
        </div>
      </div>
      <div className="grid three" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "30px" }}>
        {rewards.map((reward) => {
          const isOwned = reward.owned;
          const canAfford = tokens >= reward.cost;
          return (
            <div
              className={`panel reward ${isOwned ? "owned" : ""} ${!canAfford && !isOwned ? "disabled" : ""}`}
              key={reward.id}
              style={{ padding: "20px", border: "1px solid #333", borderRadius: "8px", opacity: !canAfford && !isOwned ? 0.5 : 1 }}
            >
              <h4 style={{ marginBottom: "10px" }}>{reward.title}</h4>
              <p className="card-sub" style={{ fontSize: "0.9em", color: "#999", marginBottom: "15px" }}>{reward.description}</p>
              <div className="row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="price" style={{ fontWeight: "bold" }}>{reward.cost} tokens</span>
                <button
                  className={isOwned ? "ghost" : "cta"}
                  type="button"
                  disabled={isOwned || !canAfford}
                  onClick={() => handlePurchase(reward)}
                >
                  {isOwned ? "Purchased" : "Buy Now"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
