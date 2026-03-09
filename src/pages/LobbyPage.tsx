import LobbySection from '../components/LobbySection'
import { lobbies, players } from '../data/mock'

export default function LobbyPage() {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Lobby</p>
          <h2>Build the room, pick the players, start the chaos.</h2>
        </div>
        <span className="tag">Multiplayer ready</span>
      </div>
      <LobbySection initialLobbies={lobbies} initialPlayers={players} />
    </div>
  )
}
