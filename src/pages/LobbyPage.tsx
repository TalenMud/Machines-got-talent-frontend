import { useEffect, useState } from "react";
import LobbySection from "../components/LobbySection";
import { apiFetch } from "../api/client";

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLobbies = async () => {
    try {
      const response = await apiFetch<any>("/lobby/list");
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

  if (loading) return <div className="page">Loading lobbies...</div>;

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Lobby</p>
          <h2>Build the room, pick the players, start the chaos.</h2>
        </div>
      </div>
      <LobbySection 
        initialLobbies={lobbies} 
        initialPlayers={[]} 
        onRefresh={fetchLobbies} 
      />
    </div>
  );
}