import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch since we're using connection pooling with Supabase
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
