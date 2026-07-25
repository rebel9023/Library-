import axios from 'axios';
import { ChatMessage } from '../types';

const API_BASE = '/api';

export const sendChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  department?: string
): Promise<ChatMessage> => {
  const res = await axios.post(`${API_BASE}/chat`, {
    message,
    sessionId,
    userId,
    department
  });

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: res.data.response,
    sources: res.data.sources,
    intent: res.data.intent,
    toolUsed: res.data.toolUsed,
    timestamp: res.data.timestamp || new Date().toISOString(),
    isFallback: res.data.isFallback
  };
};

/**
 * Stream real-time human typing tokens via Server-Sent Events (SSE)
 */
export const streamChatMessage = async (
  message: string,
  sessionId: string,
  userId: string,
  onToken: (token: string) => void,
  onComplete: (sources: any[], metadata?: any) => void,
  department?: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, userId, department })
    });

    if (!response.body) {
      const fallbackMsg = await sendChatMessage(message, sessionId, userId, department);
      if (typeof onToken === 'function') onToken(fallbackMsg.text);
      if (typeof onComplete === 'function') {
        onComplete(fallbackMsg.sources || [], {
          intent: fallbackMsg.intent,
          toolUsed: fallbackMsg.toolUsed,
          isFallback: fallbackMsg.isFallback
        });
      }
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let sources: any[] = [];
    let metadata: any = {};

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.replace('data: ', '').trim());
            if (data.token && typeof onToken === 'function') {
              onToken(data.token);
            }
            if (data.done) {
              sources = data.sources || [];
              metadata = {
                intent: data.intent,
                agentName: data.agentName,
                agentRole: data.agentRole,
                responseTimeMs: data.responseTimeMs,
                isFallback: data.isFallback
              };
            }
          } catch (e) {
            // Ignore partial chunk JSON parse errors
          }
        }
      }
    }

    if (typeof onComplete === 'function') {
      onComplete(sources, metadata);
    }
  } catch (err) {
    const fallbackMsg = await sendChatMessage(message, sessionId, userId, department);
    if (typeof onToken === 'function') onToken(fallbackMsg.text);
    if (typeof onComplete === 'function') {
      onComplete(fallbackMsg.sources || [], {
        intent: fallbackMsg.intent,
        toolUsed: fallbackMsg.toolUsed,
        isFallback: fallbackMsg.isFallback
      });
    }
  }
};
