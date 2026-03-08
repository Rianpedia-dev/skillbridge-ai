import { db } from "@/lib/db";
import { user, service, order } from "@/lib/db/schema";
import { count, eq, sum } from "drizzle-orm";
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
        const [userCount] = await db.select({ value: count() }).from(user);
        const [serviceCount] = await db.select({ value: count() }).from(service);
        const [orderCount] = await db.select({ value: count() }).from(order);

        const [totalRevenueResult] = await db
            .select({ value: sum(order.totalPrice) })
            .from(order)
            .where(eq(order.paymentStatus, "released"));

        const totalRevenue = Number(totalRevenueResult?.value || 0);

        // Get latest orders with details
        const latestOrders = await db.query.order.findMany({
            limit: 5,
            orderBy: (order, { desc }) => [desc(order.createdAt)],
            with: {
                service: true,
                customer: true,
                freelancer: true,
            },
        });

        return NextResponse.json({
            stats: {
                users: userCount.value,
                services: serviceCount.value,
                orders: orderCount.value,
                revenue: totalRevenue,
            },
            latestOrders,
        });
    } catch (error) {
        console.error("Admin stats fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
