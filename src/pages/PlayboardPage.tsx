import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGameWebSocket } from "../hooks/useGameWebSocket";

export default function PlayboardPage() {
  const [searchParams] = useSearchParams();
  const lobbyCode = searchParams.get("lobby") || "";
  const navigate = useNavigate();
  const { messages, status: wsStatus, sendMessage } = useGameWebSocket(lobbyCode);

  const [gameState, setGameState] = useState<any>(null);
  const [phase, setPhase] = useState<"draft" | "round" | "finished">("draft");
  const [jokes, setJokes] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];

    switch (lastMessage.event) {
      case "game:start":
      case "game:draft_update":
        setPhase("draft");
        setGameState((prev: any) => ({ ...prev, ...lastMessage.data }));
        break;
      case "game:round_start":
        setShowLoading(true);
        setTimeout(() => setShowLoading(false), 2000); // Transition effect
        setPhase("round");
        setJokes({});
        setGameState((prev: any) => ({ ...prev, ...lastMessage.data }));
        break;
      case "game:joke":
        setJokes(prev => ({
          ...prev,
          [lastMessage.data.ai_id]: lastMessage.data.joke
        }));
        break;
      case "game:round_result":
        setGameState((prev: any) => ({ ...prev, ...lastMessage.data }));
        break;
      case "game:end":
        setPhase("finished");
        setGameState((prev: any) => ({ ...prev, ...lastMessage.data }));
        break;
    }
  }, [messages]);

  const handleDraftPick = (aiId: string) => {
    sendMessage("game:draft_pick", { ai_id: aiId });
  };

  const handleVote = (aiId: string, type: "buzzer" | "golden_buzzer") => {
    sendMessage("game:vote", { ai_id: aiId, vote_type: type });
  };

  if (!lobbyCode) return <div className="page"><p>Lobby code is missing.</p></div>;
  if (wsStatus === "connecting") return <div className="page"><p>Connecting...</p></div>;
  if (wsStatus === "closed") return <div className="page"><p>Disconnected.</p></div>;

  const nextPickerID = gameState?.next_picker;
  const isMyTurn = nextPickerID === currentUser.id;
  const aiList = gameState?.ai_comedians || [];
  const myAIID = gameState?.players?.[currentUser.id]?.claimed_ai;

  if (showLoading) {
    return (
      <div className="page" style={{ 
        height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" 
      }}>
         <div className="panel" style={{ padding: "4rem", background: "var(--navy)", color: "#fff" }}>
            <h1 style={{ fontSize: "4rem" }}>ROUND {gameState?.round}</h1>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>The Spotlight is moving...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Studio / {lobbyCode}</p>
          <h2 style={{ margin: 0 }}>
            {phase === "draft" ? "Select Your Agent" : phase === "round" ? "Stage Performance" : "Tournament Results"}
          </h2>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
           <span className="tag" style={{ background: "var(--navy)", color: "#fff" }}>{phase}</span>
           {isMyTurn && phase === "draft" && <span className="tag" style={{ background: "var(--orange)", color: "#fff" }}>Your Turn</span>}
        </div>
      </div>

      {phase === "draft" && (
        <section className="section">
          <div className="grid three">
            {aiList.map((ai: any) => {
               const picks = gameState?.picks || {};
               const isPicked = Object.values(picks).includes(ai.id);
               const ownerID = Object.entries(picks).find(([uid, aid]) => aid === ai.id)?.[0];
               const isSelected = selectedId === ai.id;

               return (
                <article 
                  key={ai.id} 
                  className={`panel comedian ${isPicked ? "eliminated" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => !isPicked && setSelectedId(ai.id)}
                  style={{ 
                    cursor: isPicked ? "default" : "pointer",
                    background: isPicked ? "var(--panel)" : (isSelected ? "#fff" : "var(--panel)")
                  }}
                >
                  <div className="comedian-header">
                    <div className="avatar" style={{ background: ai.color || "var(--navy)", position: "relative" }}>
                      🤖
                      {isPicked && <span style={{ position: "absolute", bottom: "-4px", right: "-4px", fontSize: "1rem" }}>🔒</span>}
                    </div>
                    <div>
                      <p className="card-title">{ai.name || "Agent"}</p>
                      <p className="card-sub">{ai.personality}</p>
                    </div>
                    <span className={`status-pill ${isPicked ? "in-game" : "live"}`}>
                      {isPicked ? "Claimed" : "Ready"}
                    </span>
                  </div>
                  <p className="bio" style={{ fontSize: "0.85rem", height: "3.2rem", overflow: "hidden", borderTop: "1px solid var(--stroke)", paddingTop: "1rem" }}>
                    {ai.bio}
                  </p>
                  <div className="row" style={{ marginTop: "1rem" }}>
                    <span className="streak">Streak {ai.streak || 0}</span>
                    <span className={`pick-tag ${isSelected ? "active" : ""}`}>
                      {isPicked ? (ownerID === currentUser.id ? "Yours" : "Taken") : (isSelected ? "Selected" : "Tap to pick")}
                    </span>
                  </div>
                  <button className="cta" 
                    style={{ width: "100%", padding: "0.6rem", marginTop: "1.2rem" }}
                    disabled={!isMyTurn || isPicked || !isSelected}
                    onClick={(e) => { e.stopPropagation(); handleDraftPick(ai.id); }}
                  >
                    {isPicked ? "Claimed" : "Claim Agent"}
                  </button>
                </article>
               );
            })}
          </div>
        </section>
      )}

      {phase === "round" && (
        <section className="section">
          <div className="grid two">
            {gameState?.matchups?.map((m: any, idx: number) => {
               const ai1 = aiList.find((a: any) => a.id === m.ai1);
               const ai2 = aiList.find((a: any) => a.id === m.ai2);
               
               const renderCompetitor = (ai: any) => {
                 if (!ai) return <div className="performer-card spotlight" style={{ opacity: 0.5 }}><p className="vs">Bye</p></div>;
                 const isMyAI = ai.id === myAIID;
                 
                 return (
                   <div className={`performer-card ${isMyAI ? "hold" : ""}`} style={{ 
                      flex: 1, 
                      position: "relative",
                      background: isMyAI ? "rgba(31, 42, 68, 0.05)" : "#fff",
                      border: isMyAI ? "2px dashed var(--navy)" : "1px solid var(--stroke)"
                    }}>
                     {isMyAI && <div className="tag" style={{ position: "absolute", top: "-12px", right: "10px", background: "var(--navy)", color: "#fff", border: "none" }}>Locked</div>}
                     <div className="performer-header">
                        <div className="avatar" style={{ background: ai.color, width: "36px", height: "36px", fontSize: "0.9rem" }}>🤖</div>
                        <div>
                           <p className="card-title" style={{ fontSize: "0.9rem" }}>{ai.name}</p>
                           <p className="card-sub" style={{ fontSize: "0.75rem" }}>{ai.personality}</p>
                        </div>
                     </div>
                     <div style={{ height: "110px", margin: "10px 0", background: "#f8f9fa", borderRadius: "12px", border: "1px solid var(--stroke)", padding: "1rem", overflowY: "auto" }}>
                        <p className="joke" style={{ fontSize: "0.85rem", margin: 0 }}>{jokes[ai.id] || <span style={{ color: "#aaa" }}>Thinking of a punchline...</span>}</p>
                     </div>
                     <div className="row" style={{ gap: "0.6rem" }}>
                        <button className="buzzer bad" 
                           style={{ flex: 1, padding: "0.8rem", fontWeight: "bold", fontSize: "0.8rem", opacity: isMyAI ? 0.3 : 1 }} 
                           onClick={() => handleVote(ai.id, "buzzer")} 
                           disabled={isMyAI}>BUZZ</button>
                        <button className="buzzer golden" 
                           style={{ flex: 1, padding: "0.8rem", fontWeight: "bold", fontSize: "0.8rem", opacity: isMyAI ? 0.3 : 1 }} 
                           onClick={() => handleVote(ai.id, "golden_buzzer")} 
                           disabled={isMyAI}>GOLDEN</button>
                     </div>
                   </div>
                 );
               };

               return (
                 <div key={idx} className="panel" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                       {renderCompetitor(ai1)}
                       <div style={{ fontWeight: "bold", color: "var(--muted)" }}>VS</div>
                       {renderCompetitor(ai2)}
                    </div>
                 </div>
               );
            })}
          </div>
        </section>
      )}

      {phase === "finished" && (
        <section className="section" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="panel spotlight" style={{ 
            padding: "5rem", 
            maxWidth: "700px", 
            background: "linear-gradient(135deg, #fff 0%, #fff8ee 100%)",
            border: "4px solid var(--gold)",
            boxShadow: "0 0 100px rgba(244, 183, 64, 0.4)"
          }}>
             <div style={{ fontSize: "5rem", marginBottom: "2rem", animation: "pulse 1s infinite" }}>🏆</div>
             <p className="eyebrow" style={{ color: "var(--gold)", fontWeight: "bold" }}>THE FINAL WINNER</p>
             <h2 style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>{aiList.find((a: any) => a.id === gameState?.winner_ai)?.name}</h2>
             <p className="card-sub" style={{ fontSize: "1.5rem" }}>{aiList.find((a: any) => a.id === gameState?.winner_ai)?.personality}</p>
             
             <div className="row" style={{ justifyContent: "center", marginTop: "4rem", gap: "4rem", borderTop: "1px solid var(--stroke)", paddingTop: "3rem" }}>
                <div>
                   <p className="eyebrow">Champion Owner</p>
                   <p className="meta-value" style={{ fontSize: "1.2rem" }}>{gameState?.winner_player === currentUser.id ? "YOU" : (gameState?.winner_player || "N/A")}</p>
                </div>
                <div>
                   <p className="eyebrow">Payout</p>
                   <p className="meta-value" style={{ color: "var(--teal)", fontSize: "1.2rem" }}>+{gameState?.token_deltas?.[currentUser.id] || 0} Tokens</p>
                </div>
             </div>
          </div>
          <button className="cta" style={{ marginTop: "3rem", padding: "1rem 3rem", fontSize: "1.1rem" }} onClick={() => navigate("/lobby")}>Return to Lobby</button>
        </section>
      )}
    </div>
  );
}