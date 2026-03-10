import { db } from "@/lib/db";
import { user, service, order, chatRoom, chatMessage } from "@/lib/db/schema";
import { count, eq, sum, gte, lte, and } from "drizzle-orm";
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

        const [activeServiceCount] = await db
            .select({ value: count() })
            .from(service)
            .where(eq(service.isActive, true));

        const [inactiveServiceCount] = await db
            .select({ value: count() })
            .from(service)
            .where(eq(service.isActive, false));

        const [totalRevenueResult] = await db
            .select({ value: sum(order.totalPrice) })
            .from(order)
            .where(eq(order.paymentStatus, "released"));

        const totalRevenue = Number(totalRevenueResult?.value || 0);

        // Chat / interaction stats
        const [chatRoomCount] = await db.select({ value: count() }).from(chatRoom);
        const [chatMessageCount] = await db.select({ value: count() }).from(chatMessage);

        // New users this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const [newUsersThisWeek] = await db
            .select({ value: count() })
            .from(user)
            .where(gte(user.createdAt, oneWeekAgo));

        // Total users last week for growth calculation
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const [newUsersPrevWeek] = await db
            .select({ value: count() })
            .from(user)
            .where(and(gte(user.createdAt, twoWeeksAgo), lte(user.createdAt, oneWeekAgo)));

        const growthPercentage = newUsersPrevWeek.value > 0
            ? (((newUsersThisWeek.value - newUsersPrevWeek.value) / newUsersPrevWeek.value) * 100).toFixed(1)
            : newUsersThisWeek.value > 0 ? "100" : "0";

        // Pending/unpaid orders
        const [pendingOrderCount] = await db
            .select({ value: count() })
            .from(order)
            .where(eq(order.status, "pending"));

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
                activeServices: activeServiceCount.value,
                inactiveServices: inactiveServiceCount.value,
                orders: orderCount.value,
                revenue: totalRevenue,
                chatRooms: chatRoomCount.value,
                chatMessages: chatMessageCount.value,
                newUsersThisWeek: newUsersThisWeek.value,
                growthPercentage,
                pendingOrders: pendingOrderCount.value,
            },
            latestOrders,
        });
    } catch (error) {
        console.error("Admin stats fetch error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
