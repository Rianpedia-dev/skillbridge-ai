import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set in .env.local");
    process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function addChatTables() {
    console.log("Creating chat tables manually...");

    // Create chat_room table
    try {
        await sql.unsafe(`
            CREATE TABLE IF NOT EXISTS "chat_room" (
                "id" text PRIMARY KEY NOT NULL,
                "participant_one_id" text NOT NULL,
                "participant_two_id" text NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL,
                "updated_at" timestamp DEFAULT now() NOT NULL
            )
        `);
        console.log("OK: chat_room table created");
    } catch (e: any) {
        console.log("chat_room table:", e.message);
    }

    // Create chat_message table
    try {
        await sql.unsafe(`
            CREATE TABLE IF NOT EXISTS "chat_message" (
                "id" text PRIMARY KEY NOT NULL,
                "room_id" text NOT NULL,
                "sender_id" text NOT NULL,
                "content" text NOT NULL,
                "is_read" boolean DEFAULT false NOT NULL,
                "created_at" timestamp DEFAULT now() NOT NULL
            )
        `);
        console.log("OK: chat_message table created");
    } catch (e: any) {
        console.log("chat_message table:", e.message);
    }

    // Add foreign keys
    const fks = [
        [`chat_room participant_one FK`, `ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_one_id_user_id_fk" FOREIGN KEY ("participant_one_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`],
        [`chat_room participant_two FK`, `ALTER TABLE "chat_room" ADD CONSTRAINT "chat_room_participant_two_id_user_id_fk" FOREIGN KEY ("participant_two_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`],
        [`chat_message room FK`, `ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_room_id_chat_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_room"("id") ON DELETE cascade ON UPDATE no action`],
        [`chat_message sender FK`, `ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`],
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

    console.log("\nChat tables setup complete!");
    await sql.end();
    process.exit(0);
}

addChatTables();
