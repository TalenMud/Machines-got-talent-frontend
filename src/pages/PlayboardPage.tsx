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

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  if (!lobbyCode) {
    return (
      <div className="page">
        <div className="panel">
          <h3>No Lobby Selected</h3>
          <p>Please go to the Lobby page and create or join a room first.</p>
          <button className="cta" onClick={() => navigate("/lobby")}>Go to Lobby</button>
        </div>
      </div>
    );
  }

  if (wsStatus === "connecting") return <div className="page">Connecting to game lobby "{lobbyCode}"...</div>;
  if (wsStatus === "closed") return <div className="page">Disconnected. Please try joining the lobby again.</div>;

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">Lobby: {lobbyCode}</p>
          <h2>{phase === "draft" ? "Draft Your AI" : phase === "round" ? "On Stage" : "Game Finished"}</h2>
        </div>
        <span className="tag">Phase: {phase}</span>
      </div>

      {phase === "draft" && (
        <div className="panel">
          <h3>AI Draft</h3>
          <p>Next to pick: {gameState?.next_picker || "Waiting..."}</p>
          <div className="grid three">
            {gameState?.ai_comedians?.map((ai: any) => {
               const isPicked = Object.values(gameState?.picks || {}).includes(ai.id);
               return (
                <div key={ai.id} className={"card " + (isPicked ? "disabled" : "")}>
                  <h4>{ai.personality}</h4>
                  <button
                    className="cta"
                    onClick={() => handleDraftPick(ai.id)}
                    disabled={isPicked || gameState?.next_picker !== currentUser.id}
                  >
                    {isPicked ? "Picked" : "Pick Agent"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === "round" && (
        <div className="panel">
          <h3>Round {gameState?.round}</h3>
          <div className="matchups">
            {gameState?.matchups?.map((m: any, idx: number) => {
               const ai1Obj = gameState?.ai_comedians?.[m.ai1] || { personality: m.ai1 };
               const ai2Obj = m.ai2 ? (gameState?.ai_comedians?.[m.ai2] || { personality: m.ai2 }) : null;

               return (
                 <div key={idx} className="matchup-card panel">
                    <div className="grid two">
                      <div className="performer-side">
                        <h4>{ai1Obj.personality}</h4>
                        <p className="joke-text">{jokes[m.ai1] || "Thinking of a joke..."}</p>
                        <div className="row">
                          <button className="ghost" onClick={() => handleVote(m.ai1, "buzzer")}>Buzzer (-1)</button>
                          <button className="cta" onClick={() => handleVote(m.ai1, "golden_buzzer")}>Golden (+2)</button>
                        </div>
                      </div>

                      {ai2Obj ? (
                        <div className="performer-side">
                          <h4>{ai2Obj.personality}</h4>
                          <p className="joke-text">{jokes[m.ai2] || "Thinking of a joke..."}</p>
                          <div className="row">
                            <button className="ghost" onClick={() => handleVote(m.ai2, "buzzer")}>Buzzer (-1)</button>
                            <button className="cta" onClick={() => handleVote(m.ai2, "golden_buzzer")}>Golden (+2)</button>
                          </div>
                        </div>
                      ) : (
                        <div className="performer-side">
                          <h4>BYE</h4>
                          <p>This agent advances automatically.</p>
                        </div>
                      )}
                    </div>
                 </div>
               );
            })}
          </div>
        </div>
      )}

      {phase === "finished" && (
        <div className="panel">
          <h3>Tournament Winner</h3>
          <div className="winner-highlight">
            <h2>{gameState?.winner_ai}</h2>
            <p>Congratulations! Tokens have been rewarded to all survivors.</p>
          </div>
        </div>
      )}
    </div>
  );
}