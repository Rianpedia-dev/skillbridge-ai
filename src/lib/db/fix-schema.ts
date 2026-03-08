import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function fixSchema() {
    console.log("Creating missing enums and tables...");

    // Create enum types first
    try {
        await sql.unsafe(`CREATE TYPE "public"."balance_transaction_type" AS ENUM('earning', 'withdrawal', 'refund')`);
        console.log("OK: balance_transaction_type enum created");
    } catch (e: any) {
        console.log("enum balance_transaction_type:", e.message);
    }

    try {
        await sql.unsafe(`CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'failed')`);
        console.log("OK: payout_status enum created");
    } catch (e: any) {
        console.log("enum payout_status:", e.message);
    }

    // Create balance_transaction table
    try {
        await sql.unsafe(`
            CREATE TABLE IF NOT EXISTS "balance_transaction" (
                "id" text PRIMARY KEY NOT NULL,
                "user_id" text NOT NULL,
                "order_id" text,
                "type" "balance_transaction_type" NOT NULL,
                "amount" integer NOT NULL,
                "description" text,
                "created_at" timestamp DEFAULT now() NOT NULL
            )
        `);
        console.log("OK: balance_transaction table created");
    } catch (e: any) {
        console.log("balance_transaction table:", e.message);
    }

    // Create payout table
    try {
        await sql.unsafe(`
            CREATE TABLE IF NOT EXISTS "payout" (
                "id" text PRIMARY KEY NOT NULL,
                "user_id" text NOT NULL,
                "amount" integer NOT NULL,
                "status" "payout_status" DEFAULT 'pending' NOT NULL,
                "bank_name" text,
                "bank_account_number" text,
                "bank_account_name" text,
                "note" text,
                "processed_at" timestamp,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL
            )
        `);
        console.log("OK: payout table created");
    } catch (e: any) {
        console.log("payout table:", e.message);
    }

    // Add foreign keys
    const fks = [
        [`balance_transaction user FK`, `ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`],
        [`balance_transaction order FK`, `ALTER TABLE "balance_transaction" ADD CONSTRAINT "balance_transaction_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action`],
        [`payout user FK`, `ALTER TABLE "payout" ADD CONSTRAINT "payout_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`],
    ];

    for (const [name, fkSql] of fks) {
        try {
            await sql.unsafe(fkSql);
            console.log(`OK: ${name}`);
        } catch (e: any) {
            if (e.message?.includes("already exists")) {
                console.log(`Skip: ${name} (already exists)`);
            } else {
                console.log(`${name}: ${e.message}`);
            }
        }
    }

    console.log("\nAll done!");
    await sql.end();
    process.exit(0);
}

fixSchema();
