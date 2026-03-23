import { useMemo, useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useNavigate } from "react-router-dom";

type LobbySectionProps = {
  initialLobbies: any[]
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
    () => lobbies.find((l) => l.code === selectedLobbyCode) ?? null,
    [lobbies, selectedLobbyCode]
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
      setActivity("Lobby created: " + response.code);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActivity("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = async (code: string) => {
    setLoading(true);
    setActivity("Joining lobby " + code + "...");
    try {
      await apiFetch<any>("/lobby/join", {
        method: "POST",
        body: JSON.stringify({ code: code, token_balance: 100 }),
      });
      setSelectedLobbyCode(code);
      setActivity("Joined lobby " + code);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setActivity("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRound = async () => {
    if (!selectedLobbyCode) return;
    setLoading(true);
    setActivity("Launching match...");
    try {
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

  const isHost = selectedLobby?.host_id === currentUser.id;

  return (
    <section className="section" id="lobby">
      <div className="section-header">
        <div>
          <p className="eyebrow">Lobby Control</p>
          <h3>Draft your lobby and set the rules.</h3>
        </div>
        <button className="ghost" onClick={onRefresh}>Refresh Lobbies</button>
      </div>

      <div className="grid two" style={{ marginTop: "30px", alignItems: "start" }}>
        {/* LOBBY CREATION */}
        <div className="panel">
          <h4>Host a New Room</h4>
          <div className="form" style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "1rem" }}>
             <label>Room Name
               <input value={draft.name} onChange={(e) => handleDraftChange("name", e.target.value)} />
             </label>
             <label>AI Count
               <select value={draft.numComedians} onChange={(e) => handleDraftChange("numComedians", e.target.value)}>
                 <option value={2}>2 AIs (Quick Match)</option>
                 <option value={4}>4 AIs (Classic)</option>
                 <option value={8}>8 AIs (Tournament)</option>
                 <option value={16}>16 AIs (Grand Finale)</option>
               </select>
             </label>
             <button className="cta" onClick={handleCreateLobby} disabled={loading} style={{ width: "100%", marginTop: "10px" }}>
               Generate Lobby
             </button>
          </div>
        </div>

        {/* LOBBY LIST & ACTIONS */}
        <div className="panel">
          <h4>Available Rooms</h4>
          <div className="lobby-list" style={{ marginTop: "20px", maxHeight: "400px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {lobbies.length === 0 && <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>No active rooms found.</p>}
            {lobbies.map((l) => (
              <div key={l.code} className={`lobby-card ${selectedLobbyCode === l.code ? "active" : ""}`} style={{ cursor: "pointer" }} onClick={() => setSelectedLobbyCode(l.code)}>
                <div>
                  <p className="card-title">{l.name} <span style={{ color: "#999", fontSize: "0.8em" }}>#{l.code}</span></p>
                  <p className="card-sub">{l.num_comedians} AIs • {l.player_count} Players</p>
                </div>
                {selectedLobbyCode !== l.code && <button className="ghost" onClick={(e) => { e.stopPropagation(); handleJoinLobby(l.code); }}>Join</button>}
                {selectedLobbyCode === l.code && <span className="status-pill live">In Lobby</span>}
              </div>
            ))}
          </div>

          {selectedLobbyCode && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--stroke)" }}>
               <p className="activity" style={{ marginBottom: "15px", fontWeight: "bold", textAlign: "center" }}>{activity}</p>
               {isHost ? (
                 <button className="cta" onClick={startRound} disabled={loading} style={{ width: "100%", background: "var(--navy)" }}>
                   Launch Showdown
                 </button>
               ) : (
                 <div style={{ textAlign: "center", padding: "10px", background: "var(--panel)", borderRadius: "10px" }}>
                    <p style={{ color: "var(--muted)", margin: 0 }}>Waiting for host to start...</p>
                 </div>
               )}
               <button className="ghost" onClick={() => navigate("/playboard?lobby=" + selectedLobbyCode)} style={{ width: "100%", marginTop: "10px" }}>
                 Go to Playboard
               </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}