import cron from 'node-cron';
import { Crawler } from './crawler';
import { env } from '../config/env';

export const initScheduler = () => {
  console.log(`Initializing Scraper Cron Scheduler [Cron: ${env.SCRAPE_INTERVAL_CRON}]`);

  // Run automatically every 6 hours
  cron.schedule(env.SCRAPE_INTERVAL_CRON, async () => {
    console.log('[CRON] Executing scheduled 6-hour Gyanoday Bhavan knowledge base scrape...');
    try {
      await Crawler.runCrawl();
    } catch (err) {
      console.error('[CRON] Scrape failed:', (err as Error).message);
    }
  });
};
