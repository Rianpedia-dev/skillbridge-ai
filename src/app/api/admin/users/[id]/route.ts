import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PATCH: Update user (name, email, role, banned)
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

        if (body.name !== undefined) updateData.name = body.name;
        if (body.email !== undefined) updateData.email = body.email;
        if (body.role !== undefined) updateData.role = body.role;
        if (body.banned !== undefined) updateData.banned = body.banned;
        if (body.bannedReason !== undefined) updateData.bannedReason = body.bannedReason;

        updateData.updatedAt = new Date();

        const [updatedUser] = await db
            .update(user)
            .set(updateData)
            .where(eq(user.id, id))
            .returning();

        if (!updatedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Admin user update error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE: Delete user
export async function DELETE(
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

    // Admin cannot delete themselves
    if (id === session.user.id) {
        return NextResponse.json(
            { error: "Anda tidak dapat menghapus akun sendiri" },
            { status: 400 }
        );
    }

    try {
        const [deletedUser] = await db
            .delete(user)
            .where(eq(user.id, id))
            .returning();

        if (!deletedUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User berhasil dihapus" });
    } catch (error) {
        console.error("Admin user delete error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
