import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env.local") });

import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";

async function promoteAdmin(email: string) {
    console.log(`🚀 Promoting ${email} to admin...`);

    try {
        const result = await db
            .update(user)
            .set({ role: "admin" })
            .where(eq(user.email, email))
            .returning();

        if (result.length > 0) {
            console.log(`✅ User ${email} is now an admin!`);
        } else {
            console.log(`❌ User with email ${email} not found.`);
            console.log(`💡 Please register first at /register, then run this script again.`);
        }
    } catch (error) {
        console.error("❌ Error promoting user:", error);
    } finally {
        process.exit(0);
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: npx tsx src/lib/db/promote-admin.ts <email>");
    process.exit(1);
}

promoteAdmin(email);
