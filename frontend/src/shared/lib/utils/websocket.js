const WS_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';
import { getToken } from './cookies';

export const createWebSocket = (conversationId, onMessage, onReconnect) => {
  const token = getToken();
  if (!token) {
    console.error('No token available for WebSocket connection');
    return null;
  }

  const wsProtocol = WS_URL.startsWith('https') ? 'wss' : 'ws';
  const wsHost = WS_URL.replace(/^https?:\/\//, '');
  // WebSocket URL format: ws://{host}/api/chat/ws/conversations/{conversationId}/?Authorization={token}
  // Note: Requirements mention "conversations/conversations" but we use the conversation ID here
  const wsUrl = `${wsProtocol}://${wsHost}/api/chat/ws/conversations/${conversationId}/?Authorization=${token}`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = (event) => {
    console.log('WebSocket disconnected', event.code, event.reason);
    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000 && onReconnect) {
      setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        onReconnect();
      }, 3000);
    }
  };

  return ws;
};

export const sendWebSocketMessage = (ws, text) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'message:new',
      payload: {
        text,
      },
    }));
  } else {
    console.error('WebSocket is not open');
  }
};

