import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const users = await db.select().from(user).orderBy(desc(user.createdAt));
        return NextResponse.json(users);
    } catch (error) {
        console.error("Admin user list fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
