import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const DATABASE_URL="postgresql://postgres.zqbktztdwzmdlqxvjdno:nornaf-Suwwa0-cycxyr@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

export const queryClient = postgres(DATABASE_URL, {
  max: 1,
  connect_timeout: 10,
  ssl: 'require' // ✅ Supabase requires SSL
});

export const db = drizzle(queryClient);
