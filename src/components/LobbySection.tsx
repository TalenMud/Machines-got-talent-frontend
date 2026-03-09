import { useMemo, useState } from 'react'
import type { Lobby, Player } from '../types'

type LobbySectionProps = {
  initialLobbies: Lobby[]
  initialPlayers: Player[]
}

const regions = ['EU West', 'EU Central', 'US East', 'US West']

export default function LobbySection({
  initialLobbies,
  initialPlayers,
}: LobbySectionProps) {
  const [lobbies, setLobbies] = useState(() => initialLobbies)
  const [players, setPlayers] = useState(() => initialPlayers)
  const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null)
  const [activity, setActivity] = useState('')
  const [phase, setPhase] = useState<'idle' | 'betting' | 'live'>('idle')
  const [draft, setDraft] = useState({
    name: 'The Punchline Pit',
    region: regions[0],
    capacity: 6,
    password: '',
  })
  const [settings, setSettings] = useState({
    maxPlayers: 6,
    llms: 8,
    jokesPerRound: 3,
    timerSeconds: 45,
  })

  const selectedLobby = useMemo(
    () => lobbies.find((lobby) => lobby.id === selectedLobbyId) ?? null,
    [lobbies, selectedLobbyId],
  )

  const handleDraftChange = (key: keyof typeof draft, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: key === 'capacity' ? Number(value) : value,
    }))
  }

  const handleSettingsChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: Number(value),
    }))
  }

  const handleCreateLobby = () => {
    const id = `l${Math.floor(Math.random() * 900 + 100)}`
    setLobbies((prev) => [
      {
        id,
        name: draft.name || 'New Lobby',
        players: 1,
        capacity: Math.max(2, draft.capacity),
        region: draft.region,
        isPrivate: Boolean(draft.password),
        status: 'open',
      },
      ...prev,
    ])
    setSelectedLobbyId(id)
    setActivity(`Lobby "${draft.name}" created.`)
  }

  const handleJoinLobby = (id: string) => {
    setSelectedLobbyId(id)
    const lobby = lobbies.find((item) => item.id === id)
    if (lobby) {
      setActivity(`Joined ${lobby.name}. Waiting for host.`)
    }
  }

  const toggleReady = (id: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, ready: !player.ready } : player,
      ),
    )
  }

  const applySettings = () => {
    setActivity(
      `Lobby settings saved: ${settings.llms} LLMs, ${settings.jokesPerRound} jokes, ${settings.timerSeconds}s timer.`,
    )
  }

  const startBetting = () => {
    setPhase('betting')
    setActivity('Betting window opened for the next bracket.')
  }

  const startRound = () => {
    setPhase('live')
    setActivity('Round started. Performers are on stage.')
  }

  const endMatch = () => {
    setPhase('idle')
    setActivity('Match stopped. Lobby reset to idle state.')
  }

  return (
    <section className="section" id="lobby">
      <div className="section-header">
        <div>
          <p className="eyebrow">Lobby Control</p>
          <h3>Pick a room, prep your squad, and set the rules.</h3>
        </div>
        <button className="ghost" type="button">
          Refresh Lobbies
        </button>
      </div>
      <div className="grid two">
        <div className="panel">
          <h4>Create Lobby</h4>
          <div className="form-grid">
            <label>
              Lobby Name
              <input
                placeholder="The Punchline Pit"
                value={draft.name}
                onChange={(event) => handleDraftChange('name', event.target.value)}
              />
            </label>
            <label>
              Region
              <select
                value={draft.region}
                onChange={(event) =>
                  handleDraftChange('region', event.target.value)
                }
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Max Players
              <input
                type="number"
                min={2}
                max={8}
                value={draft.capacity}
                onChange={(event) =>
                  handleDraftChange('capacity', event.target.value)
                }
              />
            </label>
            <label>
              Password
              <input
                placeholder="Optional"
                value={draft.password}
                onChange={(event) =>
                  handleDraftChange('password', event.target.value)
                }
              />
            </label>
          </div>
          <div className="row">
            <button className="cta" type="button" onClick={handleCreateLobby}>
              Generate Lobby
            </button>
            <button className="ghost" type="button">
              Save Preset
            </button>
          </div>
        </div>
        <div className="panel">
          <h4>Active Lobbies</h4>
          <div className="list">
            {lobbies.map((lobby) => (
              <div
                className={`lobby-card${
                  lobby.id === selectedLobbyId ? ' active' : ''
                }`}
                key={lobby.id}
              >
                <div>
                  <p className="card-title">{lobby.name}</p>
                  <p className="card-sub">
                    {lobby.region} · {lobby.players}/{lobby.capacity} players
                    {lobby.isPrivate ? ' · Private' : ''}
                  </p>
                </div>
                <div className="status">
                  <span className={`status-pill ${lobby.status}`}>
                    {lobby.status}
                  </span>
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => handleJoinLobby(lobby.id)}
                  >
                    {lobby.id === selectedLobbyId ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid two">
        <div className="panel">
          <h4>Lobby Players</h4>
          <div className="list">
            {players.map((player) => (
              <div className="player-row" key={player.id}>
                <div>
                  <p className="card-title">
                    {player.name}
                    {player.isHost ? ' · Host' : ''}
                  </p>
                  <p className="card-sub">Latency {player.latencyMs}ms</p>
                </div>
                <button
                  className={`ready ${player.ready ? 'on' : 'off'}`}
                  type="button"
                  onClick={() => toggleReady(player.id)}
                >
                  {player.ready ? 'Ready' : 'Not ready'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h4>Lobby Settings</h4>
          <div className="settings-grid">
            <label>
              Max Players
              <input
                type="number"
                min={2}
                max={8}
                value={settings.maxPlayers}
                onChange={(event) =>
                  handleSettingsChange('maxPlayers', event.target.value)
                }
              />
            </label>
            <label>
              # LLMs
              <input
                type="number"
                min={2}
                max={16}
                value={settings.llms}
                onChange={(event) =>
                  handleSettingsChange('llms', event.target.value)
                }
              />
            </label>
            <label>
              # Jokes / Round
              <input
                type="number"
                min={1}
                max={5}
                value={settings.jokesPerRound}
                onChange={(event) =>
                  handleSettingsChange('jokesPerRound', event.target.value)
                }
              />
            </label>
            <label>
              Timer (sec)
              <input
                type="number"
                min={15}
                max={120}
                value={settings.timerSeconds}
                onChange={(event) =>
                  handleSettingsChange('timerSeconds', event.target.value)
                }
              />
            </label>
          </div>
          <div className="row">
            <button className="ghost" type="button" onClick={applySettings}>
              Apply Settings
            </button>
            <button className="ghost" type="button" onClick={startBetting}>
              Open Betting
            </button>
            <button className="cta" type="button" onClick={startRound}>
              Start Round
            </button>
            <button className="ghost" type="button" onClick={endMatch}>
              Stop Match
            </button>
          </div>
          <p className="footnote">
            {selectedLobby
              ? `Selected: ${selectedLobby.name}`
              : 'Select a lobby to unlock match controls.'}
          </p>
          <div className="match-state">
            <span className={`status-pill ${phase}`}>
              {phase === 'idle'
                ? 'idle'
                : phase === 'betting'
                  ? 'betting open'
                  : 'round live'}
            </span>
          </div>
          {activity ? <p className="activity">{activity}</p> : null}
        </div>
      </div>
    </section>
  )
}
