import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order, service } from "@/lib/db/schema";
import { eq, desc, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { mayar } from "@/lib/mayar";

// Generate unique order number
function generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `ORD-${year}-${random}`;
}

// GET /api/orders — List user's orders
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const orders = await db.query.order.findMany({
            where: or(eq(order.customerId, userId), eq(order.freelancerId, userId)),
            orderBy: [desc(order.createdAt)],
            with: {
                service: {
                    columns: {
                        id: true,
                        title: true,
                        price: true,
                        image: true,
                    },
                },
                customer: {
                    columns: { id: true, name: true, image: true },
                },
                freelancer: {
                    columns: { id: true, name: true, image: true },
                },
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Gagal memuat pesanan" },
            { status: 500 }
        );
    }
}

// POST /api/orders — Create a new order + Mayar payment link
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { serviceId, requirements } = body;

        if (!serviceId) {
            return NextResponse.json(
                { error: "Service ID wajib diisi" },
                { status: 400 }
            );
        }

        // Fetch the service to get provider and price
        const targetService = await db.query.service.findFirst({
            where: eq(service.id, serviceId),
        });

        if (!targetService) {
            return NextResponse.json(
                { error: "Layanan tidak ditemukan" },
                { status: 404 }
            );
        }

        if (targetService.providerId === session.user.id) {
            return NextResponse.json(
                { error: "Anda tidak bisa memesan layanan sendiri" },
                { status: 400 }
            );
        }

        const serviceFee = Math.round(targetService.price * 0.1);
        const totalPrice = targetService.price + serviceFee;

        const [newOrder] = await db
            .insert(order)
            .values({
                orderNumber: generateOrderNumber(),
                serviceId,
                customerId: session.user.id,
                freelancerId: targetService.providerId,
                totalPrice,
                requirements: requirements || null,
                status: "pending",
                paymentStatus: "unpaid",
            })
            .returning();

        // --- Integrate Mayar ---
        console.log(`Creating Mayar payment link for order ${newOrder.orderNumber}...`);
        const description = `Pembayaran untuk layanan: ${targetService.title} (#${newOrder.orderNumber})`;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const mayarResponse = await mayar.createPaymentLink({
            name: session.user.name || "Customer",
            email: session.user.email,
            amount: totalPrice,
            mobile: "081234567890",
            description,
            redirectUrl: `${baseUrl}/payment/success?orderId=${newOrder.id}`,
            extraData: {
                orderId: newOrder.id,
                orderNumber: newOrder.orderNumber,
            },
        });

        if (!mayarResponse || !mayarResponse.link) {
            throw new Error("Gagal mendapatkan link pembayaran dari Mayar");
        }

        // Save Mayar transaction ID to the order
        if (mayarResponse.transactionId) {
            await db
                .update(order)
                .set({ mayarTransactionId: mayarResponse.transactionId })
                .where(eq(order.id, newOrder.id));
        }

        return NextResponse.json({
            order: newOrder,
            paymentLink: mayarResponse.link,
        }, { status: 201 });
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json(
            { error: error.message || "Gagal membuat pesanan" },
            { status: 500 }
        );
    }
}

// PATCH /api/orders — Update an order's status
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: "ID pesanan dan status wajib diisi" },
                { status: 400 }
            );
        }

        const validStatuses = ["pending", "accepted", "in_progress", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Status pesanan tidak valid" },
                { status: 400 }
            );
        }

        // Verify ownership/authorization
        const targetOrder = await db.query.order.findFirst({
            where: eq(order.id, id),
        });

        if (!targetOrder) {
            return NextResponse.json(
                { error: "Pesanan tidak ditemukan" },
                { status: 404 }
            );
        }

        // Authorization check
        const isFreelancer = targetOrder.freelancerId === session.user.id;
        const isCustomer = targetOrder.customerId === session.user.id;

        if (!isFreelancer && !isCustomer) {
            return NextResponse.json(
                { error: "Anda tidak berhak mengubah status pesanan ini" },
                { status: 403 }
            );
        }

        // Freelancer can: accepted → in_progress → completed
        if (isFreelancer && !isCustomer) {
            const freelancerAllowed = ["accepted", "in_progress", "completed"];
            if (!freelancerAllowed.includes(status)) {
                return NextResponse.json(
                    { error: "Freelancer hanya dapat memperbarui status: accepted, in_progress, completed" },
                    { status: 403 }
                );
            }
        }

        // Customer can only cancel
        if (isCustomer && !isFreelancer) {
            if (status !== "cancelled") {
                return NextResponse.json(
                    { error: "Customer hanya dapat membatalkan pesanan" },
                    { status: 403 }
                );
            }
            // Can only cancel if not yet in progress
            if (!["pending"].includes(targetOrder.status)) {
                return NextResponse.json(
                    { error: "Pesanan yang sudah dikerjakan tidak bisa dibatalkan" },
                    { status: 400 }
                );
            }
        }

        const updateData: any = {
            status,
            updatedAt: new Date(),
            completedAt: status === "completed" ? new Date() : targetOrder.completedAt,
        };

        const [updatedOrder] = await db
            .update(order)
            .set(updateData)
            .where(eq(order.id, id))
            .returning();

        return NextResponse.json({ order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Gagal memperbarui pesanan" },
            { status: 500 }
        );
    }
}
