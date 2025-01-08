import { env } from '@/data/env/server';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

//replaced env var with the type safe one created in data/env/server.ts
//passed the schemas made in .schema for the db object to know the schemas
export const db = drizzle(env.DATABASE_URL, { schema });
