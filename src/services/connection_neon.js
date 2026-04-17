import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './api_neon';

const sql = neon(import.meta.env.VITE_NEON_URL);
export const db = drizzle(sql, { schema });