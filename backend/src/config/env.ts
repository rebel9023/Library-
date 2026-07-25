import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // PostgreSQL
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  POSTGRES_DB: process.env.POSTGRES_DB || 'gyanai_db',
  POSTGRES_USER: process.env.POSTGRES_USER || 'gyanai_user',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'gyanai_secure_password_2026',

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',

  // Qdrant
  QDRANT_URL: process.env.QDRANT_URL || 'http://localhost:6333',
  QDRANT_COLLECTION: process.env.QDRANT_COLLECTION || 'gyanoday_knowledge',

  // Ollama
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'qwen:3-8b',

  // Auth & Admin
  JWT_SECRET: process.env.JWT_SECRET || 'parul_university_gyanai_secret_key_2026_super_secure',

  // Scraper
  SCRAPE_INTERVAL_CRON: process.env.SCRAPE_INTERVAL_CRON || '0 */6 * * *',
  TARGET_SITE_URL: process.env.TARGET_SITE_URL || 'https://sites.google.com/paruluniversity.ac.in/gyanodaybhavan/home'
};
