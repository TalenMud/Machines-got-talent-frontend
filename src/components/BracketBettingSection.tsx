import { useMemo, useState } from 'react'
import type { BetSlip, BracketRound } from '../types'

type BracketBettingSectionProps = {
  rounds: BracketRound[]
  tokens: number
  currentBet: BetSlip | null
  onPlaceBet: (bet: BetSlip) => void
}

const betPresets = [10, 25, 50, 100]

export default function BracketBettingSection({
  rounds,
  tokens,
  currentBet,
  onPlaceBet,
}: BracketBettingSectionProps) {
  const firstMatch = rounds[0]?.matches[0]
  const [selectedMatchId, setSelectedMatchId] = useState(
    currentBet?.matchId ?? firstMatch?.id ?? '',
  )
  const [selectedCompetitorId, setSelectedCompetitorId] = useState(
    currentBet?.competitorId ?? '',
  )
  const [amount, setAmount] = useState(currentBet?.amount ?? betPresets[1])
  const [message, setMessage] = useState('')
  const betLocked = Boolean(currentBet)

  const selectedMatch = useMemo(() => {
    for (const round of rounds) {
      const match = round.matches.find((item) => item.id === selectedMatchId)
      if (match) return match
    }
    return null
  }, [rounds, selectedMatchId])

  const handlePlaceBet = () => {
    if (betLocked) {
      setMessage('Bet already locked for this bracket.')
      return
    }
    if (!selectedMatch || !selectedCompetitorId) {
      setMessage('Pick a match and a comedian before placing a bet.')
      return
    }
    if (amount <= 0) {
      setMessage('Bet amount must be greater than zero.')
      return
    }
    if (amount > tokens) {
      setMessage('Not enough tokens for that wager.')
      return
    }
    onPlaceBet({
      matchId: selectedMatch.id,
      competitorId: selectedCompetitorId,
      amount,
    })
    setMessage('Bet locked. Waiting for the stage round.')
  }

  return (
    <section className="section" id="betting">
      <div className="section-header">
        <div>
          <p className="eyebrow">Pre-Game Gamble</p>
          <h3>Pick the bracket winners before they hit the stage.</h3>
        </div>
        <div className="token-chip">{tokens} tokens</div>
      </div>
      <div className="grid two">
        <div className="panel">
          <div className="round-header">
            <div>
              <p className="meta-label">Bracket</p>
              <h4>Current Matchups</h4>
            </div>
            <span className="tag">Round {rounds[0]?.round ?? 1}</span>
          </div>
          <div className="bracket-grid">
            {rounds.map((round) => (
              <div className="bracket-round" key={round.round}>
                <p className="round-label">{round.label}</p>
                {round.matches.map((match) => {
                  const isSelected = match.id === selectedMatchId
                  return (
                    <div
                      className={`match-card ${match.status}${
                        isSelected ? ' active' : ''
                      }`}
                      key={match.id}
                    >
                      <button
                        className={`match-competitor${
                          selectedCompetitorId === match.left.id
                            ? ' active'
                            : ''
                        }`}
                        type="button"
                        onClick={() => {
                          setSelectedMatchId(match.id)
                          setSelectedCompetitorId(match.left.id)
                        }}
                      >
                        <span
                          className="match-color"
                          style={{ background: match.left.color }}
                        />
                        {match.left.stageName}
                      </button>
                      <span className="vs">vs</span>
                      <button
                        className={`match-competitor${
                          selectedCompetitorId === match.right.id
                            ? ' active'
                            : ''
                        }`}
                        type="button"
                        onClick={() => {
                          setSelectedMatchId(match.id)
                          setSelectedCompetitorId(match.right.id)
                        }}
                      >
                        <span
                          className="match-color"
                          style={{ background: match.right.color }}
                        />
                        {match.right.stageName}
                      </button>
                      <span className={`status-pill ${match.status}`}>
                        {match.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="panel bet-panel">
          <h4>Bet Slip</h4>
          <div className="bet-summary">
            <p className="card-sub">Match</p>
            <p className="card-title">
              {selectedMatch
                ? `${selectedMatch.left.stageName} vs ${selectedMatch.right.stageName}`
                : 'Select a match'}
            </p>
            <p className="card-sub">Picked comedian</p>
            <p className="card-title">
              {selectedMatch
                ? selectedMatch.left.id === selectedCompetitorId
                  ? selectedMatch.left.stageName
                  : selectedMatch.right.id === selectedCompetitorId
                    ? selectedMatch.right.stageName
                    : 'Select a comedian'
                : 'Select a comedian'}
            </p>
          </div>
          <div className="bet-amount">
            <p className="meta-label">Wager</p>
            <div className="chip-row">
              {betPresets.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`chip${amount === value ? ' active' : ''}`}
                  onClick={() => setAmount(value)}
                >
                  {value}
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={tokens}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
            </div>
            <p className="card-sub">
              Potential payout: {Math.round(amount * 1.8)} tokens
            </p>
          </div>
          <div className="row">
            <button
              className="cta"
              type="button"
              onClick={handlePlaceBet}
              disabled={betLocked}
            >
              Lock Bet
            </button>
            <button
              className="ghost"
              type="button"
              onClick={() => setMessage('Betting window refreshed.')}
            >
              Refresh Odds
            </button>
          </div>
          {message ? <p className="activity">{message}</p> : null}
        </div>
      </div>
    </section>
  )
}
