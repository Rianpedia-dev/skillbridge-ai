import { db } from "@/lib/db";
import { service } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PATCH: Toggle service active status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await request.json();

        const updateData: Record<string, any> = {};
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        updateData.updatedAt = new Date();

        const [updatedService] = await db
            .update(service)
            .set(updateData)
            .where(eq(service.id, id))
            .returning();

        if (!updatedService) {
            return new NextResponse("Service not found", { status: 404 });
        }

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error("Admin service update error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
