import { useState } from 'react'
import type { Comedian } from '../types'

type ShowdownSectionProps = {
  initialComedians: Comedian[]
}

export default function ShowdownSection({
  initialComedians,
}: ShowdownSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)

  const handleSelect = (id: string) => {
    if (locked) return
    setSelectedId(id)
  }

  return (
    <section className="section" id="showdown">
      <div className="section-header">
        <div>
          <p className="eyebrow">AI Showdown</p>
          <h3>Vote for the comedian that crushes the prompt.</h3>
        </div>
        <button className="ghost" type="button">
          Reveal Bios
        </button>
      </div>
      <div className="grid three">
        {initialComedians.map((comedian) => (
          <article
            className={`panel comedian ${comedian.status}${
              comedian.id === selectedId ? ' selected' : ''
            }${locked ? ' locked' : ''}`}
            key={comedian.id}
            onClick={() => handleSelect(comedian.id)}
          >
            <div className="comedian-header">
              <div className="avatar" style={{ background: comedian.color }}>
                {comedian.stageName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="card-title">{comedian.stageName}</p>
                <p className="card-sub">{comedian.style}</p>
              </div>
              <span className="status-pill">{comedian.status}</span>
            </div>
            <p className="bio">{comedian.bio}</p>
            <div className="row">
              <span className="streak">Streak {comedian.streak}</span>
              <span
                className={`pick-tag${
                  comedian.id === selectedId ? ' active' : ''
                }`}
              >
                {comedian.id === selectedId ? 'Selected' : 'Tap to pick'}
              </span>
            </div>
            <div className="row">
              <button
                className="ghost"
                type="button"
                onClick={(event) => event.stopPropagation()}
              >
                View Clip
              </button>
              <button
                className="cta"
                type="button"
                onClick={() => handleSelect(comedian.id)}
              >
                Vote
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className={`panel vote-panel${locked ? ' vote-locked' : ''}`}>
        <div>
          <p className="eyebrow">Vote Window</p>
          <h4>Audience picks are live for 18 seconds.</h4>
          <p className="card-sub">
            Select one comedian. Players who already picked a favorite can only
            vote on the remaining set.
          </p>
        </div>
        <div className="vote-actions">
          <button
            className="cta"
            type="button"
            onClick={() => selectedId && setLocked(true)}
            disabled={!selectedId || locked}
          >
            {locked ? 'Vote Locked' : 'Lock My Vote'}
          </button>
          <button
            className="ghost"
            type="button"
            onClick={() => {
              setLocked(false)
              setSelectedId(null)
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}
