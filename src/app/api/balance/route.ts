import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { freelancerBalance, balanceTransaction } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * GET /api/balance
 * 
 * Returns the current balance and recent transactions for the authenticated freelancer.
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "freelancer") {
            return NextResponse.json(
                { error: "Hanya freelancer yang dapat mengakses saldo" },
                { status: 403 }
            );
        }

        const balance = await db.query.freelancerBalance.findFirst({
            where: eq(freelancerBalance.userId, session.user.id),
        });

        // Fetch recent balance transactions
        const transactions = await db.query.balanceTransaction.findMany({
            where: eq(balanceTransaction.userId, session.user.id),
            orderBy: [desc(balanceTransaction.createdAt)],
            limit: 20,
        });

        return NextResponse.json({
            balance: balance?.balance || 0,
            transactions,
        });
    } catch (error) {
        console.error("Balance Fetch Error:", error);
        return NextResponse.json(
            { error: "Gagal memuat saldo" },
            { status: 500 }
        );
    }
}
