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

  if (!lobbyCode) return <div className="page connection-state"><p>Lobby code is missing.</p></div>;
  if (wsStatus === "connecting") return <div className="page connection-state"><p>Connecting...</p></div>;
  if (wsStatus === "closed") return <div className="page connection-state"><p>Disconnected.</p></div>;

  const nextPickerID = gameState?.next_picker;
  const isMyTurn = nextPickerID === currentUser.id;
  const aiList = gameState?.ai_comedians || [];
  const myAIID = gameState?.players?.[currentUser.id]?.claimed_ai;

  if (showLoading) {
    return (
      <div className="page loading-page">
         <div className="panel round-transition">
            <h1 className="round-number">ROUND {gameState?.round}</h1>
            <p className="eyebrow">The Spotlight is moving...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-intro playboard-header">
        <div>
          <p className="eyebrow">Studio / {lobbyCode}</p>
          <h2 className="page-heading">
            {phase === "draft" ? "Select Your Agent" : phase === "round" ? "Stage Performance" : "Tournament Results"}
          </h2>
        </div>
        <div className="page-intro-actions">
           <span className="tag phase-tag">{phase}</span>
           {isMyTurn && phase === "draft" && <span className="tag turn-tag">Your Turn</span>}
        </div>
      </div>

      {phase === "draft" && (
        <section className="section draft-stage">
          <div className="grid three">
            {aiList.map((ai: any) => {
               const picks = gameState?.picks || {};
               const isPicked = Object.values(picks).includes(ai.id);
               const ownerID = Object.entries(picks).find(([, aid]) => aid === ai.id)?.[0];
               const isSelected = selectedId === ai.id;

               return (
                <article 
                  key={ai.id} 
                  className={`panel comedian draft-card ${isPicked ? "eliminated" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => !isPicked && setSelectedId(ai.id)}
                >
                  <div className="comedian-header">
                    <div className="avatar draft-avatar" style={{ background: ai.color || "var(--navy)" }}>
                      🤖
                      {isPicked && <span className="avatar-lock">🔒</span>}
                    </div>
                    <div>
                      <p className="card-title">{ai.name || "Agent"}</p>
                      <p className="card-sub">{ai.personality}</p>
                    </div>
                    <span className={`status-pill ${isPicked ? "in-game" : "live"}`}>
                      {isPicked ? "Claimed" : "Ready"}
                    </span>
                  </div>
                  <p className="bio draft-card-bio">
                    {ai.bio}
                  </p>
                  <div className="row draft-card-meta">
                    <span className="streak">Streak {ai.streak || 0}</span>
                    <span className={`pick-tag ${isSelected ? "active" : ""}`}>
                      {isPicked ? (ownerID === currentUser.id ? "Yours" : "Taken") : (isSelected ? "Selected" : "Tap to pick")}
                    </span>
                  </div>
                  <button
                    className="cta full-width draft-claim"
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
                 if (!ai) return <div className="performer-card spotlight performer-card--bye"><p className="vs">Bye</p></div>;
                 const isMyAI = ai.id === myAIID;
                 
                 return (
                   <div className={`performer-card round-performer ${isMyAI ? "hold mine" : ""}`}>
                     {isMyAI && <div className="tag performer-lock">Locked</div>}
                     <div className="performer-header">
                        <div className="avatar performer-avatar" style={{ background: ai.color }}>🤖</div>
                        <div>
                           <p className="card-title performer-name">{ai.name}</p>
                           <p className="card-sub performer-style">{ai.personality}</p>
                        </div>
                     </div>
                     <div className="joke-box">
                        <p className="joke">{jokes[ai.id] || <span className="joke-placeholder">Thinking of a punchline...</span>}</p>
                     </div>
                     <div className="row performer-actions">
                        <button
                           className="buzzer bad match-buzzer"
                           onClick={() => handleVote(ai.id, "buzzer")} 
                           disabled={isMyAI}>BUZZ</button>
                        <button
                           className="buzzer golden match-buzzer"
                           onClick={() => handleVote(ai.id, "golden_buzzer")} 
                           disabled={isMyAI}>GOLDEN</button>
                     </div>
                   </div>
                 );
               };

               return (
                 <div key={idx} className="panel round-match-card">
                    <div className="round-match">
                       {renderCompetitor(ai1)}
                       <div className="round-vs">VS</div>
                       {renderCompetitor(ai2)}
                    </div>
                 </div>
               );
            })}
          </div>
        </section>
      )}

      {phase === "finished" && (
        <section className="section winner-section">
          <div className="panel spotlight winner-panel">
             <div className="winner-icon">🏆</div>
             <p className="eyebrow winner-label">THE FINAL WINNER</p>
             <h2 className="winner-name">{aiList.find((a: any) => a.id === gameState?.winner_ai)?.name}</h2>
             <p className="card-sub winner-subtitle">{aiList.find((a: any) => a.id === gameState?.winner_ai)?.personality}</p>
             
             <div className="row winner-summary">
                <div>
                   <p className="eyebrow">Champion Owner</p>
                   <p className="meta-value winner-value">{gameState?.winner_player === currentUser.id ? "YOU" : (gameState?.winner_player || "N/A")}</p>
                </div>
                <div>
                   <p className="eyebrow">Payout</p>
                   <p className="meta-value winner-value winner-payout">+{gameState?.token_deltas?.[currentUser.id] || 0} Tokens</p>
                </div>
             </div>
          </div>
          <button className="cta winner-cta" onClick={() => navigate("/lobby")}>Return to Lobby</button>
        </section>
      )}
    </div>
  );
}
