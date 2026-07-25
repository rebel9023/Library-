import { Request, Response } from 'express';
import { RAGService } from '../services/rag.service';

export class ChatController {
  public static async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId, userId } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message string is required' });
        return;
      }

      const session = sessionId || `session-${Date.now()}`;
      const user = userId || 'anonymous-user';

      const result = await RAGService.processQuery(user, session, message);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }

  public static async handleChatStream(req: Request, res: Response): Promise<void> {
    try {
      const { message, sessionId, userId } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message string is required' });
        return;
      }

      const session = sessionId || `session-${Date.now()}`;
      const user = userId || 'anonymous-user';

      // Set headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const result = await RAGService.processQuery(user, session, message);
      const tokens = result.response.split(' ');

      for (const token of tokens) {
        res.write(`data: ${JSON.stringify({ token: token + ' ' })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      res.write(`data: ${JSON.stringify({ sources: result.sources, intent: result.intent, isFallback: result.isFallback, done: true })}\n\n`);
      res.end();
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ error: err.message || 'Streaming failed' })}\n\n`);
      res.end();
    }
  }

  public static streamChat = ChatController.handleChatStream;

  public static async getHistory(req: Request, res: Response): Promise<void> {
    res.json({ history: [] });
  }
}
