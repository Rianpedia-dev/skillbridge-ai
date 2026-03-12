import { db } from "@/lib/db";
import { order } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, paymentStatus } = body;

        const updateData: any = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const [updatedOrder] = await db
            .update(order)
            .set(updateData)
            .where(eq(order.id, id))
            .returning();

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Failed to update order:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        await db.delete(order).where(eq(order.id, id));

        return new NextResponse("Order deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Failed to delete order:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
