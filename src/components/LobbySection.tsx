import { useMemo, useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useNavigate } from "react-router-dom";

type LobbySectionProps = {
  initialLobbies: any[]
  initialPlayers: any[]
  onRefresh?: () => void
}

const regions = ["EU West", "EU Central", "US East", "US West"]

export default function LobbySection({
  initialLobbies,
  onRefresh,
}: LobbySectionProps) {
  const [lobbies, setLobbies] = useState(initialLobbies);
  const [selectedLobbyCode, setSelectedLobbyCode] = useState<string | null>(null);
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    setLobbies(initialLobbies);
  }, [initialLobbies]);

  const [draft, setDraft] = useState({
    name: "The Punchline Pit",
    region: regions[0],
    numComedians: 4,
    password: "",
  });

  const selectedLobby = useMemo(
    () => lobbies.find((lobby) => lobby.code === selectedLobbyCode) ?? null,
    [lobbies, selectedLobbyCode],
  );

  const handleDraftChange = (key: string, value: any) => {
    setDraft((prev: any) => ({
      ...prev,
      [key]: key === "numComedians" ? Number(value) : value,
    }));
  };

  const handleCreateLobby = async () => {
    setLoading(true);
    setActivity("Creating lobby...");
    try {
      const response = await apiFetch<any>("/lobby/create", {
        method: "POST",
        body: JSON.stringify({
          name: draft.name,
          num_comedians: draft.numComedians,
          password: draft.password,
        }),
      });
      setSelectedLobbyCode(response.code);
      setActivity("Lobby " + (response.name || "Room") + " created.");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActivity("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = async (code: string) => {
    setLoading(true);
    setActivity("Joining lobby...");
    try {
      const response = await apiFetch<any>("/lobby/join", {
        method: "POST",
        body: JSON.stringify({ code: code, token_balance: 100 }), // Mock token balance
      });
      setSelectedLobbyCode(response.code);
      setActivity("Joined lobby. Ready!");
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActivity("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const buyAdvantage = async () => {
    if (!selectedLobbyCode) return;
    try {
      setActivity("Buying First Pick advantage...");
      await apiFetch<any>("/game/use-advantage", {
        method: "POST",
        body: JSON.stringify({
          lobby_code: selectedLobbyCode,
          advantage: "first_pick",
          token_balance: 100 // Mock
        }),
      });
      setActivity("Advantage Secured! You will pick first.");
    } catch (err: any) {
      setActivity("Failed to buy: " + err.message);
    }
  };

  const startRound = async () => {
    if (!selectedLobbyCode) return;
    setLoading(true);
    try {
      setActivity("Starting game...");
      await apiFetch<any>("/game/start", {
        method: "POST",
        body: JSON.stringify({ lobby_code: selectedLobbyCode }),
      });
      navigate("/playboard?lobby=" + selectedLobbyCode);
    } catch (err: any) {
      setActivity("Error starting game: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="lobby">
      <div className="section-header">
        <div>
          <p className="eyebrow">Lobby Control</p>
          <h3>Draft your lobby and set the rules.</h3>
        </div>
        <button className="ghost" onClick={onRefresh}>Refresh</button>
      </div>

      <div className="grid two">
        <div className="panel">
          <h4>Create Lobby</h4>
          <div className="form-grid">
            <label>Name <input value={draft.name} onChange={e => handleDraftChange("name", e.target.value)} /></label>
            <label>Comedians <input type="number" value={draft.numComedians} onChange={e => handleDraftChange("numComedians", e.target.value)} /></label>
            <button className="cta" onClick={handleCreateLobby} disabled={loading}>Generate Lobby</button>
          </div>
        </div>

        <div className="panel">
          <h4>Active Lobbies</h4>
          <div className="lobby-list">
            {lobbies.map((l) => (
              <div key={l.code} className={"lobby-card " + (l.code === selectedLobbyCode ? "active" : "")}>
                <div>{l.name} ({l.player_count} players)</div>
                <button className="ghost" onClick={() => handleJoinLobby(l.code)}>Join</button>
              </div>
            ))}
          </div>
          
          {selectedLobbyCode && (
            <div className="actions" style={{ marginTop: "20px" }}>
              <button className="ghost" onClick={buyAdvantage} style={{ marginRight: "10px" }}>
                💎 Buy First Pick (50 Tokens)
              </button>
              {selectedLobby?.host_id === currentUser.id && (
                <button className="cta" onClick={startRound}>Start Match</button>
              )}
            </div>
          )}
          {activity && <p className="activity" style={{ marginTop: "10px", fontStyle: "italic" }}>{activity}</p>}
        </div>
      </div>
    </section>
  );
}