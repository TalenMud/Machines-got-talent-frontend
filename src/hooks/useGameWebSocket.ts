import { useEffect, useRef, useState, useCallback } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export function useGameWebSocket(lobbyCode: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("user") ? localStorage.getItem("token") : null;
    if (!token || !lobbyCode) return;

    const url = `${WS_URL}/${lobbyCode}?token=${token}`;
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      setStatus("open");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    socket.onclose = () => {
      setStatus("closed");
    };

    socket.onerror = (e) => {
      console.error("WS error", e);
      setStatus("closed");
    };

    return () => {
      socket.close();
    };
  }, [lobbyCode]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ event, data }));
    }
  }, []);

  return { messages, status, sendMessage };
}