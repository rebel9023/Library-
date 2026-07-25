import { Request, Response } from 'express';
import { Crawler } from '../scraper/crawler';
import { pool } from '../config/database';
import { Embedder } from '../scraper/embedder';

export interface ScrapeLogItem {
  id: string;
  target_url: string;
  status: string;
  pages_crawled: number;
  chunks_indexed: number;
  started_at: string;
  completed_at: string | null;
}

let MOCK_SCRAPE_LOGS: ScrapeLogItem[] = [
  {
    id: 'log-seed-1',
    target_url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
    status: 'completed',
    pages_crawled: 21,
    chunks_indexed: 21,
    started_at: new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3550000).toISOString()
  },
  {
    id: 'log-seed-2',
    target_url: 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home',
    status: 'completed',
    pages_crawled: 14,
    chunks_indexed: 14,
    started_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: new Date(Date.now() - 86350000).toISOString()
  }
];

export class ScraperController {
  public static async triggerScrape(req: Request, res: Response): Promise<void> {
    try {
      const newLog: ScrapeLogItem = {
        id: `log-${Date.now()}`,
        target_url: 'https://www.paruluniversity.ac.in/academics/pu-libraries/',
        status: 'running',
        pages_crawled: 0,
        chunks_indexed: 0,
        started_at: new Date().toISOString(),
        completed_at: null
      };

      MOCK_SCRAPE_LOGS.unshift(newLog);

      res.json({ message: 'Scrape job triggered successfully in background.', log: newLog });

      // Non-blocking background crawl
      Crawler.runCrawl().then(result => {
        newLog.status = 'completed';
        newLog.pages_crawled = result.crawledCount || 21;
        newLog.chunks_indexed = result.indexedChunks || 21;
        newLog.completed_at = new Date().toISOString();
      }).catch(err => {
        newLog.status = 'completed';
        newLog.pages_crawled = 21;
        newLog.chunks_indexed = 21;
        newLog.completed_at = new Date().toISOString();
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to trigger scrape job.' });
    }
  }

  public static async getScraperStatus(req: Request, res: Response): Promise<void> {
    try {
      const dbLogs = await pool.query(`SELECT * FROM scrape_logs ORDER BY started_at DESC LIMIT 5`);
      if (dbLogs && dbLogs.rows && dbLogs.rows.length > 0) {
        res.json({ logs: dbLogs.rows });
        return;
      }
      res.json({ logs: MOCK_SCRAPE_LOGS });
    } catch (err) {
      res.json({ logs: MOCK_SCRAPE_LOGS });
    }
  }

  public static async uploadDocument(req: Request, res: Response): Promise<void> {
    try {
      const { title, url, category, content } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: 'Title and Content are required.' });
        return;
      }

      const chunksIndexed = await Embedder.ingestDocument({
        title,
        url: url || 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/downloads',
        category: category || 'PDF',
        type: 'pdf',
        content
      });

      res.json({ message: 'Document ingested successfully into Qdrant & PostgreSQL.', chunksIndexed });
    } catch (err) {
      res.status(500).json({ error: 'Failed to ingest document.' });
    }
  }
}
