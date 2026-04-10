import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = 'ws://localhost:8000/ws';
const RECONNECT_DELAY = 3000;

export function useWebSocket(onMessage) {
  const [status, setStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const reconnectTimer = useRef(null);

  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'csv_changed' && onMessageRef.current) {
          onMessageRef.current(data.file);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    ws.onclose = () => {
      setStatus('disconnected');
      wsRef.current = null;
      reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return status;
}
