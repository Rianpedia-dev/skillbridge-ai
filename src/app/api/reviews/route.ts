import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { review, order, service } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST /api/reviews — Submit a review for a completed order
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, rating, comment } = body;

        if (!orderId || !rating) {
            return NextResponse.json(
                { error: "Order ID dan rating wajib diisi" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating harus antara 1-5" },
                { status: 400 }
            );
        }

        // Verify the order exists and belongs to this user
        const targetOrder = await db.query.order.findFirst({
            where: eq(order.id, orderId),
        });

        if (!targetOrder) {
            return NextResponse.json(
                { error: "Pesanan tidak ditemukan" },
                { status: 404 }
            );
        }

        if (targetOrder.customerId !== session.user.id) {
            return NextResponse.json(
                { error: "Anda tidak bisa mereview pesanan ini" },
                { status: 403 }
            );
        }

        if (targetOrder.status !== "completed") {
            return NextResponse.json(
                { error: "Hanya bisa mereview pesanan yang sudah selesai" },
                { status: 400 }
            );
        }

        // Create the review
        const [newReview] = await db
            .insert(review)
            .values({
                orderId,
                reviewerId: session.user.id,
                freelancerId: targetOrder.freelancerId,
                rating,
                comment: comment || null,
            })
            .returning();

        // Update the service's average rating
        await db
            .update(service)
            .set({
                rating: sql`(
          SELECT COALESCE(AVG(${review.rating})::real, 0)
          FROM ${review}
          JOIN ${order} ON ${review.orderId} = ${order.id}
          WHERE ${order.serviceId} = ${service.id}
        )`,
                reviewCount: sql`${service.reviewCount} + 1`,
            })
            .where(eq(service.id, targetOrder.serviceId));

        return NextResponse.json({ review: newReview }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Gagal membuat review" },
            { status: 500 }
        );
    }
}
