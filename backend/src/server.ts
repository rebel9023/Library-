import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import client from 'prom-client';
import { env } from './config/env';
import { initDB } from './config/database';
import { initQdrant } from './config/qdrant';
import { initScheduler } from './scraper/scheduler';
import { Crawler } from './scraper/crawler';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { sanitizeInput } from './middleware/sanitizer.middleware';
import { enforceSLA } from './middleware/performance.middleware';
import { errorHandler } from './middleware/errorHandler';
import { DisasterRecoveryService } from './services/disasterRecovery.service';
import { MonitoringService, apiErrorsCounter } from './services/monitoring.service';

import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import analyticsRoutes from './routes/analytics.routes';
import scraperRoutes from './routes/scraper.routes';
import resourceRoutes from './routes/resource.routes';
import complianceRoutes from './routes/compliance.routes';

const app = express();

// 1. Prometheus Telemetry Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1.2, 2.5, 3.0]
});

// 2. Enterprise Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'", "https://sites.google.com", "https://*.google.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 3. CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// 4. Rate Limiting, SLA & Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(apiLimiter);
app.use(sanitizeInput);
app.use(enforceSLA);

// 5. Track Metrics & API Errors
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode.toString())
      .observe(duration);

    if (res.statusCode >= 400) {
      apiErrorsCounter.inc();
    }
  });
  next();
});

// 6. Metrics Endpoint (Prometheus Scrape Target)
app.get('/metrics', async (req, res) => {
  await MonitoringService.updateMetrics();
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.get('/api/health', async (req, res) => {
  const telemetry = await MonitoringService.updateMetrics();
  res.json({
    status: 'healthy',
    platform: 'GyanAI Digital Library Intelligence Platform',
    institution: 'Parul University - Gyanoday Bhavan',
    monitoringFlow: 'Frontend -> Backend -> Prometheus -> Grafana -> Slack/Email Alerts',
    telemetry,
    timestamp: new Date().toISOString()
  });
});

// 7. Register API Routers
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/compliance', complianceRoutes);

// Error Handling
app.use(errorHandler);

const startServer = async () => {
  await initDB();
  await initQdrant();
  initScheduler();
  DisasterRecoveryService.initBackupSchedulers();

  // Trigger non-blocking automated site crawl for both portals on startup
  Crawler.runCrawl().catch(console.error);

  const port = parseInt(env.PORT, 10);
  app.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 GyanAI Backend Server running on port ${port}`);
    console.log(`📊 Monitoring Pipeline: Frontend -> Backend -> Prometheus -> Grafana -> Slack/Email Alerts`);
    console.log(`📈 Metrics Tracked: CPU, RAM, Disk, API Errors, Fallbacks, Ollama & Qdrant Health`);
    console.log(`🏛️ Parul University - Gyanoday Bhavan Digital Library`);
    console.log(`🌐 Crawling Enabled for BOTH Portals:`);
    console.log(`   1. https://www.paruluniversity.ac.in/academics/pu-libraries/`);
    console.log(`   2. https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home`);
    console.log(`=======================================================`);
  });
};

startServer();
