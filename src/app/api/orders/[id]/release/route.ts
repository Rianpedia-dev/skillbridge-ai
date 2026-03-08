import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, freelancerBalance, balanceTransaction } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";

/**
 * POST /api/orders/[id]/release
 * 
 * Customer confirms the work is done and releases escrow funds to the freelancer's balance.
 * 
 * Requirements:
 * - Only the customer of the order can release funds
 * - Order must have status "completed" and paymentStatus "escrow"
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: orderId } = await params;

        // Fetch the order
        const targetOrder = await db.query.order.findFirst({
            where: eq(order.id, orderId),
            with: {
                service: {
                    columns: { title: true },
                },
            },
        });

        if (!targetOrder) {
            return NextResponse.json(
                { error: "Pesanan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Only the customer can release funds
        if (targetOrder.customerId !== session.user.id) {
            return NextResponse.json(
                { error: "Hanya customer yang dapat melepas dana escrow" },
                { status: 403 }
            );
        }

        // Order must be completed and in escrow
        if (targetOrder.status !== "completed") {
            return NextResponse.json(
                { error: "Pesanan belum selesai dikerjakan oleh freelancer" },
                { status: 400 }
            );
        }

        if (targetOrder.paymentStatus !== "escrow") {
            return NextResponse.json(
                { error: "Dana escrow sudah dilepaskan atau belum tersedia" },
                { status: 400 }
            );
        }

        // Calculate freelancer payout (total price minus platform fee)
        // Platform fee is already included in totalPrice (which is price * 1.1)
        // So freelancer gets the original service price
        const freelancerEarning = Math.round(targetOrder.totalPrice / 1.1);

        // Start transaction: update order + update/create freelancer balance + log
        await db.transaction(async (tx) => {
            // 1. Update order payment status to "released"
            await tx
                .update(order)
                .set({
                    paymentStatus: "released",
                    updatedAt: new Date(),
                })
                .where(eq(order.id, orderId));

            // 2. Upsert freelancer balance
            const existingBalance = await tx.query.freelancerBalance.findFirst({
                where: eq(freelancerBalance.userId, targetOrder.freelancerId),
            });

            if (existingBalance) {
                await tx
                    .update(freelancerBalance)
                    .set({
                        balance: existingBalance.balance + freelancerEarning,
                        updatedAt: new Date(),
                    })
                    .where(eq(freelancerBalance.userId, targetOrder.freelancerId));
            } else {
                await tx.insert(freelancerBalance).values({
                    userId: targetOrder.freelancerId,
                    balance: freelancerEarning,
                });
            }

            // 3. Log balance transaction
            await tx.insert(balanceTransaction).values({
                userId: targetOrder.freelancerId,
                orderId: orderId,
                type: "earning",
                amount: freelancerEarning,
                description: `Pembayaran untuk pesanan #${targetOrder.orderNumber} — ${targetOrder.service?.title || "Layanan"}`,
            });
        });

        return NextResponse.json({
            message: "Dana escrow berhasil dilepaskan ke freelancer",
            earning: freelancerEarning,
        });
    } catch (error: any) {
        console.error("Release Fund Error:", error);
        return NextResponse.json(
            { error: error.message || "Gagal melepas dana escrow" },
            { status: 500 }
        );
    }
}
