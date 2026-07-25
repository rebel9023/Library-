import { Pool } from 'pg';
import { env } from './env';
import fs from 'fs';
import path from 'path';

export const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const initDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL Database successfully');
    
    // Read and run schema setup
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await client.query(schemaSql);
      console.log('PostgreSQL schema initialized successfully');
    }
    client.release();
  } catch (err) {
    console.warn('PostgreSQL connection warning (fallback to mock mode if DB unavailable):', (err as Error).message);
  }
};
