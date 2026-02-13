import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);

// Initialize the db instance first to capture the correct type with schema
const dbInstance = drizzle(sql, { schema });

// Use a global variable to store the Drizzle instance in development
const globalForDb = global as unknown as { db: typeof dbInstance };

export const db = globalForDb.db || dbInstance;

if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
}

