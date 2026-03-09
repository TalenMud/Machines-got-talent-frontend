import { useMemo, useState } from 'react'
import type { BetSlip, StageMatch } from '../types'

type StageRoundSectionProps = {
  match: StageMatch
  bet: BetSlip | null
  onResolveMatch: (winnerId: string) => void
}

type BuzzerAction = 'golden' | 'normal' | 'bad' | 'hold'

const buzzerLabels: Record<BuzzerAction, string> = {
  golden: 'Golden Buzzer +2',
  normal: 'Buzzer +1',
  bad: 'Bad Joke -1',
  hold: 'Hold (No Buzz)',
}

const buzzerScores: Record<BuzzerAction, number> = {
  golden: 2,
  normal: 1,
  bad: -1,
  hold: 0,
}

export default function StageRoundSection({
  match,
  bet,
  onResolveMatch,
}: StageRoundSectionProps) {
  const [performers, setPerformers] = useState(() => match.performers)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lastAction, setLastAction] = useState<BuzzerAction | null>(null)
  const [actions, setActions] = useState<string[]>([])
  const [winnerId, setWinnerId] = useState<string | null>(null)

  const activePerformer = performers[activeIndex]

  const handleBuzzer = (action: BuzzerAction) => {
    setLastAction(action)
    if (action !== 'hold') {
      setPerformers((prev) =>
        prev.map((performer, index) =>
          index === activeIndex
            ? {
                ...performer,
                score: Math.max(0, performer.score + buzzerScores[action]),
              }
            : performer,
        ),
      )
    }

    setActions((prev) => [
      `${buzzerLabels[action]} for ${activePerformer.stageName}.`,
      ...prev,
    ])
  }

  const handleNextAct = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : 0))
  }

  const handleResolve = (id: string) => {
    setWinnerId(id)
    onResolveMatch(id)
  }

  const winnerName = useMemo(
    () => performers.find((performer) => performer.id === winnerId)?.stageName,
    [performers, winnerId],
  )

  const betStatus = useMemo(() => {
    if (!bet) return 'No bet placed.'
    const picked = performers.find((performer) => performer.id === bet.competitorId)
    return picked
      ? `You backed ${picked.stageName} with ${bet.amount} tokens.`
      : 'Bet tied to another match.'
  }, [bet, performers])

  return (
    <section className="section" id="stage">
      <div className="section-header">
        <div>
          <p className="eyebrow">On Stage</p>
          <h3>Two comedians. One bracket spot. Buzz or let it ride.</h3>
        </div>
        <div className="timer">
          <span>Round</span>
          <strong>{match.label}</strong>
        </div>
      </div>
      <div className="grid two">
        <div className="panel spotlight">
          <div className="spotlight-header">
            <div>
              <p className="meta-label">Prompt</p>
              <p className="spotlight-title">{match.prompt}</p>
            </div>
            <div className="badge">Match {match.round}</div>
          </div>
          <div className="stage-grid">
            {performers.map((performer, index) => (
              <div
                className={`performer-card${
                  index === activeIndex ? ' active' : ''
                }${winnerId === performer.id ? ' winner' : ''}`}
                key={performer.id}
              >
                <div className="performer-header">
                  <div
                    className="avatar"
                    style={{ background: performer.color }}
                  >
                    {performer.stageName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="card-title">{performer.stageName}</p>
                    <p className="card-sub">Score {performer.score}</p>
                  </div>
                  {index === activeIndex ? (
                    <span className="status-pill live">On Stage</span>
                  ) : null}
                </div>
                <p className="joke">"{performer.joke}"</p>
              </div>
            ))}
          </div>
          <div className="buzzer-grid">
            {(['golden', 'normal', 'bad'] as const).map((action) => (
              <button
                key={action}
                className={`buzzer ${action}${
                  lastAction === action ? ' active' : ''
                }`}
                type="button"
                onClick={() => handleBuzzer(action)}
              >
                {buzzerLabels[action]}
              </button>
            ))}
            <button
              className={`buzzer hold${lastAction === 'hold' ? ' active' : ''}`}
              type="button"
              onClick={() => handleBuzzer('hold')}
            >
              {buzzerLabels.hold}
            </button>
          </div>
          <div className="row">
            <button className="ghost" type="button" onClick={handleNextAct}>
              Next Act
            </button>
            <div className="stage-note">{betStatus}</div>
          </div>
        </div>
        <div className="panel">
          <h4>Action Feed</h4>
          <div className="action-feed">
            <p className="meta-label">Live calls</p>
            <ul>
              {(actions.length ? actions : ['Round just started...']).map(
                (action, index) => (
                  <li key={`${action}-${index}`}>{action}</li>
                ),
              )}
            </ul>
          </div>
          <div className="resolve-panel">
            <p className="meta-label">Resolve Match</p>
            <div className="row">
              {performers.map((performer) => (
                <button
                  key={performer.id}
                  className="ghost"
                  type="button"
                  onClick={() => handleResolve(performer.id)}
                >
                  Declare {performer.stageName}
                </button>
              ))}
            </div>
            {winnerId ? (
              <p className="activity">Winner locked: {winnerName ?? winnerId}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
