import { redis } from '../config/redis';
import { pool } from '../config/database';

export interface UserMemory {
  userId: string;
  department?: string;
  degree?: string;
  interests?: string[];
  preferredCategory?: string;
}

export class MemoryService {
  /**
   * Save message pair to short-term session history in Redis.
   */
  public static async saveSessionMessage(sessionId: string, userMsg: string, aiResponse: string): Promise<void> {
    try {
      const key = `session:${sessionId}:history`;
      const historyItem = JSON.stringify({ user: userMsg, ai: aiResponse, timestamp: new Date().toISOString() });
      await redis.rpush(key, historyItem);
      await redis.expire(key, 86400 * 7); // 7 days retention
    } catch (err) {
      console.warn('Memory service Redis warning:', (err as Error).message);
    }
  }

  /**
   * Fetch recent session history for context hydration.
   */
  public static async getSessionHistory(sessionId: string, limit: number = 5): Promise<Array<{ user: string; ai: string }>> {
    try {
      const key = `session:${sessionId}:history`;
      const raw = await redis.lrange(key, -limit, -1);
      return raw.map(item => JSON.parse(item));
    } catch (err) {
      return [];
    }
  }

  /**
   * Updates long-term user memory (e.g. "I am a B.Tech student").
   */
  public static async updateUserMemory(userId: string, key: string, value: any): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO user_memory (user_id, memory_key, memory_value, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, memory_key)
         DO UPDATE SET memory_value = EXCLUDED.memory_value, updated_at = NOW()`,
        [userId, key, JSON.stringify(value)]
      );
    } catch (err) {
      console.warn('Failed to update long-term user memory:', (err as Error).message);
    }
  }

  /**
   * Fetch long-term memory for a user.
   */
  public static async getUserMemory(userId: string): Promise<Record<string, any>> {
    try {
      const res = await pool.query(`SELECT memory_key, memory_value FROM user_memory WHERE user_id = $1`, [userId]);
      const memoryMap: Record<string, any> = {};
      res.rows.forEach(row => {
        memoryMap[row.memory_key] = row.memory_value;
      });
      return memoryMap;
    } catch (err) {
      return {};
    }
  }
}
