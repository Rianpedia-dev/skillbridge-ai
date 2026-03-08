import postgres from "postgres";
import { readFileSync, readdirSync } from "fs";
import { config } from "dotenv";
import { join } from "path";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function migrate() {
    console.log("🚀 Running migration...");

    const drizzleDir = join(process.cwd(), "drizzle");
    const migrationFiles = readdirSync(drizzleDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();

    for (const file of migrationFiles) {
        console.log(`\n📄 Processing: ${file}`);
        const migrationFile = join(drizzleDir, file);
        const migrationSql = readFileSync(migrationFile, "utf-8");

        // Split by statement breakpoint and execute each statement
        const statements = migrationSql
            .split("-->  statement-breakpoint")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        for (const statement of statements) {
            try {
                // If it's a multi-statement block without breakpoint, we'll try to execute it as is if it's not too long
                // This is a simple fallback for custom SQL files like our storage bucket one
                await sql.unsafe(statement);
                console.log("  ✅", statement.substring(0, 60).replace(/\n/g, " ") + "...");
            } catch (error: any) {
                // Skip "already exists" errors
                if (error.code === "42710" || error.code === "42P07" || error.message.includes("already exists")) {
                    console.log("  ⏭️  Already exists, skipping:", statement.substring(0, 60).replace(/\n/g, " ") + "...");
                } else {
                    console.error("  ❌ Error:", error.message);
                    console.error("     Statement:", statement.substring(0, 100));
                }
            }
        }
    }

    console.log("\n✅ Migration completed!");
    await sql.end();
    process.exit(0);
}

migrate().catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});
