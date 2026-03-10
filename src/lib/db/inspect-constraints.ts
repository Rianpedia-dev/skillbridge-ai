import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function inspectConstraints() {
    console.log("Inspecting database constraints...");
    try {
        const results = await sql.unsafe(`
            SELECT 
                n.nspname as schema,
                t.typname as domain_name,
                c.conname as constraint_name,
                pg_get_constraintdef(c.oid) as definition
            FROM pg_constraint c
            JOIN pg_type t ON t.oid = c.contypid
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE c.contype = 'c';
        `);
        console.log(JSON.stringify(results, null, 2));
    } catch (e: any) {
        console.error("Error inspecting constraints:", e.message);
    } finally {
        await sql.end();
    }
}

inspectConstraints();
