import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { freelancerBalance, balanceTransaction, payout } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * GET /api/payouts
 * 
 * Returns payout history for the authenticated freelancer.
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
                { error: "Hanya freelancer yang dapat mengakses data penarikan" },
                { status: 403 }
            );
        }

        const payouts = await db.query.payout.findMany({
            where: eq(payout.userId, session.user.id),
            orderBy: [desc(payout.createdAt)],
        });

        return NextResponse.json({ payouts });
    } catch (error) {
        console.error("Payouts Fetch Error:", error);
        return NextResponse.json(
            { error: "Gagal memuat data penarikan" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/payouts
 * 
 * Request a withdrawal of available balance.
 * 
 * Body:
 * - amount: number (amount to withdraw in IDR)
 * - bankName: string
 * - bankAccountNumber: string
 * - bankAccountName: string
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "freelancer") {
            return NextResponse.json(
                { error: "Hanya freelancer yang dapat melakukan penarikan" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { amount, bankName, bankAccountNumber, bankAccountName } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: "Jumlah penarikan harus lebih dari 0" },
                { status: 400 }
            );
        }

        if (!bankName || !bankAccountNumber || !bankAccountName) {
            return NextResponse.json(
                { error: "Data rekening bank wajib diisi (nama bank, nomor rekening, nama pemilik)" },
                { status: 400 }
            );
        }

        // Check available balance
        const balanceRecord = await db.query.freelancerBalance.findFirst({
            where: eq(freelancerBalance.userId, session.user.id),
        });

        const currentBalance = balanceRecord?.balance || 0;

        if (currentBalance < amount) {
            return NextResponse.json(
                { error: `Saldo tidak mencukupi. Saldo saat ini: Rp ${currentBalance.toLocaleString("id-ID")}` },
                { status: 400 }
            );
        }

        // Process withdrawal in a transaction
        let newPayout: any;
        await db.transaction(async (tx) => {
            // 1. Deduct balance
            await tx
                .update(freelancerBalance)
                .set({
                    balance: currentBalance - amount,
                    updatedAt: new Date(),
                })
                .where(eq(freelancerBalance.userId, session.user.id));

            // 2. Create payout record
            const [created] = await tx.insert(payout).values({
                userId: session.user.id,
                amount,
                status: "pending",
                bankName,
                bankAccountNumber,
                bankAccountName,
            }).returning();

            newPayout = created;

            // 3. Log balance transaction
            await tx.insert(balanceTransaction).values({
                userId: session.user.id,
                type: "withdrawal",
                amount: -amount,
                description: `Penarikan ke ${bankName} - ${bankAccountNumber} (${bankAccountName})`,
            });
        });

        return NextResponse.json({
            message: "Permintaan penarikan berhasil dibuat",
            payout: newPayout,
            remainingBalance: currentBalance - amount,
        }, { status: 201 });
    } catch (error: any) {
        console.error("Payout Request Error:", error);
        return NextResponse.json(
            { error: error.message || "Gagal membuat permintaan penarikan" },
            { status: 500 }
        );
    }
}
