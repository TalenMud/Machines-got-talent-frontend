import { useEffect, useState } from "react";
import LobbySection from "../components/LobbySection";
import { apiFetch } from "../api/client";

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLobbies = async () => {
    try {
      const response = await apiFetch<any>("/lobby/list");
      // The API returns { lobbies: [...] }
      setLobbies(response.lobbies || []);
    } catch (err) {
      console.error("Failed to fetch lobbies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  if (loading) return (
    <div className="page" style={{ padding: "20px", textAlign: "center" }}>
      <p className="eyebrow">Production Control</p>
      <h2>Initializing Studio Lobbies...</h2>
    </div>
  );

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Lobby Management</p>
          <h2>Comedy Studio Control Room</h2>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <span className="tag" style={{ background: "var(--navy)", color: "#fff" }}>{lobbies.length} Active Rooms</span>
           <button className="ghost" onClick={fetchLobbies}>Refresh Feed</button>
        </div>
      </div>

      <LobbySection 
        initialLobbies={lobbies}
        onRefresh={fetchLobbies}
      />
    </div>
  );
}