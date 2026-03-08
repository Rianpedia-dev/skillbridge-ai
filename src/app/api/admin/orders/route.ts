import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
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
        const orders = await db.query.order.findMany({
            orderBy: [desc(order.createdAt)],
            with: {
                service: true,
                customer: true,
                freelancer: true,
            }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Admin order list fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
