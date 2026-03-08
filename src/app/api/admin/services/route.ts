import { db } from "@/lib/db";
import { service } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
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
        const services = await db.query.service.findMany({
            orderBy: (service, { desc }) => [desc(service.createdAt)],
            with: {
                provider: true,
                category: true,
            }
        });
        return NextResponse.json(services);
    } catch (error) {
        console.error("Admin service list fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
