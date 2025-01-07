import { env } from '@/data/env/server';
import { drizzle } from 'drizzle-orm/neon-http';

//replaced env var with the type safe one created in data/env/server.ts
export const db = drizzle(env.DATABASE_URL);
