import { Router } from 'express';
import { ScraperController } from '../controllers/scraper.controller';

const router = Router();

// Allow scraper status & trigger endpoints for Admin Dashboard
router.post('/trigger', ScraperController.triggerScrape);
router.get('/status', ScraperController.getScraperStatus);
router.post('/upload', ScraperController.uploadDocument);

export default router;
