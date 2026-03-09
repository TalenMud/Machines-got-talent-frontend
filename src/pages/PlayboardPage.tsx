import { useState } from 'react'
import BracketBettingSection from '../components/BracketBettingSection'
import StageRoundSection from '../components/StageRoundSection'
import { bracketRounds, stageMatch } from '../data/mock'
import type { BetSlip, GameStatus } from '../types'

type PlayboardPageProps = {
  status: GameStatus
  onTokenDelta: (delta: number) => void
}

export default function PlayboardPage({ status, onTokenDelta }: PlayboardPageProps) {
  const [phase, setPhase] = useState<'betting' | 'stage' | 'payout'>('betting')
  const [bet, setBet] = useState<BetSlip | null>(null)
  const [payout, setPayout] = useState<number | null>(null)

  const handlePlaceBet = (newBet: BetSlip) => {
    setBet(newBet)
    onTokenDelta(-newBet.amount)
    setPayout(null)
    setPhase('stage')
  }

  const handleResolveMatch = (winnerId: string) => {
    if (!bet) return
    const won = bet.competitorId === winnerId
    const winnings = won ? Math.round(bet.amount * 1.8) : 0
    if (winnings > 0) {
      onTokenDelta(winnings)
    }
    setPayout(winnings)
    setPhase('payout')
  }

  const resetRound = () => {
    setBet(null)
    setPayout(null)
    setPhase('betting')
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Playboard</p>
          <h2>Bracket bets, stage battles, and buzzer chaos.</h2>
        </div>
        <span className="tag">Round {status.round}</span>
      </div>
      <div className="phase-tabs">
        <button
          className={`phase-tab${phase === 'betting' ? ' active' : ''}`}
          type="button"
          onClick={() => setPhase('betting')}
        >
          1. Betting
        </button>
        <button
          className={`phase-tab${phase === 'stage' ? ' active' : ''}`}
          type="button"
          onClick={() => setPhase('stage')}
          disabled={!bet}
        >
          2. On Stage
        </button>
        <button
          className={`phase-tab${phase === 'payout' ? ' active' : ''}`}
          type="button"
          onClick={() => setPhase('payout')}
          disabled={!bet}
        >
          3. Payout
        </button>
      </div>

      {phase === 'betting' ? (
        <BracketBettingSection
          rounds={bracketRounds}
          tokens={status.tokens}
          currentBet={bet}
          onPlaceBet={handlePlaceBet}
        />
      ) : null}

      {phase === 'stage' ? (
        <StageRoundSection match={stageMatch} bet={bet} onResolveMatch={handleResolveMatch} />
      ) : null}

      {phase === 'payout' ? (
        <section className="section">
          <div className="panel payout-panel">
            <p className="eyebrow">Bracket Result</p>
            <h3>
              {bet
                ? payout && payout > 0
                  ? `You won ${payout} tokens.`
                  : 'Your pick got eliminated. No payout this round.'
                : 'Place a bet to earn bracket payouts.'}
            </h3>
            <p className="card-sub">
              Winners advance to the next bracket. Place a fresh bet before the
              next head-to-head.
            </p>
            <div className="row">
              <button className="cta" type="button" onClick={resetRound}>
                Next Bracket
              </button>
              <button
                className="ghost"
                type="button"
                onClick={resetRound}
              >
                Adjust Bet
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
