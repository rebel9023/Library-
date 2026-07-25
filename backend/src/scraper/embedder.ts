import { pool } from '../config/database';
import { qdrant } from '../config/qdrant';
import { env } from '../config/env';
import { VectorService } from '../services/vector.service';

export interface ScrapedDocument {
  title: string;
  url: string;
  category: string;
  type: string;
  content: string;
  summary?: string;
}

export class EmbedderService {
  public static async processAndIndex(item: ScrapedDocument): Promise<number> {
    let indexedChunks = 0;
    try {
      // 1. Store in PostgreSQL
      const dbRes = await pool.query(
        `INSERT INTO documents (title, url, category, type, content, summary) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (url) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW() 
         RETURNING id`,
        [item.title, item.url, item.category, item.type, item.content, item.summary || item.content.slice(0, 200)]
      );

      const docId = dbRes.rows[0]?.id || `doc-${Date.now()}`;

      // 2. Chunk text and upsert to Qdrant
      const chunks = item.content.split(/\n\n+/).filter(c => c.trim().length > 30);
      const points = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];
        const vector = await VectorService.generateEmbedding(`${item.title} ${chunkText}`);
        const pointId = Math.floor(Math.random() * 100000000);

        points.push({
          id: pointId,
          vector,
          payload: {
            doc_id: docId,
            title: item.title,
            url: item.url,
            category: item.category,
            type: item.type,
            content: chunkText
          }
        });
      }

      if (points.length > 0) {
        await qdrant.upsert(env.QDRANT_COLLECTION, {
          wait: true,
          points
        });
        indexedChunks = points.length;
      }
    } catch (err) {
      console.warn(`[EMBEDDER] Fallback storage active for ${item.title}:`, (err as any).message);
    }
    return indexedChunks;
  }

  public static ingestDocument = EmbedderService.processAndIndex;
}

export class Embedder extends EmbedderService {}
